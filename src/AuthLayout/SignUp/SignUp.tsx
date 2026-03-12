/* eslint-disable @typescript-eslint/no-explicit-any */
import { useForm, Controller } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Link, useNavigate } from "react-router-dom";
import { Loader2, Eye, EyeOff } from "lucide-react";
import {
  useRegisterMutation,
  type RegisterRequest,
} from "@/redux/fetures/auth.api";
import { toast } from "react-toastify";
import { useState } from "react";
import loginImg from "@/assets/Login/login.jpg"

export default function SignUp() {
  const navigate = useNavigate();
  const [registerUser, { isLoading }] = useRegisterMutation();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    watch, 
    formState: { errors },
  } = useForm<RegisterRequest & { confirmPassword: string }>({
    defaultValues: {
      role: "USER",
    },
  });

  const passwordValue = watch("password");

  const onSubmit = async (data: any) => {
    try {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { confirmPassword, ...registerData } = data;

      const res = await registerUser(registerData).unwrap();
      if (res.success) {
        toast.success(res.message || "Success!");
        navigate("/verify-otp", {
          state: { email: data.email, role: data.role },
        });
      }
    } catch (err: any) {
      const serverError = err?.data?.message;
      if (Array.isArray(serverError)) {
        serverError.forEach((msg: string) => toast.error(msg));
      } else if (typeof serverError === "string") {
        toast.error(serverError);
      } else {
        toast.error("Something went wrong. Please try again.");
      }
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center">
      <main className="max-w-6xl mx-auto px-4 grid md:grid-cols-2 gap-8 items-start">
        {/* Left Side: Hero Image */}
        <div className="rounded-3xl overflow-hidden shadow-sm hidden md:block sticky top-12">
          <img
            src={loginImg}
            alt=""
            className="w-full h-[800px] object-cover"
          />
        </div>

        {/* Right Side: Registration Card */}
        <Card className="border-none shadow-sm rounded-[32px] p-6 bg-white">
          <CardContent className="space-y-6">
            <div className="flex justify-between items-center mb-4">
              <h1 className="text-3xl font-bold text-zinc-900">Registration</h1>
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

            <form
              onSubmit={handleSubmit(onSubmit)}
              className="grid grid-cols-2 gap-4"
            >
              <div className="space-y-1 col-span-1">
                <label className="text-sm font-semibold text-zinc-700 ml-1">
                  First Name
                </label>
                <Input
                  {...register("firstName", {
                    required: "First name is required",
                  })}
                  placeholder="John"
                  className="bg-zinc-100 border-none h-11 rounded-xl"
                />
              </div>

              <div className="space-y-1 col-span-1">
                <label className="text-sm font-semibold text-zinc-700 ml-1">
                  Last Name
                </label>
                <Input
                  placeholder="Doe"
                  {...register("lastName", {
                    required: "Last name is required",
                  })}
                  className="bg-zinc-100 border-none h-11 rounded-xl"
                />
              </div>

              <div className="space-y-1 col-span-2">
                <label className="text-sm font-semibold text-zinc-700 ml-1">
                  Account Type *
                </label>
                <Controller
                  name="role"
                  control={control}
                  render={({ field }) => (
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <SelectTrigger className="bg-zinc-100 border-none !h-11 rounded-xl focus:ring-[#0064AE] w-full">
                        <SelectValue placeholder="Select account type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="USER">
                          Standard User (Buyer)
                        </SelectItem>
                        <SelectItem value="SELLER">
                          Seller / Business
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>

              <div className="space-y-1 col-span-2">
                <label className="text-sm font-semibold text-zinc-700 ml-1">
                  Nickname
                </label>
                <Input
                  placeholder="Your nick name!"
                  {...register("nickName", { required: true })}
                  className="bg-zinc-100 border-none h-11 rounded-xl"
                />
              </div>

              <div className="space-y-1 col-span-2">
                <label className="text-sm font-semibold text-zinc-700 ml-1">
                  Email Address
                </label>
                <Input
                  {...register("email", { required: "Email is required" })}
                  type="email"
                  placeholder="Enter your email address"
                  className="bg-zinc-100 border-none h-11 rounded-xl"
                />
              </div>

              <div className="space-y-1 col-span-2">
                <label className="text-sm font-semibold text-zinc-700 ml-1">
                  Phone Number
                </label>
                <Input
                  {...register("phone", { required: true })}
                  placeholder="+1..."
                  className="bg-zinc-100 border-none h-11 rounded-xl"
                />
              </div>

              {/* Password Field */}
              <div className="space-y-1 col-span-2">
                <label className="text-sm font-semibold text-zinc-700 ml-1">
                  Password *
                </label>
                <div className="relative">
                  <Input
                    {...register("password", {
                      required: "Password is required",
                      minLength: { value: 8, message: "Min 8 characters" },
                    })}
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    className="bg-zinc-100 border-none h-11 rounded-xl pr-12 focus-visible:ring-1 focus-visible:ring-[#0064AE]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute cursor-pointer right-4 top-1/2 -translate-y-1/2 text-zinc-400"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {/* Confirm Password Field */}
              <div className="space-y-1 col-span-2">
                <label className="text-sm font-semibold text-zinc-700 ml-1">
                  Confirm Password *
                </label>
                <div className="relative">
                  <Input
                    {...register("confirmPassword", {
                      required: "Please confirm password",
                      validate: (value) =>
                        value === passwordValue || "Passwords do not match",
                    })}
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    className={`bg-zinc-100 border-none h-11 rounded-xl pr-12 focus-visible:ring-1 focus-visible:ring-[#0064AE] ${errors.confirmPassword ? "ring-1 ring-red-500" : ""}`}
                  />
                </div>
                {errors.confirmPassword && (
                  <p className="text-xs text-red-500 ml-1">
                    {errors.confirmPassword.message as string}
                  </p>
                )}
              </div>

              <Button
                disabled={isLoading}
                type="submit"
                className="col-span-2 cursor-pointer bg-[#0064AE] hover:bg-[#005494] text-white py-7 text-lg font-semibold rounded-2xl mt-4"
              >
                {isLoading ? (
                  <Loader2 className="animate-spin" />
                ) : (
                  "Create Account"
                )}
              </Button>
            </form>

            <p className="text-center text-zinc-500 text-sm">
              Already have an account?{" "}
              <a
                href="/login"
                className="text-[#0064AE] font-bold hover:underline"
              >
                Login!
              </a>
            </p>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
