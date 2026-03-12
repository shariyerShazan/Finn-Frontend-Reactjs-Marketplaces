/* eslint-disable @typescript-eslint/no-explicit-any */
// import React from 'react';
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import {  Loader2 } from "lucide-react";
// import { useLoginMutation } from "@/redux/api/authApi";
// import { LoginRequest } from "@/redux/api/types/auth";
// import { toast } from "sonner"; // Assuming you use Sonner for notifications
import { Link, useNavigate } from "react-router-dom";
import { useLoginMutation, type LoginRequest } from "@/redux/fetures/auth.api";
import { toast } from "react-toastify";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import loginImg from "@/assets/Login/login.jpg";
// import { retry } from "@reduxjs/toolkit/query";

export default function LoginPage() {
  const navigate = useNavigate();
  const [login, { isLoading }] = useLoginMutation();
  const [showPassword, setShowPassword] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginRequest>();

  const onSubmit = async (data: LoginRequest) => {
    try {
      const response : any = await login(data).unwrap();

      if (response.access_token) {
        localStorage.setItem("token", response.access_token);

        localStorage.setItem("userId", response.user.id);
        toast.success(response.message || "Login successful");

        const { role, isSeller , sellerProfile} = response.user as any;

        if (role === "SELLER") {
          if (isSeller) {
            navigate("/seller/dashboard");
          } else if (sellerProfile) {
            console.log();
            navigate("/");
          } else {
            navigate("/create-seller-profile");
          }
        } else if (role === "USER") {
          navigate("/");
        } else if (role === "ADMIN") {
          navigate("/admin/dashboard");
        } else {
          navigate("/login");
        }
      }
    } catch (err: any) {
      const errorData =
        err?.data?.message || err?.message || "Login failed. Please try again.";

      if (Array.isArray(errorData)) {
        errorData.forEach((msg: string) => {
          toast.error(msg);
        });
      } else {
        toast.error(errorData);
      }
    }
  };

  const handleGoogleLogin = () => {
    toast.warn("Comming soon!");
  };

  return (
    <div className="min-h-[80vh] ">
      <main className="max-w-6xl mx-auto   px-4 grid md:grid-cols-2 gap-8 items-center">
        {/* Left Side: Hero Image */}
        <div className="rounded-3xl overflow-hidden shadow-sm hidden md:block">
          <img
            src={loginImg}
            alt="Real Estate Handover"
            className="w-full h-[650px] object-cover"
          />
        </div>

        {/* Right Side: Login Card */}
        <Card className="border-none shadow-sm rounded-[32px] p-4 bg-white">
          <CardContent className="pt-6 space-y-6">
            <div className="flex justify-between items-center mb-8">
              <h1 className="text-3xl font-semibold text-zinc-900 tracking-tight">
                Login
              </h1>
              <Link to="/" className="flex items-center gap-3 hover:opacity-90">
                <div className="w-7 h-7 bg-white rounded flex items-center justify-center">
                  <span className="text-white bg-black p-3 rounded-md font-bold text-xs uppercase italic">
                    F
                  </span>
                </div>
                <h1 className="text-sm font-black text-[#0064AE] uppercase tracking-widest">
                  Finn
                </h1>
              </Link>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-zinc-700 ml-1">
                  Email Address *
                </label>
                <Input
                  {...register("email", { required: "Email is required" })}
                  type="email"
                  placeholder="Enter your email"
                  className={`bg-zinc-100 border-none h-12 rounded-xl focus-visible:ring-1 focus-visible:ring-[#0064AE] ${errors.email ? "ring-1 ring-red-500" : ""}`}
                />
                {errors.email && (
                  <p className="text-xs text-red-500 ml-1">
                    {errors.email.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-zinc-700 ml-1">
                  Password *
                </label>
                <div className="relative group">
                  <Input
                    {...register("password", {
                      required: "Password is required",
                      minLength: {
                        value: 8,
                        message: "Password must be at least 8 characters",
                      },
                    })}
                    type={showPassword ? "text" : "password"}
                    placeholder="Minimum 8 characters"
                    className={`bg-zinc-100 border-none h-12 rounded-xl pr-12 focus-visible:ring-1 focus-visible:ring-[#0064AE] ${
                      errors.password ? "ring-1 ring-red-500" : ""
                    }`}
                  />

                  {/* Toggle Button */}
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute cursor-pointer right-4 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-[#0064AE] transition-colors focus:outline-none"
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>

                {errors.password && (
                  <p className="text-xs text-red-500 ml-1 font-medium">
                    {errors.password.message as string}
                  </p>
                )}
              </div>

              <p className=" text-zinc-500 text-sm">
                Forgot Password?{" "}
                <span
                  onClick={() => navigate("/forgot-password")}
                  className="cursor-pointer text-[#0064AE] font-bold hover:underline"
                >
                  let's go!
                </span>
              </p>

              <Button
                disabled={isLoading}
                type="submit"
                className="w-full bg-[#0064AE] cursor-pointer hover:bg-[#005494] text-white py-7 text-lg font-semibold rounded-2xl transition-all active:scale-[0.98]"
              >
                {isLoading ? <Loader2 className="animate-spin" /> : "Continue"}
              </Button>
            </form>

            <div className="relative flex items-center py-2">
              <div className="flex-grow border-t border-zinc-200"></div>
              <span className="flex-shrink mx-4 text-zinc-400 text-sm font-medium">
                or
              </span>
              <div className="flex-grow border-t border-zinc-200"></div>
            </div>

            <div className="space-y-3">
              <Button
                onClick={handleGoogleLogin}
                variant="outline"
                className="w-full py-7 bg-zinc-100 border-none rounded-2xl flex gap-3 text-zinc-800 font-medium hover:bg-zinc-200"
              >
                <img
                  src="https://www.google.com/favicon.ico"
                  className="w-5 h-5"
                  alt="Google"
                />
                Continue with Google
              </Button>
            </div>

            <p className="text-center text-zinc-500 mt-8 text-sm">
              Don't have an account?{" "}
              <span
                onClick={() => navigate("/register")}
                className="cursor-pointer text-[#0064AE] font-bold hover:underline"
              >
                Register!
              </span>
            </p>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
