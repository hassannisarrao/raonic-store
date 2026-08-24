import { NextResponse } from "next/server";
import mongoose from "mongoose";
import Order from "@/models/Order"; 

export async function GET(request: Request) {
  try {
    if (mongoose.connection.readyState !== 1) {
      await mongoose.connect(process.env.MONGODB_URI as string);
    }

    const { searchParams } = new URL(request.url);
    const phone = searchParams.get("phone");

    if (!phone) {
      return NextResponse.json({ error: "Phone number is required." }, { status: 400 });
    }

    // Find all orders that match this phone number, sorted by newest first
    const orders = await Order.find({ "customerInfo.phone": phone }).sort({ createdAt: -1 });

    return NextResponse.json(orders);
  } catch (error: any) {
    console.error("My Orders API error:", error);
    return NextResponse.json({ error: "Server error fetching orders." }, { status: 500 });
  }
}