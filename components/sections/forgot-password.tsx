"use client";

import { useState } from "react";
import Link from "next/link";
import { HugeiconsIcon } from "@hugeicons/react";
import { AsteriskIcon } from "@hugeicons/core-free-icons";
import toast, { Toaster } from "react-hot-toast";

export function ForgotPasswordSection() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error || "Failed to send reset link");
      } else {
        toast.success("Password reset link sent to your email.");
        setSent(true);
      }
    } catch (err) {
      toast.error("An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-white text-[#1A1A1A] font-sans selection:bg-blue-100 items-center justify-center">
      <Toaster position="top-center" />
      <div className="w-full max-w-md px-8">
        <div className="mb-10 text-center">
          <div className="text-black mb-6 flex justify-center">
            <HugeiconsIcon icon={AsteriskIcon} size={48} />
          </div>
          <h2 className="text-3xl font-bold mb-3 tracking-tight">Reset your password</h2>
          <p className="text-gray-500 text-sm leading-relaxed">
            {sent 
              ? "We've sent a password reset link to your email. Please check your inbox."
              : "Enter your email address and we'll send you a link to reset your password."}
          </p>
        </div>

        {!sent ? (
          <form className="space-y-5" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-900">Your email</label>
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="youremail@gmail.com" 
                required
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all placeholder:text-gray-400 text-sm"
              />
            </div>

            <button disabled={loading} className="w-full py-3.5 mt-4 bg-black hover:bg-neutral-800 disabled:opacity-50 text-white rounded-xl font-semibold transition-colors">
              {loading ? "Sending..." : "Send Reset Link"}
            </button>
          </form>
        ) : (
          <div className="mt-4">
            <Link href="/login-in" className="w-full block text-center py-3.5 bg-black hover:bg-neutral-800 text-white rounded-xl font-semibold transition-colors">
              Return to Login
            </Link>
          </div>
        )}

        {!sent && (
          <p className="text-center mt-10 text-sm text-gray-500">
            Remember your password? <Link href="/login-in" className="text-black font-semibold hover:underline">Log in</Link>
          </p>
        )}
      </div>
    </div>
  );
}
