import { NextResponse } from "next/server";
import prisma from "../../../lib/prisma";
import { getServerSession } from "next-auth";
import authOptions from "../auth/authOptions";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { name, email, phone, address, gstin, stateCode, logo } = await req.json();

  if (!name || !email) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  try {
    const result = await prisma.$transaction(async (tx) => {
      // 1. Create organization
      const org = await tx.organization.create({
        data: {
          name,
          email,
          phone,
          address,
          gstin,
          stateCode,
          logo,
          isActive: true,
        },
      });

      // 2. Create default store
      const store = await tx.store.create({
        data: {
          name: "Default Store",
          address,
          phone,
          email,
          gstin,
          stateCode,
          isActive: true,
          isDefault: true,
          organizationId: org.id,
        },
      });

      // 3. Create default counter for the store
      const counter = await tx.counter.create({
        data: {
          name: "Default Counter",
          description: "Auto-created default counter",
          isActive: true,
          storeId: store.id,
          organizationId: org.id,
        },
      });

      // 4. Update user to link to this org (if not already linked)
      const user = await tx.user.update({
        where: { id: session.user.id },
        data: { organizationId: org.id, role: "ADMIN" },
      });

      // 5. Assign user to store (UserStore)
      await tx.userStore.create({
        data: {
          userId: user.id,
          storeId: store.id,
          role: "MANAGER",
          isDefault: true,
        },
      });

      // 6. Assign user to counter (UserCounter)
      // await tx.userCounter.create({
      //   data: {
      //     userId: user.id,
      //     counterId: counter.id,
      //   },
      // });

      return { orgId: org.id, storeId: store.id, counterId: counter.id };
    });

    return NextResponse.json(
      { message: "Organization created", ...result },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create organization", details: error },
      { status: 500 }
    );
  }
}