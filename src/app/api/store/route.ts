import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@/generated/prisma';

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  const { action } = Object.fromEntries(req.nextUrl.searchParams);
  const body = await req.json();

  if (action === 'create store') {
    // Create Store
    const store = await prisma.store.create({
      data: {
        name: body.name,
        address: body.address,
        phone: body.phone,
        email: body.email,
        gstin: body.gstin,
        stateCode: body.stateCode,
        organizationId: body.organizationId,
        isActive: body.isActive ?? true,
        isDefault: body.isDefault ?? false,
      },
    });
    return NextResponse.json(store);
  }

  if (action === 'create counter') {
    // Create Counter
    const counter = await prisma.counter.create({
      data: {
        name: body.name,
        description: body.description,
        storeId: body.storeId,
        organizationId: body.organizationId,
        isActive: body.isActive ?? true,
      },
    });
    return NextResponse.json(counter);
  }

  if (action === 'assign user to store') {
    // Check if already assigned
    const exists = await prisma.userStore.findUnique({
      where: { userId_storeId: { userId: body.userId, storeId: body.storeId } }
    });
    if (exists) {
      return NextResponse.json({ error: 'User already assigned to this store' }, { status: 409 });
    }
    // Assign User to Store
    const userStore = await prisma.userStore.create({
      data: {
        userId: body.userId,
        storeId: body.storeId,
        role:  'MANAGER',
        isDefault: body.isDefault ?? false,
      },
    });
    return NextResponse.json(userStore);
  }

  if (action === 'assign user to counter') {
    // Check if already assigned
    const exists = await prisma.userCounter.findUnique({
      where: { userId_counterId: { userId: body.userId, counterId: body.counterId } }
    });
    if (exists) {
      return NextResponse.json({ error: 'User already assigned to this counter' }, { status: 409 });
    }
    // Assign User to Counter
    const userCounter = await prisma.userCounter.create({
      data: {
        userId: body.userId,
        counterId: body.counterId,
      },
    });

     await prisma.user.update({
      where: { id: body.userId },
      data: { role: 'CASHIER' },
    });
    return NextResponse.json(userCounter);
  }

  return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
}

export async function GET(req: NextRequest) {
  const { action, storeId, counterId, organizationId } = Object.fromEntries(req.nextUrl.searchParams);

  if (action === 'get users for store' && storeId && organizationId) {
    // Get Users for Store with org filter
    const users = await prisma.userStore.findMany({
      where: { storeId, store: { organizationId } },
      include: { user: true },
    });
    return NextResponse.json(users);
  }

  if (action === 'get users for counter' && counterId && organizationId) {
    // Get Users for Counter with org filter
    const users = await prisma.userCounter.findMany({
      where: { counterId, counter: { organizationId } },
      include: { user: true },
    });
    return NextResponse.json(users);
  }

  if (action === 'getStores' && organizationId) {
    // Get all stores for the organization, including their counters
    const stores = await prisma.store.findMany({
      where: { organizationId },
      include: {
        counters: true,
      },
      orderBy: { name: 'asc' },
    });
    return NextResponse.json(stores);
  }

  return NextResponse.json({ error: 'Invalid action or missing params' }, { status: 400 });
}