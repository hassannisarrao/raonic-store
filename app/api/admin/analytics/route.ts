import { NextResponse } from "next/server";
import mongoose from "mongoose";
import Order from "@/models/Order";

// Direct, built-in connection safety
async function connectDB() {
  if (mongoose.connections[0].readyState) return;
  await mongoose.connect(process.env.MONGODB_URI || "");
}

export async function GET() {
  try {
    await connectDB();
    
    // Fetch all orders to calculate our stats
    const orders = await Order.find({});
    
    // Calculate metrics
    const totalRevenue = orders.reduce((sum, order) => sum + (Number(order.totalAmount) || 0), 0);
    const totalOrders = orders.length;
    const pendingOrders = orders.filter(o => !o.status || o.status === "Pending").length;
    const completedOrders = orders.filter(o => o.status === "Completed").length;

    return NextResponse.json({
      totalRevenue,
      totalOrders,
      pendingOrders,
      completedOrders
    }, { status: 200 });
    
  } catch (error) {
    console.error("Analytics error:", error);
    return NextResponse.json({ error: "Failed to fetch analytics" }, { status: 500 });
  }
}