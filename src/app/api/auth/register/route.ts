import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import bcrypt from "bcryptjs";
import { DEFAULT_USAGE_TEMPLATES } from "@/lib/default-templates";

export async function POST(request: Request) {
  try {
    const { name, email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 });
    }

    if (password.length < 8) {
      return NextResponse.json({ error: "Password must be at least 8 characters" }, { status: 400 });
    }

    const existing = await db.user.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json({ error: "Email already registered" }, { status: 409 });
    }

    const passwordHash = await bcrypt.hash(password, 12);

    const user = await db.user.create({
      data: {
        name,
        email,
        passwordHash,
        subscription: {
          create: { plan: "free", status: "active" },
        },
        businessSettings: {
          create: {},
        },
        usageTemplates: {
          createMany: { data: DEFAULT_USAGE_TEMPLATES },
        },
      },
    });

    return NextResponse.json({ ok: true, userId: user.id });
  } catch (error) {
    console.error("[register]", error);
    return NextResponse.json({ error: "Registration failed" }, { status: 500 });
  }
}
