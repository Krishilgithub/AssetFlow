"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { HugeiconsIcon } from "@hugeicons/react";
import { ViewIcon, ViewOffIcon, AsteriskIcon } from "@hugeicons/core-free-icons";
import GoogleIcon from "@/components/icons/google";

export function SignUpSection() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  return (
    <div className="flex min-h-screen bg-white text-[#1A1A1A] font-sans selection:bg-blue-100">
      {/* Left Column - Gradient Image Area */}
      <div className="hidden lg:flex flex-col justify-between w-1/2 p-10 m-4 rounded-[32px] bg-black relative overflow-hidden">
        {/* Placeholder for gradient image - User can replace src */}
        <Image 
          src="https://i.pinimg.com/736x/e3/60/9a/e3609abbec2a1baa5784b9bb3cdbdb1d.jpg" 
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
          <p className="text-lg font-medium mb-4 opacity-90">You can easily</p>
          <h1 className="text-4xl font-bold leading-tight max-w-lg">
            Get access your personal hub for clarity and productivity
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
            <h2 className="text-4xl font-bold mb-4 tracking-tight">Create an account</h2>
            <p className="text-gray-500 text-sm leading-relaxed">
              Access your tasks, notes, and projects anytime, anywhere - and keep everything flowing in one place.
            </p>
          </div>

          <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-900">Your email</label>
              <input 
                type="email" 
                placeholder="youremail@gmail.com" 
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all placeholder:text-gray-400 text-sm"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-900">Password</label>
              <div className="relative">
                <input 
                  type={showPassword ? "text" : "password"} 
                  placeholder="••••••••••" 
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
              <label className="text-sm font-semibold text-gray-900">Confirm password</label>
              <div className="relative">
                <input 
                  type={showConfirmPassword ? "text" : "password"} 
                  placeholder="••••••••••" 
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all placeholder:text-gray-400 text-sm"
                />
                <button 
                  type="button" 
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <HugeiconsIcon icon={showConfirmPassword ? ViewOffIcon : ViewIcon} size={20} />
                </button>
              </div>
            </div>

            <button className="w-full py-3.5 mt-4 bg-black hover:bg-neutral-800 text-white rounded-xl font-semibold transition-colors">
              Get Started
            </button>
          </form>

          <div className="mt-8">
            <div className="relative flex items-center py-5">
              <div className="flex-grow border-t border-gray-200"></div>
              <span className="flex-shrink-0 mx-4 text-gray-400 text-xs">or continue with</span>
              <div className="flex-grow border-t border-gray-200"></div>
            </div>

            <button className="w-full flex items-center justify-center gap-2.5 py-3 border border-gray-200 bg-white hover:bg-gray-50 text-gray-700 rounded-xl font-semibold transition-colors text-sm">
              <GoogleIcon className="w-5 h-5" />
              <span>Sign up with Google</span>
            </button>
          </div>

          <p className="text-center mt-10 text-sm text-gray-500">
            Already have an account? <Link href="/login-in" className="text-black font-semibold hover:underline">Log in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}