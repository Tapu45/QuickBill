import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import authOptions from "../auth/authOptions";

// Utility function to check user access for store
async function checkUserStoreAccess(userId: string, storeId?: string) {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new Error("User not found");
    if (user.role === "ADMIN") return true;
    if (storeId) {
        const storeAssigned = await prisma.userStore.findFirst({
            where: { userId, storeId }
        });
        if (!storeAssigned) return false;
    }
    return true;
}

// CREATE Purchase Order
export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
        const body = await req.json();
        const { action, organizationId, storeId } = body;

        if (!organizationId) {
            return NextResponse.json({ error: "organizationId is required" }, { status: 400 });
        }
        if (!storeId) {
            return NextResponse.json({ error: "storeId is required" }, { status: 400 });
        }

        // Access control: check user assignment
        const hasAccess = await checkUserStoreAccess(session.user.id, storeId);
        if (!hasAccess) {
            return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }


        // Create new purchase
        if (!action) {
            const {
                invoiceNumber,
                supplierInvoiceNumber,
                purchaseDate,
                supplierId,
                subtotal,
                cgst,
                sgst,
                igst,
                freight,
                otherCharges,
                totalAmount,
                status,
                notes,
                items,
                createdById,
                storeId
            } = body;

            if (!storeId) {
                return NextResponse.json({ error: "storeId is required" }, { status: 400 });
            }

            const purchase = await prisma.purchase.create({
                data: {
                    organizationId,
                    invoiceNumber,
                    supplierInvoiceNumber,
                    purchaseDate: new Date(purchaseDate),
                    supplierId,
                    subtotal,
                    cgst,
                    sgst,
                    igst,
                    freight,
                    otherCharges,
                    totalAmount,
                    status,
                    notes,
                    createdById,
                    storeId,
                    items: {
                        create: items.map((item: any) => ({
                            productId: item.productId,
                            quantity: item.quantity,
                            rate: item.rate,
                            amount: item.amount,
                            gstAmount: item.gstAmount,
                            warehouseId: item.warehouseId,
                        }))
                    }
                },
                include: {
                    items: true,
                    supplier: true
                }
            });



            return NextResponse.json(purchase);
        }

        // Approve purchase
        if (action === "approve") {
            const { purchaseId } = body;
            const purchase = await prisma.purchase.update({
                where: { id: purchaseId, organizationId },
                data: { status: "RECEIVED" }
            });
            return NextResponse.json(purchase);
        }

        // Cancel purchase
        if (action === "cancel") {
            const { purchaseId } = body;
            const purchase = await prisma.purchase.update({
                where: { id: purchaseId, organizationId },
                data: { status: "CANCELLED" }
            });
            return NextResponse.json(purchase);
        }

        if (action === "receive") {
            const { purchaseId, items } = body;
            // Fetch the purchase order
            const purchase = await prisma.purchase.findUnique({
                where: { id: purchaseId, organizationId },
                include: { items: true }
            });
            if (!purchase) {
                return NextResponse.json({ error: "Purchase order not found" }, { status: 404 });
            }
            // Update inventory for received items
            for (const item of items) {
                await prisma.inventory.upsert({
                    where: {
                        organizationId_productId_warehouseId: {
                            organizationId,
                            productId: item.productId,
                            warehouseId: item.warehouseId
                        }
                    },
                    create: {
                        organizationId,
                        productId: item.productId,
                        warehouseId: item.warehouseId || "default",
                        quantity: item.receivedQuantity,
                        storeId: item.storeId
                    },
                    update: {
                        quantity: {
                            increment: item.receivedQuantity
                        }
                    }
                });
            }
            // Update purchase order status
            const updatedPurchase = await prisma.purchase.update({
                where: { id: purchaseId, organizationId },
                data: { status: "RECEIVED" }
            });
            return NextResponse.json(updatedPurchase);
        }

    } catch (error) {
        console.error(error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}

// GET Purchase Orders
export async function GET(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
        const { searchParams } = new URL(req.url);
        const organizationId = searchParams.get("organizationId");
        const storeId = searchParams.get("storeId");

        if (!organizationId) {
            return NextResponse.json({ error: "organizationId is required" }, { status: 400 });
        }
        if (storeId) {
            const hasAccess = await checkUserStoreAccess(session.user.id, storeId);
            if (!hasAccess) {
                return NextResponse.json({ error: "Forbidden" }, { status: 403 });
            }
        }

        const action = searchParams.get("action");

        // Get single purchase by ID
        if (action === "getById") {
            const id = searchParams.get("id");
            const purchase = await prisma.purchase.findUnique({
                where: { id: id!, organizationId: organizationId! },
                include: {
                    items: {
                        include: {
                            product: true
                        }
                    },
                    supplier: true,
                    createdBy: true
                }
            });
            return NextResponse.json(purchase);
        }

        // Get all purchases with filters
        const status = searchParams.get("status");
        const startDate = searchParams.get("startDate");
        const endDate = searchParams.get("endDate");
        const supplierId = searchParams.get("supplierId");

        let where: any = { organizationId };

        if (storeId) where.storeId = storeId; // <-- Add this line

        if (status) where.status = status;
        if (supplierId) where.supplierId = supplierId;
        if (startDate && endDate) {
            where.purchaseDate = {
                gte: new Date(startDate),
                lte: new Date(endDate)
            };
        }

        const purchases = await prisma.purchase.findMany({
            where,
            include: {
                supplier: true,
                items: {
                    include: {
                        product: true
                    }
                }
            },
            orderBy: {
                purchaseDate: 'desc'
            }
        });

        return NextResponse.json(purchases);

    } catch (error) {
        console.error(error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}

// UPDATE Purchase Order
export async function PUT(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
        const body = await req.json();
        const { id, organizationId, storeId, ...updateData } = body;

        if (!organizationId) {
            return NextResponse.json({ error: "organizationId is required" }, { status: 400 });
        }
        if (!storeId) {
            return NextResponse.json({ error: "storeId is required" }, { status: 400 });
        }

        const hasAccess = await checkUserStoreAccess(session.user.id, storeId);
        if (!hasAccess) {
            return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }

        // Can only update if status is PENDING
        const existingPurchase = await prisma.purchase.findFirst({
            where: { id, organizationId }
        });

        if (!existingPurchase || existingPurchase.status !== "PENDING") {
            return NextResponse.json(
                { error: "Purchase order cannot be modified" },
                { status: 400 }
            );
        }

        // Only update items if provided
        let updatePayload: any = {
            ...updateData,
            purchaseDate: updateData.purchaseDate ? new Date(updateData.purchaseDate) : undefined,
        };

        if (updateData.items && Array.isArray(updateData.items)) {
            updatePayload.items = {
                deleteMany: {},
                create: updateData.items.map((item: any) => ({
                    productId: item.productId,
                    quantity: item.quantity,
                    rate: item.rate,
                    amount: item.amount,
                    gstAmount: item.gstAmount
                }))
            };
        }

        const purchase = await prisma.purchase.update({
            where: { id },
            data: updatePayload,
            include: {
                items: true,
                supplier: true
            }
        });

        return NextResponse.json(purchase);

    } catch (error) {
        console.error(error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}

// DELETE Purchase Order
export async function DELETE(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
        const { searchParams } = new URL(req.url);
        const id = searchParams.get("id");
        const organizationId = searchParams.get("organizationId");
        const storeId = searchParams.get("storeId");

        if (!id || !organizationId || !storeId) {
            return NextResponse.json(
                { error: "Purchase ID, organizationId, and storeId are required" },
                { status: 400 }
            );
        }

        const hasAccess = await checkUserStoreAccess(session.user.id, storeId);
        if (!hasAccess) {
            return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }


        if (!id || !organizationId) {
            return NextResponse.json(
                { error: "Purchase ID and organizationId are required" },
                { status: 400 }
            );
        }

        // Can only delete if status is PENDING
        const existingPurchase = await prisma.purchase.findFirst({
            where: { id, organizationId }
        });

        if (!existingPurchase || existingPurchase.status !== "PENDING") {
            return NextResponse.json(
                { error: "Purchase order cannot be deleted" },
                { status: 400 }
            );
        }

        await prisma.purchase.delete({
            where: { id }
        });

        return NextResponse.json({ message: "Purchase deleted successfully" });

    } catch (error) {
        console.error(error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}