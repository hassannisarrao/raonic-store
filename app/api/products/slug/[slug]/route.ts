import { NextResponse } from "next/server";
import mongoose from "mongoose";
import Product from "@/models/Product";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    if (mongoose.connection.readyState !== 1) {
      await mongoose.connect(process.env.MONGODB_URI as string);
    }

    // Next.js 15 ke liye params ko await karna zaroori hai
    const resolvedParams = await params;
    const { slug } = resolvedParams;

    const product = await Product.findOne({ slug });

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json(product);
  } catch (error) {
    console.error("Error fetching product by slug:", error);
    return NextResponse.json({ error: "Failed to fetch product details" }, { status: 500 });
  }
}