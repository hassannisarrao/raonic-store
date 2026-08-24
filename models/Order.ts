import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    orderId: { type: String, required: true, unique: true }, // Added for custom tracking numbers
    customerInfo: {
      fullName: { type: String, required: true },
      email: { type: String }, // <-- Added to catch the new email field
      phone: { type: String, required: true },
      address: { type: String, required: true },
      city: { type: String, required: true },
    },
    items: [
      {
        _id: { type: String, required: true }, // Changed from productId to match your CartContext
        name: { type: String, required: true },
        price: { type: Number, required: true },
        quantity: { type: Number, required: true },
        color: { type: String },
        size: { type: String },
        imageUrl: { type: String },
      }
    ],
    totalAmount: { type: Number, required: true },
    status: { type: String, default: "Pending" }, // Can be: Pending, Processing, Shipped, Delivered
  },
  { timestamps: true }
);

const Order = mongoose.models.Order || mongoose.model("Order", orderSchema);

export default Order;