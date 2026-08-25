"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLogin() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter(); // Keep this just in case, though we won't use it for the redirect anymore

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/admin/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      if (res.ok) {
        // FIX: Force a hard reload so the browser recognizes the new secure Vercel cookie
        window.location.href = "/admin";
      } else {
        const data = await res.json();
        setError(data.error || "Incorrect password");
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-950 flex items-center justify-center p-6 font-sans relative overflow-hidden">
      {/* Premium Background Glow Effect */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-600/20 blur-[120px] rounded-full pointer-events-none"></div>

      <div className="max-w-md w-full relative z-10">
        <div className="bg-gray-900 border border-gray-800 p-10 rounded-3xl shadow-2xl backdrop-blur-xl">
          
          <div className="text-center mb-10">
            <div className="w-16 h-16 bg-black border border-gray-700 text-white rounded-2xl flex items-center justify-center text-2xl font-black mx-auto mb-6 shadow-inner">
              R
            </div>
            <h1 className="text-2xl font-black text-white tracking-tight mb-2">Raonic Command Center</h1>
            <p className="text-sm text-gray-400 font-medium">Enter your credentials to access the secure dashboard.</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Admin Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-gray-950 border border-gray-800 text-white rounded-xl px-5 py-4 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all font-mono tracking-widest text-lg"
                placeholder="••••••••"
              />
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/50 text-red-500 text-sm px-4 py-3 rounded-xl font-medium text-center">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-white text-black font-bold text-sm uppercase tracking-widest py-4 rounded-xl hover:bg-gray-200 transition-all disabled:bg-gray-600 disabled:text-gray-400 flex items-center justify-center gap-3 shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:shadow-[0_0_30px_rgba(255,255,255,0.2)]"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-gray-400 border-t-black rounded-full animate-spin"></div>
              ) : (
                "Authorize Access"
              )}
            </button>
          </form>
        </div>
        
        <p className="text-center text-xs text-gray-600 mt-8 font-medium tracking-wide flex items-center justify-center gap-2">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
          256-Bit Encrypted Connection
        </p>
      </div>
    </main>
  );
}