import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// --- CREATE SALE (POST) ---
export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    // Expected: { invoiceNumber, saleDate, customerId, customerName, customerPhone, customerAddress, items, subtotal, discount, discountType, cgst, sgst, igst, totalAmount, paymentMethod, paymentStatus, status, notes, organizationId, createdById }
    const {
      invoiceNumber,
      saleDate,
      customerId,
      customerName,
      customerPhone,
      customerAddress,
      items,
      subtotal,
      discount,
      discountType,
      cgst,
      sgst,
      igst,
      totalAmount,
      paymentMethod,
      paymentStatus,
      status,
      notes,
      organizationId,
      createdById,
      storeId,
      counterId
    } = data;

    // Create Sale and SaleItems in a transaction
    const sale = await prisma.sale.create({
      data: {
        invoiceNumber,
        saleDate: new Date(saleDate),
        customerId,
        customerName,
        customerPhone,
        customerAddress,
        subtotal,
        discount,
        discountType,
        cgst,
        sgst,
        igst,
        totalAmount,
        paymentMethod,
        paymentStatus,
        status,
        notes,
        organizationId,
        createdById,
        storeId,
        counterId,
        items: {
          create: items.map((item: any) => ({
            productId: item.productId,
            quantity: item.quantity,
            rate: item.rate,
            discount: item.discount,
            amount: item.amount,
            gstAmount: item.gstAmount,
          })),
        },
      },
      include: { items: true },
    });

    return NextResponse.json({ success: true, sale });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ success: false, error: errorMessage }, { status: 500 });
  }
}

// --- GET SALES LIST (GET) ---
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const organizationId = searchParams.get("organizationId");
    const customerId = searchParams.get("customerId");
    const invoiceNumber = searchParams.get("invoiceNumber");
    const dateFrom = searchParams.get("dateFrom");
    const dateTo = searchParams.get("dateTo");
    const storeId = searchParams.get("storeId");
    const counterId = searchParams.get("counterId"); // <-- Add this line

    const where: any = {};
    if (organizationId) where.organizationId = organizationId;
    if (customerId) where.customerId = customerId;
    if (invoiceNumber) where.invoiceNumber = { contains: invoiceNumber };
    if (storeId) where.storeId = storeId; // <-- Add this line
    if (counterId) where.counterId = counterId; // <-- Add this line
    if (dateFrom || dateTo) {
      where.saleDate = {};
      if (dateFrom) where.saleDate.gte = new Date(dateFrom);
      if (dateTo) {
        const toDate = new Date(dateTo);
        toDate.setDate(toDate.getDate() + 1);
        where.saleDate.lt = toDate;
      }
    }

    const sales = await prisma.sale.findMany({
      where,
      include: {
        customer: true,
        items: { include: { product: true } },
        createdBy: true,
      },
      orderBy: { saleDate: "desc" },
    });

    return NextResponse.json({ success: true, sales });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ success: false, error: errorMessage }, { status: 500 });
  }
}

// --- UPDATE SALE (PUT) ---
export async function PUT(req: NextRequest) {
  try {
    const data = await req.json();
    // Expected: { id, ...fieldsToUpdate, items }
    const { id, items, ...fields } = data;

    // Update sale and its items in a transaction
    const sale = await prisma.sale.update({
      where: { id },
      data: {
        ...fields,
        items: {
          deleteMany: {}, // Remove old items
          create: items.map((item: any) => ({
            productId: item.productId,
            quantity: item.quantity,
            rate: item.rate,
            discount: item.discount,
            amount: item.amount,
            gstAmount: item.gstAmount,
          })),
        },
      },
      include: { items: true },
    });

    return NextResponse.json({ success: true, sale });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ success: false, error: errorMessage }, { status: 500 });
  }
}

// --- DELETE SALE (DELETE) ---
export async function DELETE(req: NextRequest) {
  try {
    const { id } = await req.json();
    await prisma.sale.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ success: false, error: errorMessage }, { status: 500});
    }
}