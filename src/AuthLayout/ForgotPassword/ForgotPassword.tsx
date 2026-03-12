/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { Loader2, ArrowLeft, Mail, Lock } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { 
  useForgotPasswordMutation, 
  useResetPasswordMutation, 
  type ResetPasswordRequest
} from "@/redux/fetures/auth.api";
// import { ResetPasswordRequest } from "@/redux/api/types/auth";
import loginImg from "@/assets/Login/login.jpg"

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [step, setStep] = useState<"request" | "reset">("request");
  const [userEmail, setUserEmail] = useState("");

  const [forgotPassword, { isLoading: isRequesting }] = useForgotPasswordMutation();
  const [resetPassword, { isLoading: isResetting }] = useResetPasswordMutation();

  // Form for requesting OTP
  const requestForm = useForm<{ email: string }>();
  // Form for resetting password
  const resetForm = useForm<ResetPasswordRequest>();

  // Step 1: Request OTP
  const onRequestSubmit = async (data: { email: string }) => {
    try {
      const res = await forgotPassword(data).unwrap();
      if (res.success) {
        toast.success(res.message || "OTP sent successfully!");
        setUserEmail(data.email);
        setStep("reset");
      }
    } catch (err: any) {
      const errorData = err?.data?.message || err?.message || "Could not send OTP";

      if (Array.isArray(errorData)) {
        errorData.forEach((msg: string) => toast.error(msg));
      } else {
        toast.error(errorData);
      }
    }
  };


  const onResetSubmit = async (data: ResetPasswordRequest) => {
    try {
      const payload = { ...data, email: userEmail };
      const res = await resetPassword(payload).unwrap();
      if (res.success) {
        toast.success(res.message || "Password reset successfully!");
        navigate("/login");
      }
    } catch (err: any) {
      const errorData = err?.data?.message || err?.message || "Reset failed";

      if (Array.isArray(errorData)) {
        errorData.forEach((msg: string) => toast.error(msg));
      } else {
        toast.error(errorData);
      }
    }
  };

  return (
    <div className="min-h-[80vh] flex items-start justify-center  px-4">
      <main className="max-w-5xl w-full grid md:grid-cols-2 gap-8 items-center">
        {/* Left Side: Illustration/Hero */}
        <div className="rounded-3xl overflow-hidden hidden md:block shadow-sm">
          <img
            src={loginImg}
            alt="Security"
            className="w-full h-[350px] object-cover"
          />
        </div>

        {/* Right Side: Logic Card */}
        <Card className="border-none shadow-sm rounded-[32px] p-6 bg-white overflow-hidden">
          <CardContent className="space-y-6">
            <div className="flex justify-between items-center">
              <button
                onClick={() =>
                  step === "reset" ? setStep("request") : navigate("/login")
                }
                className="p-2 hover:bg-zinc-100 rounded-full transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-zinc-600" />
              </button>
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

            {step === "request" ? (
              <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                <div className="space-y-2">
                  <h1 className="text-2xl font-bold text-zinc-900">
                    Forgot Password?
                  </h1>
                  <p className="text-zinc-500 text-sm">
                    Enter your email and we'll send you an OTP to reset your
                    password.
                  </p>
                </div>

                <form
                  onSubmit={requestForm.handleSubmit(onRequestSubmit)}
                  className="space-y-4"
                >
                  <div className="space-y-1">
                    <label className="text-sm font-semibold text-zinc-700 ml-1">
                      Email Address
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-3.5 w-4 h-4 text-zinc-400" />
                      <Input
                        {...requestForm.register("email", { required: true })}
                        type="email"
                        placeholder="example@mail.com"
                        className="bg-zinc-100 border-none h-12 rounded-xl pl-11 focus-visible:ring-1 focus-visible:ring-[#0064AE]"
                      />
                    </div>
                  </div>

                  <Button
                    disabled={isRequesting}
                    className="w-full bg-[#0064AE] hover:bg-[#005494] text-white py-7 text-lg font-semibold rounded-2xl transition-all"
                  >
                    {isRequesting ? (
                      <Loader2 className="animate-spin" />
                    ) : (
                      "Send OTP"
                    )}
                  </Button>
                </form>
              </div>
            ) : (
              <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                <div className="space-y-2">
                  <h1 className="text-2xl font-bold text-zinc-900">
                    Reset Password
                  </h1>
                  <p className="text-zinc-500 text-sm">
                    We've sent a code to{" "}
                    <span className="font-semibold text-zinc-800">
                      {userEmail}
                    </span>
                  </p>
                </div>

                <form
                  onSubmit={resetForm.handleSubmit(onResetSubmit)}
                  className="space-y-6"
                >
                  <div className="space-y-3 flex flex-col items-center">
                    <label className="text-sm font-semibold text-zinc-700 self-start ml-1">
                      Verification Code
                    </label>
                    <InputOTP
                      maxLength={6}
                      onChange={(val) => resetForm.setValue("otp", val)}
                    >
                      <InputOTPGroup className="gap-2">
                        {[0, 1, 2, 3, 4, 5].map((i) => (
                          <InputOTPSlot
                            key={i}
                            index={i}
                            className="w-11 h-12 bg-zinc-100 border-none rounded-lg text-lg font-bold"
                          />
                        ))}
                      </InputOTPGroup>
                    </InputOTP>
                  </div>

                  <div className="space-y-1">
                    <label className="text-sm font-semibold text-zinc-700 ml-1">
                      New Password
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-4 top-3.5 w-4 h-4 text-zinc-400" />
                      <Input
                        {...resetForm.register("newPassword", {
                          required: true,
                          minLength: 8,
                        })}
                        type="password"
                        placeholder="Minimum 8 characters"
                        className="bg-zinc-100 border-none h-12 rounded-xl pl-11 focus-visible:ring-1 focus-visible:ring-[#0064AE]"
                      />
                    </div>
                  </div>

                  <Button
                    disabled={isResetting}
                    className="w-full bg-[#0064AE] hover:bg-[#005494] text-white py-7 text-lg font-semibold rounded-2xl transition-all"
                  >
                    {isResetting ? (
                      <Loader2 className="animate-spin" />
                    ) : (
                      "Reset Password"
                    )}
                  </Button>
                </form>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}