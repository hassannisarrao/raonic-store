import { NextResponse } from "next/server";
import mongoose from "mongoose";
import Order from "@/models/Order";
import nodemailer from "nodemailer";

// 1. GET: Fetches all orders for the Admin Dashboard
export async function GET() {
  try {
    if (mongoose.connection.readyState !== 1) {
      await mongoose.connect(process.env.MONGODB_URI as string);
    }

    const orders = await Order.find({}).sort({ createdAt: -1 });
    return NextResponse.json(orders);
  } catch (error) {
    console.error("Failed to fetch admin orders:", error);
    return NextResponse.json({ error: "Failed to fetch orders" }, { status: 500 });
  }
}

// 2. POST: Saves a new order when a customer checks out
export async function POST(request: Request) {
  try {
    if (mongoose.connection.readyState !== 1) {
      await mongoose.connect(process.env.MONGODB_URI as string);
    }

    const body = await request.json();
    const { customerInfo, items, totalAmount } = body;

    // Formatted to perfectly match your updated Order.ts schema
    const formattedItems = items.map((item: any) => ({
      _id: item._id, 
      name: item.name,
      price: item.price,
      quantity: item.quantity,
      color: item.color || "",
      size: item.size || "",
      imageUrl: item.imageUrl || "",
    }));

    // === NEW: Generate a professional tracking ID (e.g., RNK-84729) ===
    const generateOrderId = () => {
      const randomNum = Math.floor(10000 + Math.random() * 90000);
      return `RNK-${randomNum}`;
    };
    const customOrderId = generateOrderId();

    const newOrder = await Order.create({
      orderId: customOrderId,
      customerInfo,
      items: formattedItems,
      totalAmount,
    });

    // === AUTOMATED BACKGROUND EMAIL ===
    if (customerInfo.email && process.env.EMAIL_USER && process.env.EMAIL_PASS) {
      try {
        const transporter = nodemailer.createTransport({
          service: "gmail",
          auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
          },
        });

        const mailOptions = {
          from: `"Raonic Store" <${process.env.EMAIL_USER}>`,
          to: customerInfo.email,
          subject: `Order Confirmation - #${customOrderId}`,
          html: `
            <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
              <h2 style="color: #333;">Thank you for your order, ${customerInfo.fullName}!</h2>
              <p style="color: #555; font-size: 16px;">Your order has been successfully placed. We are getting it ready for shipment.</p>
              
              <div style="background-color: #f9fafb; padding: 15px; border-radius: 8px; margin: 20px 0;">
                <p style="margin: 0 0 10px 0;"><strong>Order ID:</strong> ${customOrderId}</p>
                <p style="margin: 0;"><strong>Total Amount:</strong> Rs. ${totalAmount}</p>
              </div>
              
              <p style="color: #555;">You can track your order status directly on our website using your Order ID.</p>
              <br/>
              <p style="color: #333; font-weight: bold;">Thanks,<br>The Raonic Team</p>
            </div>
          `,
        };

        // We don't await this so it sends silently in the background
        transporter.sendMail(mailOptions).catch(err => console.error("Email failed:", err));
      } catch (emailError) {
        console.error("Email setup error:", emailError);
      }
    }

    // Return the custom tracking ID so the success page can display it
    return NextResponse.json({ success: true, orderId: customOrderId }, { status: 201 });
    
  } catch (error) {
    console.error("Failed to place order:", error);
    return NextResponse.json({ error: "Failed to place order" }, { status: 500 });
  }
}