import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import mongoose from "mongoose";
import User from "@/models/User";
import Link from "next/link";

// Connect to MongoDB
const connectDB = async () => {
  if (mongoose.connections[0].readyState) return;
  if (!process.env.MONGODB_URI) throw new Error("Missing MONGODB_URI");
  await mongoose.connect(process.env.MONGODB_URI);
};

export default async function DashboardPage() {
  // Secure the route: Check if user is logged in
  const session = await getServerSession();
  if (!session || !session.user?.email) {
    redirect("/login");
  }

  await connectDB();
  const dbUser = await User.findOne({ email: session.user.email });

  const totalSpent = dbUser?.totalSpent || 0;
  const currentTier = dbUser?.tier || "Member";

  // Calculate tier progress logic
  let nextTierGoal = 500;
  let progressPercentage = (totalSpent / nextTierGoal) * 100;
  if (currentTier === "Executive") {
    nextTierGoal = 2000;
    progressPercentage = (totalSpent / 2000) * 100;
  } else if (currentTier === "Black") {
    progressPercentage = 100;
  }
  progressPercentage = Math.min(progressPercentage, 100);

  return (
    <main className="min-h-screen bg-black text-white px-6 py-16 font-sans">
      <div className="max-w-5xl mx-auto">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-12 border-b border-white/10 pb-8">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] uppercase tracking-widest text-gray-400 mb-3">
              Authenticated Session
            </div>
            <h1 className="text-3xl md:text-4xl font-black tracking-tight">
              Welcome back, {dbUser?.name || session.user.name}.
            </h1>
          </div>
          <Link
            href="/"
            className="px-6 py-3 rounded-xl bg-white text-black font-bold text-xs uppercase tracking-widest hover:bg-gray-200 transition-colors"
          >
            Storefront
          </Link>
        </div>

        {/* Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* VIP Card Section */}
          <div className="md:col-span-1 bg-gradient-to-br from-neutral-900 to-[#0a0a0a] border border-white/15 rounded-3xl p-8 relative overflow-hidden shadow-2xl flex flex-col justify-between">
            <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full blur-3xl pointer-events-none"></div>
            
            <div>
              <div className="flex justify-between items-center mb-12">
                <span className="font-black tracking-tighter text-lg">RAONIC</span>
                <span className="text-[10px] uppercase font-bold tracking-widest px-3 py-1 bg-white/10 rounded-full border border-white/10">
                  {currentTier} Tier
                </span>
              </div>
              <p className="text-gray-400 text-xs uppercase tracking-widest mb-1">Lifetime Investment</p>
              <p className="text-3xl font-black tracking-tight">${totalSpent.toLocaleString()}</p>
            </div>

            <div className="mt-12 pt-6 border-t border-white/10">
              <p className="text-[10px] text-gray-500 uppercase tracking-widest">Global Account Status</p>
              <p className="text-xs font-bold text-emerald-400 mt-1 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span> Active & Verified
              </p>
            </div>
          </div>

          {/* Perks & Recent Shopping Activity */}
          <div className="md:col-span-2 space-y-8">
            
            {/* Tier Progress Card */}
            <div className="bg-neutral-900/50 border border-white/10 rounded-3xl p-8 backdrop-blur-xl">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-sm uppercase tracking-widest text-gray-300">Tier Progression</h3>
                <span className="text-xs font-bold text-gray-400">{progressPercentage.toFixed(0)}% Completed</span>
              </div>
              <div className="w-full bg-neutral-800 h-2 rounded-full overflow-hidden mb-4">
                <div 
                  className="bg-white h-full transition-all duration-1000" 
                  style={{ width: `${progressPercentage}%` }}
                ></div>
              </div>
              <p className="text-xs text-gray-500">
                Unlock higher tier benefits, exclusive private drops, and expedited global courier priority as you build your collection.
              </p>
            </div>

            {/* Recent Shopping Orders */}
            <div className="bg-neutral-900/50 border border-white/10 rounded-3xl p-8 backdrop-blur-xl">
              <h3 className="font-bold text-sm uppercase tracking-widest text-gray-300 mb-6">Recent Shopping & Orders</h3>
              
              {totalSpent === 0 ? (
                <div className="text-center py-8 border border-dashed border-white/10 rounded-2xl">
                  <p className="text-xs text-gray-500 uppercase tracking-wider mb-3">No acquisitions recorded yet</p>
                  <Link href="/" className="text-xs font-bold underline underline-offset-4 text-white">
                    Explore the Store
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Future dynamic orders mapped here */}
                  <div className="flex items-center justify-between p-4 rounded-xl bg-black/40 border border-white/5">
                    <div>
                      <p className="text-xs font-bold text-white">Latest Store Order</p>
                      <p className="text-[10px] text-gray-500">Synced with database records</p>
                    </div>
                    <span className="text-xs font-mono font-bold">${totalSpent.toLocaleString()}</span>
                  </div>
                </div>
              )}
            </div>

          </div>
        </div>
      </div>
    </main>
  );
}