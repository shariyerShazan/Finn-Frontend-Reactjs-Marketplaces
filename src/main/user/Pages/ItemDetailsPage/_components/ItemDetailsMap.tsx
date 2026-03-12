/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
// import React from "react";
import { MapPin, Navigation, Maximize2, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const ItemDetailsMap = ({ latitude, longitude, address, price }: any) => {
  const mapUrl = `https://www.google.com/maps?q=${latitude},${longitude}`;

  const embedUrl = `https://www.google.com/maps/embed/v1/view?key=YOUR_GOOGLE_MAPS_API_KEY&center=${latitude},${longitude}&zoom=14`;
console.log(embedUrl)
  const freeEmbedUrl = `https://maps.google.com/maps?q=${latitude},${longitude}&t=&z=14&ie=UTF8&iwloc=&output=embed`;

  return (
    <div className="space-y-4">
      {/* 📍 Header with Location info */}
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-[#0064AE]/10 rounded-md">
            <MapPin size={18} className="text-[#0064AE]" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-800">Item Location</h4>
            <p className="text-[11px] text-slate-500 font-medium truncate max-w-[180px]">
              {address || "Location not provided"}
            </p>
          </div>
        </div>
        <Badge
          variant="secondary"
          className="bg-green-50 text-green-700 border-green-100"
        >
          Verified Site
        </Badge>
      </div>

      {/* --- 🗺️ Map Container --- */}
      <div className="group relative border-4 border-white rounded-[2rem] overflow-hidden shadow-xl shadow-slate-200 aspect-square md:aspect-video lg:h-64 transition-all duration-500 hover:shadow-[#0064AE]/10 bg-slate-100 w-full">
        {/* Actual Google Map Embed */}
        <iframe
          width="100%"
          height="100%"
          style={{ border: 0 }}
          loading="lazy"
          allowFullScreen
          referrerPolicy="no-referrer-when-downgrade"
          src={freeEmbedUrl}
          className="absolute inset-0 grayscale-[20%] contrast-[1.1] group-hover:grayscale-0 transition-all duration-700"
        ></iframe>

        {/* 🏷️ Custom Price Marker Overlay */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
          <div className="relative flex flex-col items-center animate-bounce duration-[3s]">
            <div className="bg-[#0064AE] text-white px-4 py-2 rounded-2xl font-black text-sm shadow-[0_10px_20px_rgba(0,100,174,0.4)] flex items-center gap-2 border-2 border-white">
              ${price}
            </div>
            <div className="w-3 h-3 bg-[#0064AE] rotate-45 -mt-1.5 border-r-2 border-b-2 border-white"></div>
          </div>
        </div>

        {/* Floating Controls */}
        <div className="absolute top-4 right-4 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <Button
            size="icon"
            variant="secondary"
            className="rounded-xl shadow-md h-9 w-9 bg-white/90 backdrop-blur-md hover:bg-white"
            onClick={() => window.open(mapUrl, "_blank")}
          >
            <Maximize2 size={16} className="text-[#0064AE]" />
          </Button>
        </div>

        {/* 🚗 Bottom Floating Interaction Card */}
        <div className="absolute bottom-4 left-4 right-4 translate-y-2 group-hover:translate-y-0 transition-all duration-500 opacity-0 group-hover:opacity-100">
          <div className="bg-white/95 backdrop-blur-md p-3 rounded-[1.5rem] border border-white shadow-2xl flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#0064AE]/10 rounded-xl flex items-center justify-center">
                <Navigation size={20} className="text-[#0064AE]" />
              </div>
              <div className="hidden sm:block">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-1">
                  Get Directions
                </p>
                <p className="text-xs font-black text-slate-800 truncate max-w-[120px]">
                  View on Google Maps
                </p>
              </div>
            </div>
            <Button
              size="sm"
              className="bg-[#0064AE] hover:bg-[#004f8b] rounded-xl text-[11px] font-bold h-9 px-4 flex items-center gap-2 transition-transform active:scale-95"
              onClick={() => window.open(mapUrl, "_blank")}
            >
              Open Maps <ExternalLink size={14} />
            </Button>
          </div>
        </div>
      </div>

      <p className="text-[10px] text-center text-slate-400 font-medium italic">
        * Location is approximate to protect seller privacy until booking
      </p>
    </div>
  );
};

export default ItemDetailsMap;
