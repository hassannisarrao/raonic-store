import { NextResponse } from "next/server";
import mongoose from "mongoose";
import Order from "@/models/Order"; 

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    if (mongoose.connection.readyState !== 1) {
      await mongoose.connect(process.env.MONGODB_URI as string);
    }

    const { id } = await params;
    const trackingId = id;

    if (!trackingId) {
      return NextResponse.json({ error: "Tracking number is required." }, { status: 400 });
    }

    // Searches your database for your RNK tracking format or standard ID
    const order = await Order.findOne({ 
      $or: [
        { orderId: trackingId.trim() },
        { _id: mongoose.isValidObjectId(trackingId.trim()) ? trackingId.trim() : null }
      ]
    });

    if (!order) {
      return NextResponse.json({ error: "Order not found." }, { status: 404 });
    }

    return NextResponse.json(order);
  } catch (error: any) {
    console.error("Tracking API error:", error);
    return NextResponse.json({ error: "Server error fetching order." }, { status: 500 });
  }
}