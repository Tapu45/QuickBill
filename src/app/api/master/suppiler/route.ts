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

// GET /api/master/suppiler - List all suppliers (optionally by org)
export async function GET(req: NextRequest) {
  const orgId = req.nextUrl.searchParams.get('organizationId');
  const where = orgId ? { organizationId: orgId } : {};
  const suppliers = await prisma.supplier.findMany({ where });
  return NextResponse.json(suppliers);
}

// POST /api/master/suppiler - Create a new supplier
export async function POST(req: NextRequest) {
  const data = await parseBody(req);
  // Required fields: name, organizationId
  if (!data.name || !data.organizationId) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }
  // Add more validation as needed (email, phone, gstin, etc.)
  try {
    const supplier = await prisma.supplier.create({
      data: {
        name: data.name,
        email: data.email,
        phone: data.phone,
        address: data.address,
        gstin: data.gstin,
        stateCode: data.stateCode,
        isActive: data.isActive,
        organizationId: data.organizationId,
      }
    });
    return NextResponse.json(supplier, { status: 201 });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 400 });
  }
}

// PUT /api/master/suppiler?id=... - Update a supplier
export async function PUT(req: NextRequest) {
  const id = req.nextUrl.searchParams.get('id');
  if (!id) return NextResponse.json({ error: 'Supplier id required' }, { status: 400 });
  const data = await parseBody(req);
  // Add more validation as needed (email, phone, gstin, etc.)
  try {
    const supplier = await prisma.supplier.update({
      where: { id },
      data: {
        name: data.name,
        email: data.email,
        phone: data.phone,
        address: data.address,
        gstin: data.gstin,
        stateCode: data.stateCode,
        isActive: data.isActive,
      }
    });
    return NextResponse.json(supplier);
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 400 });
  }
}

// DELETE /api/master/suppiler?id=... - Delete a supplier
export async function DELETE(req: NextRequest) {
  const id = req.nextUrl.searchParams.get('id');
  if (!id) return NextResponse.json({ error: 'Supplier id required' }, { status: 400 });
  try {
    await prisma.supplier.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 400 });
  }
}