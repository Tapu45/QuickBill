import { NextResponse } from "next/server";
import prisma from "../../../../lib/prisma";
import bcrypt from "bcryptjs";
import { registrationSchema } from "@/lib/validators/auth";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = registrationSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: "Validation failed", details: parsed.error.errors }, { status: 400 });
    }

    const { email, password, firstName, lastName, username, phone, image } = parsed.data;

    // Check if user/email/username exists
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [{ email }, { username }]
      }
    });
    if (existingUser) {
      return NextResponse.json({ error: "Email or username already exists" }, { status: 409 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        email,
        username,
        password: hashedPassword,
        firstName,
        lastName,
        phone,
        image,
        role: "ADMIN",
        organizationId: null,
        isActive: true,
      }
    });

    return NextResponse.json({ message: "User registered", userId: user.id, organizationId: user.organizationId }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Registration failed", details: error }, { status: 500 });
  }
}