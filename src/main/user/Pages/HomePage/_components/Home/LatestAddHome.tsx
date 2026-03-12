/* eslint-disable @typescript-eslint/no-explicit-any */
import { useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import { FaArrowRight, FaArrowLeft } from "react-icons/fa";
import type { Swiper as SwiperType } from "swiper";
import { Loader2 } from "lucide-react";

// Importing Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import AdCard from "../AdCard";
import { useGetAllAdsQuery } from "@/redux/fetures/ads.api";

interface LatestAddHomeProps {
  title: string;
  categoryId?: string; 
  limit?: number;
}

const LatestAddHome = ({
  title,
  categoryId,
  limit = 10,
}: LatestAddHomeProps) => {
  const swiperRef = useRef<SwiperType | null>(null);

const { data, isLoading } = useGetAllAdsQuery({
  page: 1,
  limit: limit,
  categoryId: categoryId || "",
  subCategoryId: "", 
  isSold: "false",
});
  const ads = data?.data || [];

  if (isLoading) {
    return (
      <div className="flex justify-center py-10">
        <Loader2 className="animate-spin text-[#0064AE]" size={30} />
      </div>
    );
  }

  if (ads.length === 0) return null;

  return (
    <section className="mx-auto mb-16">
      {/* Section Header */}
      <div className="flex justify-between items-center mb-8 px-4 md:px-0">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">{title}</h2>
          <div className="h-1 w-20 bg-[#0064AE] mt-2 rounded-full"></div>
        </div>

        {/* Navigation Buttons */}
        <div className="flex gap-3">
          <button
            onClick={() => swiperRef.current?.slidePrev()}
            className="p-3 border rounded-full hover:bg-white cursor-pointer hover:shadow-md transition bg-gray-50 active:scale-95"
          >
            <FaArrowLeft />
          </button>
          <button
            onClick={() => swiperRef.current?.slideNext()}
            className="p-3 bg-[#0064AE] text-white rounded-full cursor-pointer hover:bg-[#015494] shadow-lg active:scale-95"
          >
            <FaArrowRight />
          </button>
        </div>
      </div>

      {/* Slider Section */}
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
          1536: { slidesPerView: 6 },
        }}
        className="mySwiper px-4 md:px-0"
      >
        {ads.map((ad: any) => (
          <SwiperSlide key={ad.id} className="pb-5">
            <AdCard ad={ad} />
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
};

export default LatestAddHome;
