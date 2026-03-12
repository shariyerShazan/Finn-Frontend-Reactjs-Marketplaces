// // /* eslint-disable @typescript-eslint/no-explicit-any */
// // "use client";
// // import { useState } from "react";
// // import { useNavigate } from "react-router";
// // import { Search, Loader2, LayoutGrid } from "lucide-react";
// // import bgImg from "@/assets/bg.jpg";
// // import { useGetAllCategoriesQuery } from "@/redux/fetures/admin/admin-category.api";

// // const SearchAndCategory = () => {
// //   const navigate = useNavigate();
// //   const [searchTerm, setSearchTerm] = useState("");

// //   // ১. Backend থেকে ক্যাটাগরি ডাটা ফেচ করা (RTK Query)
// //   const { data: categoriesData, isLoading } = useGetAllCategoriesQuery({
// //     page: 1,
// //     limit: 12, // আপনি যতগুলো আইকন হোমে দেখাতে চান
// //   });

// //   const categories = categoriesData?.data || [];

// //   const handleSearch = () => {
// //     if (searchTerm.trim()) {
// //       navigate(`/search?search=${encodeURIComponent(searchTerm)}`);
// //     } else {
// //       navigate("/search");
// //     }
// //   };

// //   const handleCategoryClick = (slug: string) => {
// //     navigate(`/search?search=${encodeURIComponent(slug)}`);
// //   };

// //   return (
// //     <div
// //       className="w-full relative pt-4 pb-6 bg-white overflow-hidden"
// //       style={{
// //         backgroundImage: `url(${bgImg})`,
// //         backgroundPosition: "bottom center",
// //         backgroundRepeat: "no-repeat",
// //         backgroundSize: "100% auto",
// //       }}
// //     >
// //       <div className="max-w-6xl mx-auto px-4 text-center relative z-10">
// //         <h1 className="text-3xl font-bold text-[#0064AE] mb-10">
// //           Your Trusted Local Marketplace for Free Classified Ads
// //         </h1>

// //         {/* --- Search Bar --- */}
// //         <div className="flex flex-col md:flex-row items-center justify-center max-w-3xl mx-auto border rounded-xl shadow-lg bg-white overflow-hidden mb-12">
// //           <div className="flex items-center flex-1 px-4 py-3">
// //             <Search className="text-gray-400 mr-2" size={20} />
// //             <input
// //               type="text"
// //               placeholder="Search anything you need"
// //               className="w-full outline-none text-gray-600 font-medium"
// //               value={searchTerm}
// //               onChange={(e) => setSearchTerm(e.target.value)}
// //               onKeyDown={(e) => e.key === "Enter" && handleSearch()}
// //             />
// //           </div>
// //           <button
// //             onClick={handleSearch}
// //             className="bg-[#0064AE] hover:bg-[#004f8b] text-white px-10 py-4 font-bold transition-all active:scale-95 cursor-pointer"
// //           >
// //             Search
// //           </button>
// //         </div>

// //         {/* --- Dynamic Categories Section --- */}
// //         <div className="flex flex-wrap justify-center gap-8 md:gap-12 pt-4">
// //           {isLoading ? (
// //             <div className="flex items-center gap-2 text-slate-400">
// //               <Loader2 className="animate-spin" size={20} />
// //               <span className="text-sm font-medium">Loading Categories...</span>
// //             </div>
// //           ) : (
// //             categories.map((cat: any) => (
// //               <div
// //                 key={cat.id}
// //                 onClick={() => handleCategoryClick(cat.slug)}
// //                 className="flex flex-col items-center gap-2 cursor-pointer group"
// //               >
// //                 <div className="w-14 h-14 flex items-center justify-center border border-gray-100 rounded-2xl bg-white shadow-sm group-hover:bg-blue-50 group-hover:shadow-md transition-all overflow-hidden p-2">
// //                   {cat.image ? (
// //                     // ব্যাকেন্ড থেকে আসা ইমেজ
// //                     <img
// //                       src={cat.image}
// //                       alt={cat.name}
// //                       className="w-full h-full object-contain group-hover:scale-110 transition-transform"
// //                     />
// //                   ) : (
// //                     // ইমেজ না থাকলে ডামি আইকন
// //                     <LayoutGrid
// //                       size={24}
// //                       className="text-gray-400 group-hover:text-[#0064AE]"
// //                     />
// //                   )}
// //                 </div>
// //                 <span className="text-sm font-semibold text-gray-600 group-hover:text-[#0064AE]">
// //                   {cat.name}
// //                 </span>
// //               </div>
// //             ))
// //           )}
// //         </div>
// //       </div>
// //     </div>
// //   );
// // };

// // export default SearchAndCategory;


// /* eslint-disable @typescript-eslint/no-explicit-any */
// "use client";
// import { useState } from "react";
// import { useNavigate } from "react-router";
// import { Search, Loader2, LayoutGrid } from "lucide-react";
// import bgImg from "@/assets/bg.jpg";
// import { useGetAllCategoriesQuery } from "@/redux/fetures/admin/admin-category.api";

// // --- Swiper Imports ---
// import { Swiper, SwiperSlide } from "swiper/react";
// import { Navigation, Pagination, Autoplay } from "swiper/modules";
// import "swiper/css";
// import "swiper/css/navigation";
// import "swiper/css/pagination";

// const SearchAndCategory = () => {
//   const navigate = useNavigate();
//   const [searchTerm, setSearchTerm] = useState("");

//   const { data: categoriesData, isLoading } = useGetAllCategoriesQuery({
//     page: 1,
//     limit: 20, // Slider-er jonno limit ektu bariye dilam
//   });

//   const categories = categoriesData?.data || [];

//   const handleSearch = () => {
//     if (searchTerm.trim()) {
//       navigate(`/search?search=${encodeURIComponent(searchTerm)}`);
//     } else {
//       navigate("/search");
//     }
//   };

//   const handleCategoryClick = (slug: string) => {
//     navigate(`/search?search=${encodeURIComponent(slug)}`);
//   };

//   return (
//     <div
//       className="w-full relative pt-4 pb-6 bg-white overflow-hidden"
//       style={{
//         backgroundImage: `url(${bgImg})`,
//         backgroundPosition: "bottom center",
//         backgroundRepeat: "no-repeat",
//         backgroundSize: "100% auto",
//       }}
//     >
//       <div className="max-w-6xl mx-auto px-4 text-center relative z-10">
//         <h1 className="text-3xl font-bold text-[#0064AE] mb-10">
//           Your Trusted Local Marketplace for Free Classified Ads
//         </h1>

//         {/* --- Search Bar --- */}
//         <div className="flex flex-col md:flex-row items-center justify-center max-w-3xl mx-auto border rounded-xl shadow-lg bg-white overflow-hidden mb-12">
//           <div className="flex items-center flex-1 px-4 py-3">
//             <Search className="text-gray-400 mr-2" size={20} />
//             <input
//               type="text"
//               placeholder="Search anything you need"
//               className="w-full outline-none text-gray-600 font-medium"
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//               onKeyDown={(e) => e.key === "Enter" && handleSearch()}
//             />
//           </div>
//           <button
//             onClick={handleSearch}
//             className="bg-[#0064AE] hover:bg-[#004f8b] text-white px-10 py-4 font-bold transition-all active:scale-95 cursor-pointer"
//           >
//             Search
//           </button>
//         </div>

//         {/* --- Dynamic Categories Slider Section --- */}
//         <div className="w-full pt-4">
//           {isLoading ? (
//             <div className="flex justify-center items-center gap-2 text-slate-400 py-10">
//               <Loader2 className="animate-spin" size={20} />
//               <span className="text-sm font-medium">Loading Categories...</span>
//             </div>
//           ) : (
//             <Swiper
//               modules={[Navigation, Pagination, Autoplay]}
//               spaceBetween={20}
//               navigation={true}
//               autoplay={{ delay: 3000, disableOnInteraction: false }}
//               breakpoints={{
//                 // Mobile: 3 slides
//                 320: { slidesPerView: 3, spaceBetween: 10 },
//                 // Tablet: 4 slides
//                 768: { slidesPerView: 4, spaceBetween: 15 },
//                 // Desktop: 6 slides
//                 1024: { slidesPerView: 6, spaceBetween: 20 },
//               }}
//               className="category-swiper !pb-10"
//             >
//               {categories.map((cat: any) => (
//                 <SwiperSlide key={cat.id}>
//                   <div
//                     onClick={() => handleCategoryClick(cat.slug)}
//                     className="flex flex-col items-center gap-2 cursor-pointer group"
//                   >
//                     <div className="w-14 h-14 flex items-center justify-center border border-gray-100 rounded-2xl bg-white shadow-sm group-hover:bg-blue-50 group-hover:shadow-md transition-all overflow-hidden p-2 mx-auto">
//                       {cat.image ? (
//                         <img
//                           src={cat.image}
//                           alt={cat.name}
//                           className="w-full h-full object-contain group-hover:scale-110 transition-transform"
//                         />
//                       ) : (
//                         <LayoutGrid
//                           size={24}
//                           className="text-gray-400 group-hover:text-[#0064AE]"
//                         />
//                       )}
//                     </div>
//                     <span className="text-[11px] md:text-sm font-semibold text-gray-600 group-hover:text-[#0064AE] truncate w-full px-1">
//                       {cat.name}
//                     </span>
//                   </div>
//                 </SwiperSlide>
//               ))}
//             </Swiper>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default SearchAndCategory;

/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useState } from "react";
import { useNavigate } from "react-router";
import { Search, Loader2, LayoutGrid } from "lucide-react";
import bgImg from "@/assets/bg.jpg";
import { useGetAllCategoriesQuery } from "@/redux/fetures/admin/admin-category.api";

// --- Swiper Imports ---
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";

const SearchAndCategory = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");

  const { data: categoriesData, isLoading } = useGetAllCategoriesQuery({
    page: 1,
    limit: 20,
  });

  const categories = categoriesData?.data || [];

  const handleSearch = () => {
    if (searchTerm.trim()) {
      navigate(`/search?search=${encodeURIComponent(searchTerm)}`);
    } else {
      navigate("/search");
    }
  };

  const handleCategoryClick = (slug: string) => {
    navigate(`/search?search=${encodeURIComponent(slug)}`);
  };

  return (
    <div
      className="w-full relative pt-4 pb-6 bg-white overflow-hidden"
      style={{
        backgroundImage: `url(${bgImg})`,
        backgroundPosition: "bottom center",
        backgroundRepeat: "no-repeat",
        backgroundSize: "100% auto",
      }}
    >
      {/* --- Custom CSS for Small Navigation Buttons --- */}
      <style>{`
        .category-swiper .swiper-button-next,
        .category-swiper .swiper-button-prev {
          width: 14px !important;
          height: 14px !important;
          background: white;
          border-radius: 50%;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
          border: 1px solid #f1f5f9;
        }
        .category-swiper .swiper-button-next:after,
        .category-swiper .swiper-button-prev:after {
          font-size: 12px !important;
          font-weight: bold;
          color: #64748b;
        }
        .category-swiper .swiper-button-disabled {
          display: none;
        }
      `}</style>

      <div className="max-w-6xl mx-auto px-4 text-center relative z-10">
        <h1 className="text-2xl md:text-3xl font-bold text-[#0064AE] mb-8">
          Your Trusted Local Marketplace
        </h1>

        {/* --- Search Bar --- */}
        <div className="flex flex-col md:flex-row items-center justify-center max-w-2xl mx-auto border border-slate-200 rounded-xl shadow-md bg-white overflow-hidden mb-10">
          <div className="flex items-center flex-1 px-4 py-2.5">
            <Search className="text-slate-400 mr-2" size={18} />
            <input
              type="text"
              placeholder="Search anything..."
              className="w-full outline-none text-sm text-slate-600 font-medium"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            />
          </div>
          <button
            onClick={handleSearch}
            className="bg-[#0064AE] hover:bg-[#004f8b] text-white px-8 py-3 text-sm font-bold transition-all active:scale-95"
          >
            Search
          </button>
        </div>

        {/* --- Minimal Categories Slider --- */}
        <div className="w-full px-6">
          {isLoading ? (
            <div className="flex justify-center items-center py-10 text-slate-400">
              <Loader2 className="animate-spin" size={20} />
            </div>
          ) : (
            <Swiper
              modules={[Navigation, Autoplay]}
              spaceBetween={12}
              navigation={true}
              autoplay={{ delay: 4000, disableOnInteraction: false }}
              breakpoints={{
                320: { slidesPerView: 3 },
                640: { slidesPerView: 5 },
                1024: { slidesPerView: 8 }, // Aro beshi slide jate minimal lage
              }}
              className="category-swiper !py-4"
            >
              {categories.map((cat: any) => (
                <SwiperSlide key={cat.id}>
                  <div
                    onClick={() => handleCategoryClick(cat.slug)}
                    className="flex flex-col items-center gap-2 cursor-pointer group"
                  >
                    {/* Minimal Card Design */}
                    <div className="w-12 h-12 flex items-center justify-center rounded-xl bg-slate-50 border border-transparent group-hover:border-blue-100 group-hover:bg-blue-50 group-hover:shadow-sm transition-all duration-300 p-2.5">
                      {cat.image ? (
                        <img
                          src={cat.image}
                          alt={cat.name}
                          className="w-full h-full object-contain opacity-80 group-hover:opacity-100 transition-opacity"
                        />
                      ) : (
                        <LayoutGrid
                          size={20}
                          className="text-slate-400 group-hover:text-[#0064AE]"
                        />
                      )}
                    </div>
                    <span className="text-[10px] md:text-[12px] font-medium text-slate-500 group-hover:text-[#0064AE] truncate w-full text-center px-1">
                      {cat.name}
                    </span>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchAndCategory;