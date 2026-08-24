import { NextResponse } from "next/server";
import mongoose from "mongoose";
import Product from "@/models/Product"; 

export async function GET(request: Request, context: any) {
  try {
    if (mongoose.connection.readyState !== 1) {
      await mongoose.connect(process.env.MONGODB_URI as string);
    }

    // Await the params for Next.js 15 compatibility
    const { slug } = await context.params;

    // Search MongoDB for the exact slug
    const product = await Product.findOne({ slug: slug });

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json(product, { status: 200 });

  } catch (error) {
    console.error("Error fetching product:", error);
    return NextResponse.json({ error: "Failed to fetch product" }, { status: 500 });
  }
}