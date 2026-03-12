/* eslint-disable @typescript-eslint/no-explicit-any */
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Building2, Globe } from "lucide-react";
import { toast } from "react-toastify";
import { useCreateSellerProfileMutation } from "@/redux/fetures/users.api";

// DTO অনুযায়ী Interface
interface SellerProfileForm {
  companyName: string;
  companyWebSite?: string; // ওয়েবসাইট এখন অপশনাল
  address: string;
  city: string;
  state: string;
  zip: number;
  country: string;
}

export default function CompleteSellerProfile() {
  const navigate = useNavigate();
  const [createProfile, { isLoading }] = useCreateSellerProfileMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SellerProfileForm>();

  const onSubmit = async (data: SellerProfileForm) => {
    try {
      const formattedData = {
        ...data,
        zip: Number(data.zip),
        // ওয়েবসাইট খালি থাকলে তা পাঠানোর প্রয়োজন নেই অথবা null হিসেবে পাঠাতে পারেন
        companyWebSite: data.companyWebSite || "",
      };

      const response = await createProfile(formattedData).unwrap();
      toast.success(
        response?.message || "Profile created! Please wait for approval.",
      );
      navigate("/");
    } catch (err: any) {
      const errorMessage =
        err?.data?.message || "Failed to create seller profile";

      if (Array.isArray(errorMessage)) {
        errorMessage.forEach((msg: string) => toast.error(msg));
      } else {
        toast.error(errorMessage);
      }
    }
  };

  return (
    <div className="min-h-[80vh] bg-zinc-50 flex items-center justify-center p-4">
      <Card className="max-w-2xl w-full border-none shadow-lg rounded-[24px] overflow-hidden">
        <CardHeader className="bg-[#0064AE] text-white p-8">
          <CardTitle className="text-2xl font-bold flex items-center gap-2">
            <Building2 /> Setup Your Seller Profile
          </CardTitle>
          <p className="text-blue-100 text-sm mt-2">
            Provide your business details to start selling on Finn.
          </p>
        </CardHeader>

        <CardContent className="p-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Business Basic Info */}
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-zinc-700">
                  Company Name *
                </label>
                <Input
                  {...register("companyName", {
                    required: "Company name is required",
                    minLength: { value: 3, message: "Minimum 3 characters" },
                  })}
                  placeholder="Finn Shop Ltd"
                  className="bg-zinc-100 border-none h-11"
                />
                {errors.companyName && (
                  <span className="text-xs text-red-500">
                    {errors.companyName.message}
                  </span>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-zinc-700">
                  Website URL (Optional)
                </label>
                <div className="relative">
                  <Input
                    {...register("companyWebSite")} // এখানে কোন ভ্যালিডেশন নেই, তাই এটি অপশনাল
                    placeholder="https://example.com"
                    className="bg-zinc-100 border-none h-11 pl-9"
                  />
                  <Globe
                    className="absolute left-3 top-3 text-zinc-400"
                    size={16}
                  />
                </div>
              </div>
            </div>

            {/* Address Details */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-zinc-700">
                Street Address *
              </label>
              <Input
                {...register("address", { required: "Address is required" })}
                placeholder="123 Business Avenue"
                className="bg-zinc-100 border-none h-11"
              />
              {errors.address && (
                <span className="text-xs text-red-500">
                  {errors.address.message}
                </span>
              )}
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-zinc-700">
                  City *
                </label>
                <Input
                  {...register("city", { required: "City is required" })}
                  placeholder="Dhaka"
                  className="bg-zinc-100 border-none h-11"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-zinc-700">
                  State/Division *
                </label>
                <Input
                  {...register("state", { required: "State is required" })}
                  placeholder="Dhaka"
                  className="bg-zinc-100 border-none h-11"
                />
              </div>

              <div className="space-y-2 col-span-2 md:col-span-1">
                <label className="text-sm font-semibold text-zinc-700">
                  Zip Code *
                </label>
                <Input
                  {...register("zip", {
                    required: "Required",
                    valueAsNumber: true,
                  })}
                  type="number"
                  placeholder="1212"
                  className="bg-zinc-100 border-none h-11"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-zinc-700">
                Country (ISO Code, e.g., BD, US) *
              </label>
              <Input
                {...register("country", { required: "Required" })}
                placeholder="BD"
                maxLength={2}
                className="bg-zinc-100 border-none h-11 uppercase"
              />
              <p className="text-[10px] text-zinc-500 italic">
                Note: Use 2-letter country code for Stripe compatibility.
              </p>
            </div>

            <Button
              disabled={isLoading}
              type="submit"
              className="w-full cursor-pointer bg-[#0064AE] hover:bg-[#005494] text-white py-6 text-lg font-semibold rounded-xl mt-4 transition-all"
            >
              {isLoading ? (
                <Loader2 className="animate-spin mr-2" />
              ) : (
                "Complete & Open Shop"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
