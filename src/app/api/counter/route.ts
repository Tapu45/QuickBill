import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@/generated/prisma';

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
  const { action, organizationId, storeId } = Object.fromEntries(req.nextUrl.searchParams);

  // Get all counters for an organization (optionally filter by store)
  if (action === 'getCounters' && organizationId) {
    const where: any = { organizationId };
    if (storeId) where.storeId = storeId;

    const counters = await prisma.counter.findMany({
      where,
      orderBy: { name: 'asc' },
    });
    return NextResponse.json(counters);
  }

  return NextResponse.json({ error: 'Invalid action or missing params' }, { status: 400 });
}