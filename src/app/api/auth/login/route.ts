import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/* -------------------------------
   CORS PREFLIGHT
-------------------------------- */
export async function OPTIONS() {
  return NextResponse.json({}, { status: 200 });
}

/* -------------------------------
   LOGIN
-------------------------------- */
export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    /* ----------------------------
       1. VALIDATION
    ---------------------------- */
    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    /* ----------------------------
       2. FIND ADMIN USER
    ---------------------------- */
    const user = await prisma.user.findFirst({
      where: {
        email: email.toLowerCase(),
        role: "admin", // Only allow admin login
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    /* ----------------------------
       3. PASSWORD CHECK
    ---------------------------- */
    // For now, using plain text comparison (should use bcrypt in production)
    const isValidPassword = password === user.password;

    if (!isValidPassword) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    /* ----------------------------
       4. REDIRECT PATH
    ---------------------------- */
    const redirectPath = "/admin/dashboard";

    /* ----------------------------
       5. SUCCESS RESPONSE
    ---------------------------- */
    return NextResponse.json({
      message: "Login successful",
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
      redirectPath,
    });
  } catch (error) {
    console.error("❌ AUTH LOGIN ERROR:", error);

    return NextResponse.json(
      { error: "Authentication failed" },
      { status: 500 }
    );
  }
}
