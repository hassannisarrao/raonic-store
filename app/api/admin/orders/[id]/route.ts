import { NextResponse } from "next/server";
import mongoose from "mongoose";
import Order from "@/models/Order";

export async function PATCH(req: Request, context: { params: Promise<{ id: string }> }) {
  try {
    if (mongoose.connection.readyState !== 1) {
      await mongoose.connect(process.env.MONGODB_URI as string);
    }

    const params = await context.params;
    const body = await req.json();
    const { status } = body;

    const updatedOrder = await Order.findByIdAndUpdate(
      params.id, 
      { status },
      { new: true }
    );

    return NextResponse.json(updatedOrder, { status: 200 });
  } catch (error) {
    console.error("Failed to update status:", error);
    return NextResponse.json({ error: "Failed to update status" }, { status: 500 });
  }
}