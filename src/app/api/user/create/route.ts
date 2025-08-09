import { NextResponse } from "next/server";
import prisma from "../../../../lib/prisma";
import bcrypt from "bcryptjs";

// RBAC roles
const ROLES = ["ADMIN", "MANAGER", "CASHIER", "SALESPERSON"];

// Helper: Validate role
function isValidRole(role: string) {
  return ROLES.includes(role);
}

// Helper: Mask password in response
function maskUser(user: any) {
  const { password, ...rest } = user;
  return rest;
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { action } = body;

    // Create User
    if (action === "create") {
      const { email, username, password, firstName, lastName, phone, image, role, organizationId } = body;
      if (!email || !username || !password || !role) {
        return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
      }
      if (!isValidRole(role)) {
        return NextResponse.json({ error: "Invalid role" }, { status: 400 });
      }
      const existingUser = await prisma.user.findFirst({
        where: { OR: [{ email }, { username }] }
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
          role,
          organizationId,
          isActive: true,
        }
      });
      return NextResponse.json({ message: "User created", user: maskUser(user) }, { status: 201 });
    }

    // Update User
    if (action === "update") {
      const { id, email, username, firstName, lastName, phone, image, role, isActive } = body;
      if (!id) {
        return NextResponse.json({ error: "User ID required" }, { status: 400 });
      }
      if (role && !isValidRole(role)) {
        return NextResponse.json({ error: "Invalid role" }, { status: 400 });
      }
      const user = await prisma.user.update({
        where: { id },
        data: {
          email,
          username,
          firstName,
          lastName,
          phone,
          image,
          role,
          isActive,
        }
      });
      return NextResponse.json({ message: "User updated", user: maskUser(user) }, { status: 200 });
    }

    // Change Password
    if (action === "changePassword") {
      const { id, password } = body;
      if (!id || !password) {
        return NextResponse.json({ error: "User ID and new password required" }, { status: 400 });
      }
      const hashedPassword = await bcrypt.hash(password, 10);
      await prisma.user.update({
        where: { id },
        data: { password: hashedPassword }
      });
      return NextResponse.json({ message: "Password updated" }, { status: 200 });
    }

    // Delete User
    if (action === "delete") {
      const { id } = body;
      if (!id) {
        return NextResponse.json({ error: "User ID required" }, { status: 400 });
      }
      await prisma.user.delete({ where: { id } });
      return NextResponse.json({ message: "User deleted" }, { status: 200 });
    }

    // Assign Role
    if (action === "assignRole") {
      const { id, role } = body;
      if (!id || !role || !isValidRole(role)) {
        return NextResponse.json({ error: "User ID and valid role required" }, { status: 400 });
      }
      const user = await prisma.user.update({
        where: { id },
        data: { role }
      });
      return NextResponse.json({ message: "Role assigned", user: maskUser(user) }, { status: 200 });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (error) {
    return NextResponse.json({ error: "User management failed", details: error }, { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const action = searchParams.get("action");

    // Get all users (admin only)
    if (action === "list") {
      const organizationId = searchParams.get("organizationId") || undefined;
      const users = await prisma.user.findMany({
        where: organizationId ? { organizationId } : {},
        orderBy: { createdAt: "desc" }
      });
      return NextResponse.json({ users: users.map(maskUser) }, { status: 200 });
    }

    // Get user by ID
    if (action === "get") {
      const id = searchParams.get("id");
      if (!id) {
        return NextResponse.json({ error: "User ID required" }, { status: 400 });
      }
      const user = await prisma.user.findUnique({ where: { id } });
      if (!user) {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
      }
      return NextResponse.json({ user: maskUser(user) }, { status: 200 });
    }

    // Get roles
    if (action === "roles") {
      return NextResponse.json({ roles: ROLES }, { status: 200 });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch users", details: error }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  // For updating user status or details (same as POST update)
  return await POST(req);
}