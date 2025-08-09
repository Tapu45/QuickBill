import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@/generated/prisma';

const prisma = new PrismaClient();

// Helper: parse JSON body
async function parseBody(req: NextRequest) {
  try {
    return await req.json();
  } catch {
    return {};
  }
}

// GET /api/product - List all products (optionally by org)
export async function GET(req: NextRequest) {
  const orgId = req.nextUrl.searchParams.get('organizationId');
  const search = req.nextUrl.searchParams.get('search');
  const where: any = orgId ? { organizationId: orgId } : {};
  if (search) {
    where.OR = [
      { name: { contains: search, mode: 'insensitive' } },
      { code: { contains: search, mode: 'insensitive' } },
    ];
  }
  const products = await prisma.product.findMany({ where });
  return NextResponse.json({ products });
}

// POST /api/product - Create a new product
export async function POST(req: NextRequest) {
  const data = await parseBody(req);
  // Required fields: code, name, hsnCode, gstPercentage, unit, retailRate, organizationId
  if (
    !data.code ||
    !data.name ||
    !data.hsnCode ||
    data.gstPercentage == null ||
    !data.unit ||
    !data.retailRate ||
    !data.organizationId
  ) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }
  try {
    const product = await prisma.product.create({
      data: {
        code: data.code,
        name: data.name,
        brand: data.brand || null,
        image: data.image || null,
        category: data.category || null,
        description: data.description || null,
        hsnCode: data.hsnCode,
        gstPercentage: parseFloat(data.gstPercentage),
        unit: data.unit,
        retailRate: parseFloat(data.retailRate),
        wholesaleRate: data.wholesaleRate ? parseFloat(data.wholesaleRate) : null,
        dealerRate: data.dealerRate ? parseFloat(data.dealerRate) : null,
        minStockLevel: data.minStockLevel ? parseFloat(data.minStockLevel) : undefined,
        isActive: data.isActive === undefined ? true : Boolean(data.isActive),
        lengthInches: data.lengthInches ? parseFloat(data.lengthInches) : null,
        widthInches: data.widthInches ? parseFloat(data.widthInches) : null,
        sqftPerBox: data.sqftPerBox ? parseFloat(data.sqftPerBox) : null,
        organizationId: data.organizationId,
      }
    });
    return NextResponse.json(product, { status: 201 });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 400 });
  }
}

// PUT /api/product?id=... - Update a product
export async function PUT(req: NextRequest) {
  const id = req.nextUrl.searchParams.get('id');
  if (!id) return NextResponse.json({ error: 'Product id required' }, { status: 400 });
  const data = await parseBody(req);
  try {
    const product = await prisma.product.update({
      where: { id },
      data: {
        code: data.code,
        name: data.name,
        brand: data.brand || null,
        image: data.image || null,
        category: data.category || null,
        description: data.description || null,
        hsnCode: data.hsnCode,
        gstPercentage: parseFloat(data.gstPercentage),
        unit: data.unit,
        retailRate: parseFloat(data.retailRate),
        wholesaleRate: data.wholesaleRate ? parseFloat(data.wholesaleRate) : null,
        dealerRate: data.dealerRate ? parseFloat(data.dealerRate) : null,
        minStockLevel: data.minStockLevel ? parseFloat(data.minStockLevel) : undefined,
        isActive: data.isActive === undefined ? undefined : Boolean(data.isActive),
        lengthInches: data.lengthInches ? parseFloat(data.lengthInches) : null,
        widthInches: data.widthInches ? parseFloat(data.widthInches) : null,
        sqftPerBox: data.sqftPerBox ? parseFloat(data.sqftPerBox) : null,
      }
    });
    return NextResponse.json(product);
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 400 });
  }
}

// DELETE /api/product?id=... - Delete a product
export async function DELETE(req: NextRequest) {
  const id = req.nextUrl.searchParams.get('id');
  if (!id) return NextResponse.json({ error: 'Product id required' }, { status: 400 });
  try {
    await prisma.product.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 400 });
  }
}