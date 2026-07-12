"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { HugeiconsIcon } from "@hugeicons/react";
import { ViewIcon, ViewOffIcon, AsteriskIcon } from "@hugeicons/core-free-icons";
import toast, { Toaster } from "react-hot-toast";

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const email = searchParams.get("email");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!token || !email) {
      toast.error("Invalid or missing password reset token.");
    }
  }, [token, email]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    
    setLoading(true);
    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, token, newPassword: password })
      });
      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error || "Failed to reset password");
      } else {
        toast.success("Password reset successfully. You can now log in.");
        setTimeout(() => router.push('/login-in'), 2000);
      }
    } catch (err) {
      toast.error("An error occurred");
    } finally {
      setLoading(false);
    }
  };

  if (!token || !email) {
    return (
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-4">Invalid Link</h2>
        <p className="text-gray-500 mb-6">The password reset link is invalid or has expired.</p>
        <Link href="/forgot-password" className="text-black font-semibold hover:underline">Request a new link</Link>
      </div>
    );
  }

  return (
    <>
      <div className="mb-10 text-center">
        <div className="text-black mb-6 flex justify-center">
          <HugeiconsIcon icon={AsteriskIcon} size={48} />
        </div>
        <h2 className="text-3xl font-bold mb-3 tracking-tight">Create new password</h2>
        <p className="text-gray-500 text-sm leading-relaxed">
          Your new password must be different from previous used passwords.
        </p>
      </div>

      <form className="space-y-5" onSubmit={handleSubmit}>
        <div className="space-y-2">
          <label className="text-sm font-semibold text-gray-900">New Password</label>
          <div className="relative">
            <input 
              type={showPassword ? "text" : "password"} 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••" 
              required
              minLength={8}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all placeholder:text-gray-400 text-sm"
            />
            <button 
              type="button" 
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <HugeiconsIcon icon={showPassword ? ViewOffIcon : ViewIcon} size={20} />
            </button>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold text-gray-900">Confirm Password</label>
          <div className="relative">
            <input 
              type={showPassword ? "text" : "password"} 
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••••" 
              required
              minLength={8}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all placeholder:text-gray-400 text-sm"
            />
          </div>
        </div>

        <button disabled={loading} className="w-full py-3.5 mt-4 bg-black hover:bg-neutral-800 disabled:opacity-50 text-white rounded-xl font-semibold transition-colors">
          {loading ? "Resetting..." : "Reset Password"}
        </button>
      </form>
    </>
  );
}

export function ResetPasswordSection() {
  return (
    <div className="flex min-h-screen bg-white text-[#1A1A1A] font-sans selection:bg-blue-100 items-center justify-center">
      <Toaster position="top-center" />
      <div className="w-full max-w-md px-8">
        <Suspense fallback={<div className="text-center">Loading...</div>}>
          <ResetPasswordForm />
        </Suspense>
      </div>
    </div>
  );
}
