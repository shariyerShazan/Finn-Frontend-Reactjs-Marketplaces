/* eslint-disable @typescript-eslint/no-explicit-any */
import { useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import { FaArrowRight, FaArrowLeft } from "react-icons/fa";
import type { Swiper as SwiperType } from "swiper";
import { Loader2, Zap } from "lucide-react";
import "swiper/css";
import "swiper/css/navigation";
import AdCard from "../AdCard";
import { useGetAllAdsQuery } from "@/redux/fetures/ads.api";

const BestAdsHome = () => {
  const swiperRef = useRef<SwiperType | null>(null);

  const { data, isLoading } = useGetAllAdsQuery({
    page: 1,
    limit: 12,
    isSold: "false",
  });

  const boostedAds = data?.data?.filter((ad: any) => ad.isBoosted) || [];

  if (isLoading) {
    return (
      <div className="flex justify-center py-10">
        <Loader2 className="animate-spin text-amber-500" size={30} />
      </div>
    );
  }

  if (boostedAds.length === 0) return null;

  return (
    <section className="mx-auto mb-16 bg-gradient-to-r from-amber-50/50 via-white to-amber-50/50 py-10 rounded-[2.5rem] border border-amber-100 shadow-sm px-6">
      <div className="flex justify-between items-center mb-8">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Zap className="text-amber-500 fill-amber-500" size={18} />
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-amber-600">
              Featured Listings
            </span>
          </div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">
            Best Deals For You
          </h2>
        </div>

        <div className="flex gap-3">
          <button
            onClick={() => swiperRef.current?.slidePrev()}
            className="p-3 border border-amber-200 rounded-full hover:bg-white cursor-pointer hover:shadow-md transition bg-amber-50 text-amber-600 active:scale-95"
          >
            <FaArrowLeft size={14} />
          </button>
          <button
            onClick={() => swiperRef.current?.slideNext()}
            className="p-3 bg-amber-500 text-white rounded-full cursor-pointer hover:bg-amber-600 shadow-lg shadow-amber-200 active:scale-95"
          >
            <FaArrowRight size={14} />
          </button>
        </div>
      </div>

      <Swiper
        modules={[Navigation]}
        onBeforeInit={(swiper: SwiperType) => {
          swiperRef.current = swiper;
        }}
        spaceBetween={20}
        slidesPerView={1}
        breakpoints={{
          640: { slidesPerView: 2 },
          1024: { slidesPerView: 4 },
          1280: { slidesPerView: 5 },
        }}
        className="mySwiper"
      >
        {boostedAds.map((ad: any) => (
          <SwiperSlide key={ad.id} className="pb-5">
            {/* AdCard এর ভেতরে isBoosted প্রপস পাঠিয়ে বর্ডার হাইলাইট করতে পারেন */}
            <AdCard ad={ad} />
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
};

export default BestAdsHome;
