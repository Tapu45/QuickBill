import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// --- CREATE QUOTATION (POST) ---
export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    // Expected: { quotationNumber, quotationDate, customerId, validTill, subtotal, discount, totalAmount, status, notes, organizationId, items }
    const {
      quotationNumber,
      quotationDate,
      customerId,
      validTill,
      subtotal,
      discount,
      totalAmount,
      status,
      notes,
      organizationId,
      items,
      storeId
    } = data;

    if (!storeId) {
      return NextResponse.json({ success: false, error: "storeId is required" }, { status: 400 });
    }

    const quotation = await prisma.quotation.create({
      data: {
        quotationNumber,
        quotationDate: new Date(quotationDate),
        customerId,
        validTill: new Date(validTill),
        subtotal,
        discount,
        totalAmount,
        status,
        notes,
        organizationId,
        storeId,
        items: {
          create: items.map((item: any) => ({
            productId: item.productId,
            quantity: item.quantity,
            rate: item.rate,
            amount: item.amount,
          })),
        },
      },
      include: { items: true, customer: true },
    });

    return NextResponse.json({ success: true, quotation });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ success: false, error: errorMessage }, { status: 500 });
  }
}

// --- GET QUOTATIONS LIST (GET) ---
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const organizationId = searchParams.get("organizationId");
    const customerId = searchParams.get("customerId");
    const quotationNumber = searchParams.get("quotationNumber");

    const where: any = {};
    if (organizationId) where.organizationId = organizationId;
    if (customerId) where.customerId = customerId;
    if (quotationNumber) where.quotationNumber = quotationNumber;

    const quotations = await prisma.quotation.findMany({
      where,
      include: {
        customer: true,
        items: {
          include: { product: true },
        },
      },
      orderBy: { quotationDate: "desc" },
    });

    return NextResponse.json({ success: true, quotations });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ success: false, error: errorMessage }, { status: 500 });
  }
}

// --- UPDATE QUOTATION (PUT) ---
export async function PUT(req: NextRequest) {
  try {
    const data = await req.json();
    // Expected: { id, ...fieldsToUpdate, items }
    const { id, items, ...fields } = data;

    const quotation = await prisma.quotation.update({
      where: { id },
      data: {
        ...fields,
        items: {
          deleteMany: {}, // Remove old items
          create: items.map((item: any) => ({
            productId: item.productId,
            quantity: item.quantity,
            rate: item.rate,
            amount: item.amount,
          })),
        },
      },
      include: { items: true, customer: true },
    });

    return NextResponse.json({ success: true, quotation });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ success: false, error: errorMessage }, { status: 500 });
  }
}

// --- DELETE QUOTATION (DELETE) ---
export async function DELETE(req: NextRequest) {
  try {
    const { id } = await req.json();
    await prisma.quotation.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ success: false, error: errorMessage }, { status: 500 });
  }
}