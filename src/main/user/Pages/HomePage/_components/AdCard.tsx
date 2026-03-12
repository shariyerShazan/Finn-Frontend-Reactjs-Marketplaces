/* eslint-disable @typescript-eslint/no-explicit-any */
// import React from "react";
import { Heart, MapPin } from "lucide-react";
import { useNavigate } from "react-router-dom";

// Functional Component with Prisma Props
const AdCard = ({ ad }: { ad: any }) => {
  const displayPrice = ad.price || ad.basePrice || ad.releasePrice || 0;
  const navigate = useNavigate()

  return (
    <div
      onClick={() => navigate(`/item-details/${ad.id}`)}
      className=" transition-all duration-300 group cursor-pointer overflow-hidden"
    >
      {/* Image Section */}
      <div className="relative h-56 ">
        <div className="overflow-hidden h-56 rounded-3xl">
          <img
            src={
              ad.images[0]?.url ||
              "https://via.placeholder.com/400x300?text=No+Image"
            }
            alt={ad.title}
            className="w-full h-full object-cover group-hover:scale-110 transition duration-500  hover:opacity-90"
          />
        </div>

        {/* Heart Icon */}
        <button className="absolute top-4 right-4 p-2 bg-white/20 hover:bg-white/40 backdrop-blur-md rounded-full text-white transition">
          <Heart size={20} />
        </button>

        {/* Price Badge - Custom Styled Blue */}
        <div className="absolute -bottom-5 left-1/2 -translate-x-1/2 z-10">
          <div className="bg-[#0064AE] text-white px-8 py-2 rounded-full text-sm font-bold border-2 border-white shadow-md whitespace-nowrap">
            Price: ${displayPrice.toLocaleString()}
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="pt-6 pb-5  text-">
        <h3 className="text-lg font-bold text-gray-800 line-clamp-1 mb-1">
          {ad.title}
        </h3>
        <div className="flex items-center  text-gray-600 text-xs">
          <MapPin size={14} className="mr-1" />
          <span>
            {ad.city}, {ad.state} {ad.zipCode}
          </span>
        </div>
      </div>
    </div>
  );
};

export default AdCard;
