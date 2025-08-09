import { NextResponse } from "next/server";
import prisma from "../../../lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { name, email, phone, address, gstin, stateCode, logo } = await req.json();

  if (!name || !email) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  // Create organization
  const org = await prisma.organization.create({
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

  // Update user to link to this org (if not already linked)
  await prisma.user.update({
    where: { id: session.user.id },
    data: { organizationId: org.id, role: "ADMIN" },
  });

  return NextResponse.json({ message: "Organization created", orgId: org.id }, { status: 201 });
}