import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// CREATE Purchase Order
export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { action, organizationId } = body;

        if (!organizationId) {
            return NextResponse.json({ error: "organizationId is required" }, { status: 400 });
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
                createdById
            } = body;

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
                    items: {
                        create: items.map((item: any) => ({
                            productId: item.productId,
                            quantity: item.quantity,
                            rate: item.rate,
                            amount: item.amount,
                            gstAmount: item.gstAmount
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
                            warehouseId: item.warehouseId || "default"
                        }
                    },
                    create: {
                        organizationId,
                        productId: item.productId,
                        warehouseId: item.warehouseId || "default",
                        quantity: item.receivedQuantity
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
        const { searchParams } = new URL(req.url);
        const organizationId = searchParams.get("organizationId");
        if (!organizationId) {
            return NextResponse.json({ error: "organizationId is required" }, { status: 400 });
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
        const body = await req.json();
        const { id, organizationId, ...updateData } = body;

        if (!organizationId) {
            return NextResponse.json({ error: "organizationId is required" }, { status: 400 });
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

        // Update purchase and items
        const purchase = await prisma.purchase.update({
            where: { id },
            data: {
                ...updateData,
                purchaseDate: new Date(updateData.purchaseDate),
                items: {
                    deleteMany: {},
                    create: updateData.items.map((item: any) => ({
                        productId: item.productId,
                        quantity: item.quantity,
                        rate: item.rate,
                        amount: item.amount,
                        gstAmount: item.gstAmount
                    }))
                }
            },
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
        const { searchParams } = new URL(req.url);
        const id = searchParams.get("id");
        const organizationId = searchParams.get("organizationId");

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