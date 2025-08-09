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

// GET /api/master/customer - List all customers (optionally by org)
export async function GET(req: NextRequest) {
  const orgId = req.nextUrl.searchParams.get('organizationId');
  const search = req.nextUrl.searchParams.get('search');
  const where: any = orgId ? { organizationId: orgId } : {};
  if (search) {
    where.OR = [
      { name: { contains: search, mode: 'insensitive' } },
      { phone: { contains: search, mode: 'insensitive' } },
      { email: { contains: search, mode: 'insensitive' } },
    ];
  }
  const customers = await prisma.customer.findMany({ where });
  return NextResponse.json({ customers });
}

// POST /api/master/customer - Create a new customer
export async function POST(req: NextRequest) {
  const data = await parseBody(req);

  // Required fields
  if (!data.name || !data.organizationId) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }

  // Duplicate check within same organization
  const duplicate = await prisma.customer.findFirst({
    where: {
      organizationId: data.organizationId,
      OR: [
        { phone: data.phone ?? undefined },
        { email: data.email ?? undefined },
        { gstin: data.gstin ?? undefined }
      ]
    }
  });
  if (duplicate) {
    return NextResponse.json({ error: 'Duplicate customer found with same phone, email, or GSTIN in this organization.' }, { status: 409 });
  }

  try {
    const customer = await prisma.customer.create({
      data: {
        name: data.name,
        email: data.email,
        phone: data.phone,
        address: data.address,
        gstin: data.gstin,
        stateCode: data.stateCode,
        priceCategory: data.priceCategory,
        creditLimit: data.creditLimit,
        isActive: data.isActive,
        organizationId: data.organizationId,
      }
    });
    return NextResponse.json(customer, { status: 201 });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 400 });
  }
}

// PUT /api/master/customer?id=... - Update a customer
export async function PUT(req: NextRequest) {
  const id = req.nextUrl.searchParams.get('id');
  if (!id) return NextResponse.json({ error: 'Customer id required' }, { status: 400 });
  const data = await parseBody(req);

  // Duplicate check within same organization (excluding self)
  if (data.organizationId && (data.phone || data.email || data.gstin)) {
    const duplicate = await prisma.customer.findFirst({
      where: {
        organizationId: data.organizationId,
        id: { not: id },
        OR: [
          { phone: data.phone ?? undefined },
          { email: data.email ?? undefined },
          { gstin: data.gstin ?? undefined }
        ]
      }
    });
    if (duplicate) {
      return NextResponse.json({ error: 'Duplicate customer found with same phone, email, or GSTIN in this organization.' }, { status: 409 });
    }
  }

  try {
    const customer = await prisma.customer.update({
      where: { id },
      data: {
        name: data.name,
        email: data.email,
        phone: data.phone,
        address: data.address,
        gstin: data.gstin,
        stateCode: data.stateCode,
        priceCategory: data.priceCategory,
        creditLimit: data.creditLimit,
        isActive: data.isActive,
      }
    });
    return NextResponse.json(customer);
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 400 });
  }
}

// DELETE /api/master/customer?id=... - Delete a customer
export async function DELETE(req: NextRequest) {
  const id = req.nextUrl.searchParams.get('id');
  if (!id) return NextResponse.json({ error: 'Customer id required' }, { status: 400 });
  try {
    await prisma.customer.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 400 });
  }
}