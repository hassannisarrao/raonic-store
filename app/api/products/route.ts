import { NextResponse } from "next/server";
import mongoose from "mongoose";
import Product from "@/models/Product";
import { v2 as cloudinary } from "cloudinary";
import { parseSmartSearch } from "@/utils/smartSearch";

// Ensure Cloudinary is configured
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function GET(request: Request) {
  try {
    if (mongoose.connection.readyState !== 1) {
      await mongoose.connect(process.env.MONGODB_URI as string);
    }

    const { searchParams } = new URL(request.url);
    const pageParam = searchParams.get("page");

    // Fallback: If no page is requested return all products normally
    if (!pageParam) {
      const allProducts = await Product.find({}).sort({ createdAt: -1 });
      return NextResponse.json(allProducts);
    }

    // Pagination & Server-Side Filtering
    const page = parseInt(pageParam);
    const limit = parseInt(searchParams.get("limit") || "12");
    const rawSearch = searchParams.get("search") || "";
    const category = searchParams.get("category") || "All";

    // 1. Process query through Smart Search parser
    const { cleanQuery, priceLimit } = parseSmartSearch(rawSearch);

    const query: any = {};
    if (category !== "All") query.category = category;

    // Apply regex search on product name using sanitized keywords
    if (cleanQuery) {
      query.name = { $regex: cleanQuery,$options: "i" };
    }

    // Apply price constraint if detected in natural language (e.g. "under 2000")
    if (priceLimit !== null) {
      query.price = { $lte: priceLimit };
    }

    const skip = (page - 1) * limit;

    const products = await Product.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Product.countDocuments(query);
    const categories = await Product.distinct("category");

    return NextResponse.json({
      products,
      hasMore: total > skip + products.length,
      categories: ["All", ...categories.filter(Boolean)],
    });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    if (mongoose.connection.readyState !== 1) {
      await mongoose.connect(process.env.MONGODB_URI as string);
    }

    const formData = await request.formData();
    
    // Extract base fields
    const name = formData.get("name") as string;
    const price = formData.get("price") as string;
    const compareAtPrice = formData.get("compareAtPrice") as string;
    const category = formData.get("category") as string;
    const description = formData.get("description") as string; 
    
    // Create URL-friendly slug
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "");

    // Handle Options & Variants (Matrix)
    const optionsString = formData.get("options") as string;
    const options = optionsString ? JSON.parse(optionsString) : [];

    const matrixString = formData.get("matrix") as string;
    const variantsString = formData.get("variants") as string;
    let variants = [];
    if (matrixString) {
      variants = JSON.parse(matrixString);
    } else if (variantsString) {
      variants = JSON.parse(variantsString);
    }

    // === Multi-Image Upload Logic (Supports both Dashboard & Legacy) ===
    const directImageUrlsString = formData.get("directImageUrls") as string;
    let imagesArray: string[] = [];

    if (directImageUrlsString) {
      imagesArray = JSON.parse(directImageUrlsString);
    }

    const imageFiles = formData.getAll("images") as File[];
    const legacyImage = formData.get("image") as File;
    
    if (legacyImage && legacyImage.size > 0) {
      const buffer = Buffer.from(await legacyImage.arrayBuffer());
      const base64Image = `data:${legacyImage.type};base64,${buffer.toString("base64")}`;
      const uploadResponse = await cloudinary.uploader.upload(base64Image, { folder: "raonic_store" });
      imagesArray.push(uploadResponse.secure_url);
    }

    if (imageFiles && imageFiles.length > 0) {
      for (const file of imageFiles) {
        if (file.size > 0) {
          const buffer = Buffer.from(await file.arrayBuffer());
          const base64Image = `data:${file.type};base64,${buffer.toString("base64")}`;
          const uploadResponse = await cloudinary.uploader.upload(base64Image, { folder: "raonic_store" });
          imagesArray.push(uploadResponse.secure_url);
        }
      }
    }

    let imageUrl = imagesArray.length > 0 ? imagesArray[0] : "";

    // Save to Database
    const newProduct = await Product.create({
      name,
      slug,
      price: Number(price),
      compareAtPrice: compareAtPrice ? Number(compareAtPrice) : undefined,
      category,
      description,
      imageUrl,
      images: imagesArray,
      options,
      variants, 
    });

    return NextResponse.json(newProduct, { status: 201 });
  } catch (error) {
    console.error("Failed to add product:", error);
    return NextResponse.json({ error: "Failed to create product" }, { status: 500 });
  }
}