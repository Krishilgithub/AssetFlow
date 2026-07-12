"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { HugeiconsIcon } from "@hugeicons/react";
import { ViewIcon, ViewOffIcon, AsteriskIcon } from "@hugeicons/core-free-icons";
import GoogleIcon from "@/components/icons/google";
import { useGoogleLogin } from '@react-oauth/google';
import toast, { Toaster } from "react-hot-toast";

export function LoginSection() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error || "Login failed");
      } else {
        toast.success("Welcome back!");
        const role = data.user?.role || 'Employee';
        if (role === 'Admin') {
          router.push('/dashboard/admin');
        } else if (role === 'Asset Manager') {
          router.push('/dashboard/asset-manager');
        } else if (role === 'Department Head') {
          router.push('/dashboard/department-head');
        } else {
          router.push('/dashboard/employee');
        }
      }
    } catch (err) {
      toast.error("An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const googleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      setLoading(true);
      try {
        const res = await fetch('/api/auth/google', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ credential: tokenResponse.access_token })
        });
        const data = await res.json();
        if (res.ok) {
           toast.success("Logged in successfully!");
           const role = data.user?.role || 'Employee';
           if (role === 'Admin') {
             router.push('/dashboard/admin');
           } else if (role === 'Asset Manager') {
             router.push('/dashboard/asset-manager');
           } else if (role === 'Department Head') {
             router.push('/dashboard/department-head');
           } else {
             router.push('/dashboard/employee');
           }
        } else {
           toast.error(data.error || "Google login failed");
        }
      } catch (err) {
        toast.error("An error occurred");
      } finally {
        setLoading(false);
      }
    },
  });

  return (
    <div className="flex min-h-screen bg-white text-[#1A1A1A] font-sans selection:bg-blue-100">
      <Toaster position="top-center" />
      {/* Left Column - Gradient Image Area */}
      <div className="hidden lg:flex flex-col justify-between w-1/2 p-10 m-4 rounded-[32px] bg-black relative overflow-hidden">
        <Image 
          src="https://i.pinimg.com/736x/28/8e/26/288e26365d8b31ef42acff350c01c993.jpg" 
          alt="Abstract Gradient"
          className="object-cover opacity-50"
          fill
          unoptimized
        />
        
        <div className="relative z-10 text-white">
          <div className="text-4xl">
            <HugeiconsIcon icon={AsteriskIcon} size={48} />
          </div>
        </div>

        <div className="relative z-10 text-white mt-auto">
          <p className="text-lg font-medium mb-4 opacity-90">Welcome back</p>
          <h1 className="text-4xl font-bold leading-tight max-w-lg">
            Pick up right where you left off and stay productive
          </h1>
        </div>
      </div>

      {/* Right Column - Form Area */}
      <div className="flex flex-col justify-center w-full lg:w-1/2 px-8 sm:px-16 lg:px-24">
        <div className="max-w-md w-full mx-auto">
          <div className="mb-10">
            <div className="text-black mb-6">
              <HugeiconsIcon icon={AsteriskIcon} size={32} />
            </div>
            <h2 className="text-4xl font-bold mb-4 tracking-tight">Log in to your account</h2>
            <p className="text-gray-500 text-sm leading-relaxed">
              Enter your email and password to access your tasks, notes, and projects.
            </p>
          </div>

          <form className="space-y-5" onSubmit={handleLogin}>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-900">Your email</label>
              <input 
                type="email" 
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="youremail@gmail.com" 
                required
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all placeholder:text-gray-400 text-sm"
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-sm font-semibold text-gray-900">Password</label>
                <Link href="#" className="text-xs text-black hover:underline font-semibold">Forgot password?</Link>
              </div>
              <div className="relative">
                <input 
                  type={showPassword ? "text" : "password"} 
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••••" 
                  required
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

            <button disabled={loading} className="w-full py-3.5 mt-4 bg-black hover:bg-neutral-800 disabled:opacity-50 text-white rounded-xl font-semibold transition-colors">
              {loading ? "Logging in..." : "Log In"}
            </button>
          </form>

          <div className="mt-8">
            <div className="relative flex items-center py-5">
              <div className="flex-grow border-t border-gray-200"></div>
              <span className="flex-shrink-0 mx-4 text-gray-400 text-xs">or continue with</span>
              <div className="flex-grow border-t border-gray-200"></div>
            </div>

            <button onClick={() => googleLogin()} className="w-full flex items-center justify-center gap-2.5 py-3 border border-gray-200 bg-white hover:bg-gray-50 text-gray-700 rounded-xl font-semibold transition-colors text-sm">
              <GoogleIcon className="w-5 h-5" />
              <span>Log in with Google</span>
            </button>
          </div>

          <p className="text-center mt-10 text-sm text-gray-500">
            Don&apos;t have an account? <Link href="/sign-up" className="text-black font-semibold hover:underline">Sign up</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
