import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST(req: Request) {
  try {
    const { password } = await req.json();
    
    const adminPassword = process.env.ADMIN_PASSWORD;

    if (!adminPassword) {
      return NextResponse.json({ error: "Server misconfiguration. Password not set." }, { status: 500 });
    }

    if (password === adminPassword) {
      const cookieStore = await cookies();
      
      cookieStore.set("admin_auth_token", "authorized", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax", // FIX: Tells Vercel to allow this cookie to be saved securely
        maxAge: 60 * 60 * 24 * 7, 
        path: "/",
      });

      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  } catch (error) {
    return NextResponse.json({ error: "Authentication failed" }, { status: 500 });
  }
}