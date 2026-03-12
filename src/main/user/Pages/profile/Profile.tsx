/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useEffect, useState, useRef } from "react";
import { useForm } from "react-hook-form";
import {
  Loader2,
  User,
  Mail,
  Phone,
  Building,
  MapPin,
  Save,
  Camera,
  ShieldCheck,
} from "lucide-react";
import {
  useGetMeQuery,
  useUpdateProfileMutation,
} from "@/redux/fetures/users.api";
import { toast } from "react-toastify";

const Profile = () => {
  const { data: userData, isLoading: isFetching } = useGetMeQuery();
  const [updateProfile, { isLoading: isUpdating }] = useUpdateProfileMutation();
  const [activeTab, setActiveTab] = useState("personal");

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const user = userData?.data;
  const isSeller = user?.role === "SELLER";

  const { register, handleSubmit, reset } = useForm();

  // ডাটা আসার পর ফর্ম ফিল্ডগুলো ফিলাপ হবে
  useEffect(() => {
    if (user) {
      reset({
        firstName: user.firstName,
        lastName: user.lastName,
        nickName: user.nickName,
        phone: user.phone,
        sellerData: {
          companyName: user.sellerProfile?.companyName || "",
          address: user.sellerProfile?.address || "",
          city: user.sellerProfile?.city || "",
          state: user.sellerProfile?.state || "",
          zip: user.sellerProfile?.zip || "",
        },
      });
    }
  }, [user, reset]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

const onSubmit = async (data: any) => {
  const toastId = toast.loading("Updating profile...");
  try {
    const formData = new FormData();

    if (selectedFile) {
      formData.append("profilePicture", selectedFile);
    }
    formData.append("firstName", data.firstName || "");
    formData.append("lastName", data.lastName || "");
    formData.append("nickName", data.nickName || "");
    formData.append("phone", data.phone || "");

if (isSeller) {
  const sellerPayload = {
    companyName: data?.sellerData?.companyName || "",
    address: data?.sellerData?.address || "",
    city: data?.sellerData?.city || "",
    state: data?.sellerData?.state || "",
    country: user?.sellerProfile?.country || "BD",
    zip: Number(data?.sellerData?.zip) || 0,
    companyWebSite: user?.sellerProfile?.companyWebSite || "", 
  };
  formData.append("sellerData", JSON.stringify(sellerPayload));
}

    const res = await updateProfile(formData).unwrap();

    if (res.success) {
      toast.update(toastId, {
        render: "Profile updated successfully!",
        type: "success",
        isLoading: false,
        autoClose: 3000,
      });
      setSelectedFile(null);
      setPreviewUrl(null);
    }
  } catch (error: any) {
    console.error("Update Error:", error);
    toast.update(toastId, {
      render: error?.data?.message || "Update failed. Check console.",
      type: "error",
      isLoading: false,
      autoClose: 3000,
    });
  }
};

  if (isFetching) {
    return (
      <div className="h-[60vh] flex items-center justify-center">
        <Loader2 className="animate-spin text-[#0064AE]" size={40} />
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-4 md:p-8 animate-in fade-in duration-700">
      <div className="bg-white rounded-[40px] shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-slate-100 overflow-hidden">
        {/* Banner & Avatar */}
        <div className="h-32 bg-gradient-to-r from-[#0064AE] to-[#003d6b] relative">
          <div className="absolute -bottom-16 left-8 md:left-12 flex items-end gap-6">
            <div className="relative group">
              <div className="w-32 h-32 rounded-[32px] bg-white p-1.5 shadow-xl">
                <div className="w-full h-full rounded-[26px] bg-slate-100 overflow-hidden flex items-center justify-center border border-slate-100">
                  {previewUrl || user?.profilePicture ? (
                    <img
                      src={previewUrl || user.profilePicture}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <User size={48} className="text-slate-300" />
                  )}
                </div>
              </div>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageChange}
                accept="image/*"
                className="hidden"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="absolute bottom-2 right-2 p-2 bg-black text-white rounded-xl shadow-lg hover:scale-110 transition-transform cursor-pointer"
              >
                <Camera size={16} />
              </button>
            </div>
            <div className="mb-2 hidden md:block">
              <h2 className="text-2xl font-black text-slate-900 leading-tight">
                {user?.firstName} {user?.lastName}
              </h2>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                  {user?.role}
                </span>
                <ShieldCheck size={14} className="text-blue-500" />
              </div>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="mt-20 px-8 md:px-12 flex items-center gap-8 border-b border-slate-50">
          <button
            type="button"
            onClick={() => setActiveTab("personal")}
            className={`pb-4 text-sm font-black uppercase tracking-widest transition-all relative ${activeTab === "personal" ? "text-[#0064AE]" : "text-slate-400"}`}
          >
            Personal Info
            {activeTab === "personal" && (
              <div className="absolute bottom-0 left-0 w-full h-1 bg-[#0064AE] rounded-t-full" />
            )}
          </button>
          {isSeller && (
            <button
              type="button"
              onClick={() => setActiveTab("business")}
              className={`pb-4 text-sm font-black uppercase tracking-widest transition-all relative ${activeTab === "business" ? "text-[#0064AE]" : "text-slate-400"}`}
            >
              Business Details
              {activeTab === "business" && (
                <div className="absolute bottom-0 left-0 w-full h-1 bg-[#0064AE] rounded-t-full" />
              )}
            </button>
          )}
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="p-8 md:p-12">
          {activeTab === "personal" ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-6 animate-in slide-in-from-left-4 duration-500">
              <CustomInput
                label="First Name"
                register={register("firstName")}
              />
              <CustomInput label="Last Name" register={register("lastName")} />
              <CustomInput label="Nickname" register={register("nickName")} />
              <CustomInput
                label="Phone Number"
                register={register("phone")}
                icon={<Phone size={18} />}
              />
              <div className="md:col-span-2">
                <CustomInput
                  label="Email Address"
                  value={user?.email}
                  disabled
                  icon={<Mail size={18} />}
                  helper="Email cannot be changed"
                />
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-6 animate-in slide-in-from-right-4 duration-500">
              <div className="md:col-span-2">
                <CustomInput
                  label="Company Name"
                  register={register("sellerData.companyName")}
                  icon={<Building size={18} />}
                />
              </div>
              <div className="md:col-span-2">
                <CustomInput
                  label="Office Address"
                  register={register("sellerData.address")}
                  icon={<MapPin size={18} />}
                />
              </div>
              <CustomInput
                label="City"
                register={register("sellerData.city")}
              />
              <CustomInput
                label="Zip Code"
                type="number"
                register={register("sellerData.zip", { valueAsNumber: true })}
              />
            </div>
          )}

          <div className="mt-12 flex flex-col md:flex-row items-center justify-between pt-8 border-t border-slate-50 gap-4">
            <p className="text-xs text-slate-400 font-medium italic">
              * Last updated:{" "}
              {user?.updatedAt
                ? new Date(user.updatedAt).toLocaleDateString()
                : "N/A"}
            </p>
            <button
              disabled={isUpdating}
              type="submit"
              className="w-full md:w-auto px-10 py-4 bg-[#0064AE] hover:bg-[#00528f] text-white rounded-2xl font-black uppercase text-xs tracking-[2px] flex items-center justify-center gap-3 transition-all active:scale-95 shadow-lg disabled:opacity-50"
            >
              {isUpdating ? (
                <Loader2 className="animate-spin" size={18} />
              ) : (
                <Save size={18} />
              )}
              Update Profile
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// --- সংশোধিত ইনপুট কম্পোনেন্ট ---
const CustomInput = ({
  label,
  register,
  type = "text",
  icon,
  disabled,
  value,
  helper,
}: any) => (
  <div className="space-y-2 group">
    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
      {label}
    </label>
    <div className="relative">
      {icon && (
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300">
          {icon}
        </div>
      )}
      <input
        {...register}
        type={type}
        disabled={disabled}
        defaultValue={value} // value এর বদলে defaultValue অথবা register হ্যান্ডেল করবে
        className={`w-full ${icon ? "pl-12" : "pl-4"} pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-50 focus:border-[#0064AE] outline-none transition-all font-bold text-slate-700 disabled:bg-slate-100 disabled:text-slate-400`}
      />
    </div>
    {helper && (
      <p className="text-[9px] text-slate-400 font-bold uppercase ml-1">
        {helper}
      </p>
    )}
  </div>
);

export default Profile;
