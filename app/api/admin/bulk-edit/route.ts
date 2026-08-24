import { NextResponse } from "next/server";
import mongoose from "mongoose";
import Product from "@/models/Product";

export async function PUT(request: Request) {
  try {
    if (mongoose.connection.readyState !== 1) {
      await mongoose.connect(process.env.MONGODB_URI as string);
    }

    const body = await request.json();
    const { updates } = body;

    if (!updates || !Array.isArray(updates)) {
      return NextResponse.json({ error: "Invalid data format" }, { status: 400 });
    }

    // Loop through the array and update every product in the database
    const updatePromises = updates.map((product) =>
      Product.findByIdAndUpdate(
        product._id,
        {
          name: product.name,
          category: product.category,
          price: product.price,
        },
        { new: true } // returns the updated document
      )
    );

    await Promise.all(updatePromises);

    return NextResponse.json({ success: true, message: "Bulk update successful" });
  } catch (error) {
    console.error("Bulk edit failed:", error);
    return NextResponse.json({ error: "Failed to perform bulk edit" }, { status: 500 });
  }
}