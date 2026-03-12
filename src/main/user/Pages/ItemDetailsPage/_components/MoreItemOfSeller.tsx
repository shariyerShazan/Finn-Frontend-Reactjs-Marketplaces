/* eslint-disable @typescript-eslint/no-explicit-any */
// import React from "react";
// import { useGetAdsBySellerQuery } from "@/redux/features/adsApi";
import AdCard from "../../HomePage/_components/AdCard";
import { Loader2 } from "lucide-react";
import { useGetAdsBySellerQuery } from "@/redux/fetures/ads.api";

const MoreItemOfSeller = ({ sellerId, currentAdId }: any) => {
  const {
    data: response,
    isLoading,
    isError,
  } = useGetAdsBySellerQuery(
    { sellerId: sellerId, limit: 10 },
    { skip: !sellerId }, // sellerId না থাকলে রিকোয়েস্ট পাঠাবে না
  );

  console.log("Seller ID:", sellerId);
  console.log("API Response:", response);

  const ads = response?.data || [];

  // ফিল্টার লজিক: বর্তমান অ্যাড বাদ দিয়ে বাকিগুলো
  const filteredAds = ads.filter((ad : any) => ad.id !== currentAdId).slice(0, 6);

  if (isLoading)
    return (
      <div className="flex justify-center py-10">
        <Loader2 className="animate-spin text-[#0064AE]" />
      </div>
    );
  if (isError)
    return (
      <p className="text-center text-rose-500">Failed to load seller ads.</p>
    );
  if (filteredAds.length === 0) return null;

  return (
    <div className="pt-6 space-y-8">
      {/* ... আপনার আগের UI কোড ... */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
        {filteredAds.map((ad : any) => (
          <AdCard key={ad.id} ad={ad} />
        ))}
      </div>
    </div>
  );
};

export default MoreItemOfSeller;
