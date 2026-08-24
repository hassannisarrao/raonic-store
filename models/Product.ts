import mongoose, { Schema, Document, models } from "mongoose";

// Added color and size so the database stops deleting them!
export interface IProductVariant {
  id?: string;
  title?: string;      
  price?: number;      
  inventory?: number;  
  imageUrl?: string;  
  color?: string;      // <-- NEW
  size?: string;       // <-- NEW
}

export interface IProduct extends Document {
  name: string;
  slug: string;
  price: number;
  compareAtPrice?: number;
  category: string;
  description: string;
  imageUrl: string;
  images: string[];
  options: any[];      
  variants: IProductVariant[]; 
  createdAt: Date;
  updatedAt: Date;
}

const ProductSchema = new Schema<IProduct>(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    price: { type: Number, required: true },
    compareAtPrice: { type: Number },
    category: { type: String, required: true },
    description: { type: String, required: true },
    imageUrl: { type: String }, 
    images: { type: [String], default: [] }, 
    options: { type: [Schema.Types.Mixed], default: [] },
    // Explicitly telling Mongoose to accept color and size in the array
    variants: [
      {
        id: { type: String },
        title: { type: String },
        price: { type: Number },
        inventory: { type: Number },
        imageUrl: { type: String },
        color: { type: String },
        size: { type: String }
      }
    ]
  },
  { timestamps: true }
);

const Product = models.Product || mongoose.model<IProduct>("Product", ProductSchema);
export default Product;