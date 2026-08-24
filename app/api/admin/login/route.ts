import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { password } = await request.json();
    
    // Grab the password from the .env.local file
    const correctPassword = process.env.ADMIN_PASSWORD || "raonic2026";

    if (password.trim() === correctPassword.trim()) {
      // 1. Create the success response
      const response = NextResponse.json({ success: true });
      
      // 2. Attach the secure cookie safely to the response
      response.cookies.set("raonic_admin_auth", "true", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 60 * 60 * 24 * 7, 
        path: "/",
      });

      // 3. Send it back to the browser
      return response;
    }

    return NextResponse.json({ error: "Invalid password" }, { status: 401 });
  } catch (error) {
    console.error("Login Error:", error);
    return NextResponse.json({ error: "Login failed" }, { status: 500 });
  }
}