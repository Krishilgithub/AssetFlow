import * as fs from 'fs';
import * as path from 'path';

const signupPath = path.join(__dirname, 'components/sections/sign-up.tsx');

const content = `"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { HugeiconsIcon } from "@hugeicons/react";
import { ViewIcon, ViewOffIcon, AsteriskIcon } from "@hugeicons/core-free-icons";
import GoogleIcon from "@/components/icons/google";
import { useGoogleLogin } from '@react-oauth/google';
import toast, { Toaster } from "react-hot-toast";

export function SignUpSection() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  // States
  const [isOtpStep, setIsOtpStep] = useState(false);
  const [loading, setLoading] = useState(false);
  
  // Form Data
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [otp, setOtp] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, terms: true })
      });
      const data = await res.json();

      if (!res.ok) {
        if (data.error && Array.isArray(data.error)) {
          toast.error(data.error[0].message);
        } else {
          toast.error(data.error || "Signup failed");
        }
      } else {
        toast.success("OTP sent to your email!");
        setIsOtpStep(true);
      }
    } catch (err) {
      toast.error("An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/auth/verify-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: formData.email, otp })
      });
      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error || "Invalid OTP");
      } else {
        toast.success("Account verified! You can now log in.");
        setTimeout(() => router.push('/login-in'), 2000);
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
          body: JSON.stringify({ credential: tokenResponse.access_token }) // Depending on flow
        });
        const data = await res.json();
        if (res.ok) {
           toast.success("Logged in successfully!");
           router.push('/dashboard');
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
            <h2 className="text-4xl font-bold mb-4 tracking-tight">
              {isOtpStep ? "Verify your email" : "Create an account"}
            </h2>
            <p className="text-gray-500 text-sm leading-relaxed">
              {isOtpStep 
                ? "Enter the 6-digit OTP sent to your email address."
                : "Access your tasks, notes, and projects anytime, anywhere - and keep everything flowing in one place."}
            </p>
          </div>

          {!isOtpStep ? (
            <>
              <form className="space-y-5" onSubmit={handleSignup}>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-900">First name</label>
                    <input 
                      type="text" 
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      placeholder="John" 
                      required
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all placeholder:text-gray-400 text-sm"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-900">Last name</label>
                    <input 
                      type="text" 
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      placeholder="Doe" 
                      required
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all placeholder:text-gray-400 text-sm"
                    />
                  </div>
                </div>

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
                  <label className="text-sm font-semibold text-gray-900">Password</label>
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

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-900">Confirm password</label>
                  <div className="relative">
                    <input 
                      type={showConfirmPassword ? "text" : "password"} 
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      placeholder="••••••••••" 
                      required
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

                <button disabled={loading} className="w-full py-3.5 mt-4 bg-black hover:bg-neutral-800 disabled:opacity-50 text-white rounded-xl font-semibold transition-colors">
                  {loading ? "Processing..." : "Get Started"}
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
                  <span>Sign up with Google</span>
                </button>
              </div>

              <p className="text-center mt-10 text-sm text-gray-500">
                Already have an account? <Link href="/login-in" className="text-black font-semibold hover:underline">Log in</Link>
              </p>
            </>
          ) : (
            <form className="space-y-5" onSubmit={handleVerifyOtp}>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-900">One-Time Password (OTP)</label>
                <input 
                  type="text" 
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  placeholder="123456"
                  maxLength={6}
                  required
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all placeholder:text-gray-400 text-sm text-center text-2xl tracking-[0.5em]"
                />
              </div>

              <button disabled={loading} className="w-full py-3.5 mt-4 bg-black hover:bg-neutral-800 disabled:opacity-50 text-white rounded-xl font-semibold transition-colors">
                {loading ? "Verifying..." : "Verify Email"}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
`;

fs.writeFileSync(signupPath, content);
console.log('SignUp Section Patched Successfully!');
