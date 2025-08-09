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

// GET /api/master/tax - List all tax masters (optionally by org)
export async function GET(req: NextRequest) {
  const orgId = req.nextUrl.searchParams.get('organizationId');
  const where = orgId ? { organizationId: orgId } : {};
  const taxes = await prisma.taxMaster.findMany({ where });
  return NextResponse.json(taxes);
}

// POST /api/master/tax - Create a new tax master
export async function POST(req: NextRequest) {
  const data = await parseBody(req);
  // Required fields: hsnCode, gstPercentage, organizationId
  if (!data.hsnCode || data.gstPercentage == null || !data.organizationId) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }
  try {
    const tax = await prisma.taxMaster.create({
      data: {
        hsnCode: data.hsnCode,
        gstPercentage: data.gstPercentage,
        description: data.description,
        isActive: data.isActive,
        organizationId: data.organizationId,
      }
    });
    return NextResponse.json(tax, { status: 201 });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 400 });
  }
}

// PUT /api/master/tax?id=... - Update a tax master
export async function PUT(req: NextRequest) {
  const id = req.nextUrl.searchParams.get('id');
  if (!id) return NextResponse.json({ error: 'Tax id required' }, { status: 400 });
  const data = await parseBody(req);
  try {
    const tax = await prisma.taxMaster.update({
      where: { id },
      data: {
        hsnCode: data.hsnCode,
        gstPercentage: data.gstPercentage,
        description: data.description,
        isActive: data.isActive,
      }
    });
    return NextResponse.json(tax);
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 400 });
  }
}

// DELETE /api/master/tax?id=... - Delete a tax master
export async function DELETE(req: NextRequest) {
  const id = req.nextUrl.searchParams.get('id');
  if (!id) return NextResponse.json({ error: 'Tax id required' }, { status: 400 });
  try {
    await prisma.taxMaster.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 400 });
  }
}