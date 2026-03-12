/* eslint-disable @typescript-eslint/no-explicit-any */
// import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
// import { useVerifyOtpMutation } from "@/redux/api/authApi";
// import { VerifyOtpRequest } from "@/redux/api/types/auth";
// import { toast } from "sonner";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { useVerifyOtpMutation, type VerifyOtpRequest } from '@/redux/fetures/auth.api';
import { toast } from 'react-toastify';
import loginImg from "@/assets/Login/login.jpg";

const VerifyRegisterOtp = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email || ""; // Passed from Register or Login
  const [verifyOtp, { isLoading }] = useVerifyOtpMutation();

  const { handleSubmit, control } = useForm<VerifyOtpRequest>({
    defaultValues: { email, otp: "" }
  });

  const role = location.state?.role || "USER";
const onSubmit = async (data: VerifyOtpRequest) => {
  try {
    const res = await verifyOtp(data).unwrap();
    if (res.success) {
      toast.success(res.message);

      if (role === "SELLER") {
        navigate("/login", {
          state: { message: "Please login to setup your seller profile" },
        });
      } else {
        navigate("/login");
      }
    }
  } catch (err: any) {
    toast.error(err?.data?.message || "Invalid OTP");
  }
};

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <main className="max-w-5xl w-full grid md:grid-cols-2 gap-8 items-center">
        <div className="rounded-3xl overflow-hidden hidden md:block shadow-sm">
          <img
            src={loginImg}
            alt=" Hero"
            className="w-full h-[450px] object-cover"
          />
        </div>

        <Card className="border-none shadow-sm rounded-[32px] p-8 bg-white">
          <CardContent className="space-y-6 flex flex-col items-center text-center">
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

            <h1 className="text-2xl font-bold text-zinc-900">OTP Required</h1>
            <p className="text-zinc-500 text-sm max-w-[280px]">
              Enter the 6 digits OTP code we've sent to your email{" "}
              <span className="font-semibold text-zinc-800">{email}</span>
            </p>

            <form
              onSubmit={handleSubmit(onSubmit)}
              className="space-y-8 w-full flex flex-col items-center"
            >
              <Controller
                name="otp"
                control={control}
                rules={{ required: true, minLength: 6 }}
                render={({ field }) => (
                  <InputOTP maxLength={6} {...field}>
                    <InputOTPGroup className="gap-2">
                      {[0, 1, 2, 3, 4, 5].map((index) => (
                        <InputOTPSlot
                          key={index}
                          index={index}
                          className="w-12 h-12 bg-zinc-100 border-none rounded-lg text-lg font-semibold"
                        />
                      ))}
                    </InputOTPGroup>
                  </InputOTP>
                )}
              />

              <Button
                disabled={isLoading}
                type="submit"
                className="w-32 cursor-pointer bg-[#0064AE] hover:bg-[#005494] text-white py-6 rounded-xl font-semibold"
              >
                {isLoading ? <Loader2 className="animate-spin" /> : "Verify"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default VerifyRegisterOtp;