import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import authOptions from "../../auth/authOptions";
import prisma from "../../../../lib/prisma";

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: {
      organization: true,
    },
  });

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  // Fetch assigned stores and counters
  const stores = await prisma.userStore.findMany({
    where: { userId: user.id },
    include: { store: true },
  });

  const counters = await prisma.userCounter.findMany({
    where: { userId: user.id },
    include: { counter: true },
  });

  return NextResponse.json({
    ...user,
    stores,
    counters,
  });
}