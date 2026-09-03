import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import mongoose from "mongoose";
import User from "@/models/User";

// Connect to your existing MongoDB database
const connectDB = async () => {
  if (mongoose.connections[0].readyState) return;
  if (!process.env.MONGODB_URI) throw new Error("Missing MONGODB_URI");
  await mongoose.connect(process.env.MONGODB_URI);
};

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === "google") {
        await connectDB();
        try {
          // Check if this customer already exists in your database
          const existingUser = await User.findOne({ email: user.email });
          
          // If they are a new customer, create their Raonic VIP profile
          if (!existingUser) {
            await User.create({
              name: user.name,
              email: user.email,
              image: user.image,
              totalSpent: 0,
              tier: "Member",
            });
          }
          return true;
        } catch (error) {
          console.error("Error saving user:", error);
          return false;
        }
      }
      return true;
    },
  },
});

export { handler as GET, handler as POST };