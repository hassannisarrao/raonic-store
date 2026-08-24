import { NextResponse } from "next/server";
import mongoose from "mongoose";
import Product from "@/models/Product"; 

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    // 1. Connect to the database
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(process.env.MONGODB_URI as string);
    }

    // === THE FIX: Await the params before reading the ID ===
    const { id } = await params;
    // =======================================================

    const formData = await request.formData();

    // 2. Extract standard fields
    const name = formData.get("name") as string;
    const price = formData.get("price") as string;
    const compareAtPrice = formData.get("compareAtPrice") as string;
    const category = formData.get("category") as string;
    const description = formData.get("description") as string;

    // 3. Extract the Variant Matrix data
    const optionsString = formData.get("options") as string;
    const matrixString = formData.get("matrix") as string;

    let options = [];
    let variants = [];

    if (optionsString) options = JSON.parse(optionsString);
    if (matrixString) variants = JSON.parse(matrixString);

    // 4. Update the document in MongoDB
    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      {
        name,
        price: Number(price),
        compareAtPrice: compareAtPrice ? Number(compareAtPrice) : null,
        category,
        description,
        options,
        variants,
      },
      // === THE FIX: Removed the deprecated 'new: true' warning ===
      { returnDocument: 'after' } 
    );

    if (!updatedProduct) {
      return NextResponse.json({ error: "Product not found." }, { status: 404 });
    }

    return NextResponse.json({ message: "Product updated successfully!", product: updatedProduct });

  } catch (error: any) {
    console.error("Failed to update product:", error);
    return NextResponse.json({ error: error.message || "Failed to update product" }, { status: 500 });
  }
}

// === NEW: DELETE FUNCTION ===
export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(process.env.MONGODB_URI as string);
    }

    const { id } = await params;
    
    const deletedProduct = await Product.findByIdAndDelete(id);
    
    if (!deletedProduct) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: "Product deleted successfully" }, { status: 200 });
  } catch (error: any) {
    console.error("Failed to delete product:", error);
    return NextResponse.json({ error: "Failed to delete product" }, { status: 500 });
  }
}