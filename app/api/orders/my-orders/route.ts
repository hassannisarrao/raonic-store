import { NextResponse } from "next/server";
import mongoose from "mongoose";
import Order from "@/models/Order"; 

// ==========================================
// 1. YOUR EXISTING GET METHOD (UNTOUCHED)
// ==========================================
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

// ==========================================
// 2. NEW POST METHOD (FOR CREATING ORDERS)
// ==========================================
export async function POST(request: Request) {
  try {
    if (mongoose.connection.readyState !== 1) {
      await mongoose.connect(process.env.MONGODB_URI as string);
    }

    const body = await request.json();

    // Generate a unique 6-digit Order ID (e.g., RNC-492810)
    const customOrderId = `RNC-${Math.floor(100000 + Math.random() * 900000)}`;

    // Create and save the new order using your exact Schema requirements
    const newOrder = await Order.create({
      orderId: customOrderId,
      customerInfo: body.customerInfo,
      items: body.items,
      totalAmount: body.totalAmount,
      status: "Pending", // Default status as per your schema
    });

    // ---------------------------------------------------------
    // NOTIFICATION SYSTEM PLACEHOLDER
    // (In the future, we will drop the Email/WhatsApp alert code right here 
    // so you get a message the exact second a customer checks out)
    // ---------------------------------------------------------

    return NextResponse.json({ success: true, order: newOrder }, { status: 201 });
  } catch (error: any) {
    console.error("Order Creation API error:", error);
    return NextResponse.json({ error: "Server error creating order." }, { status: 500 });
  }
}