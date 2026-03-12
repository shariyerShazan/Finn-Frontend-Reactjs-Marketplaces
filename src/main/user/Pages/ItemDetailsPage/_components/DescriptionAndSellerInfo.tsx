/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useState } from "react";
import {
  Mail,
  Phone,
  MapPin,
  ChevronDown,
  ChevronUp,
  ShieldCheck,
  Verified,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const DescriptionAndSellerInfo = ({ ad }: any) => {
  const [isExpanded, setIsExpanded] = useState(false);

  // API ডাটা এক্সট্রাক্ট করা
  const seller = ad?.seller;
  // const sellerProfile = (seller as any)?.sellerProfile;
console.log(seller);
  return (
    <div className="space-y-12">
      {/* 📝 Description Section */}
      <div className="relative group">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <span className="w-2 h-8 bg-[#0064AE] rounded-full inline-block"></span>
            Description
          </h3>
          <Badge
            variant="outline"
            className="text-[#0064AE] border-[#0064AE]/20 bg-[#0064AE]/5"
          >
            Updated {new Date(ad.updatedAt).toLocaleDateString()}
          </Badge>
        </div>

        <div
          className={`relative transition-all duration-500 overflow-hidden ${!isExpanded ? "max-h-24" : "max-h-fit"}`}
        >
          <p className="text-[15px] text-slate-600 leading-relaxed text-justify italic font-light whitespace-pre-line">
            {ad.description}
          </p>
          {!isExpanded && (
            <div className="absolute bottom-0 left-0 w-full h-12 bg-gradient-to-t from-white to-transparent" />
          )}
        </div>

        <Button
          variant="ghost"
          onClick={() => setIsExpanded(!isExpanded)}
          className="mt-4 text-[#0064AE] p-0 h-auto font-bold flex items-center gap-1"
        >
          {isExpanded ? (
            <>
              Show Less <ChevronUp size={18} />
            </>
          ) : (
            <>
              Read Full Description <ChevronDown size={18} />
            </>
          )}
        </Button>
      </div>

      {/* 👤 Seller Info Section */}
      <div className="space-y-6">
        <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
          <span className="w-2 h-8 bg-amber-500 rounded-full inline-block"></span>
          Seller Information
        </h3>

        <div className="relative overflow-hidden rounded-[2rem] bg-white border border-slate-100 shadow-2xl shadow-slate-200/50">
          <div className="relative p-8 grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            {/* Col 1: Name & Location */}
            <div className="lg:col-span-1 space-y-4">
              <div className="flex items-center gap-2">
                <div className="w-12 h-12 bg-[#0064AE] rounded-xl flex items-center justify-center text-white">
                  <Verified size={24} />
                </div>
                <div>
                  <h4 className="text-lg font-black text-slate-800 uppercase tracking-tighter">
                    {seller?.nickName || "Private Seller"}
                  </h4>
                  <p className="text-[10px] font-bold text-green-600 flex items-center gap-1 uppercase">
                    <ShieldCheck size={12} /> Verified Seller
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 text-sm text-slate-500">
                <MapPin size={18} className="text-[#0064AE] shrink-0 mt-0.5" />
                <span className="font-medium">
                  {ad.city === "Private"
                    ? "Location Hidden"
                    : `${ad.city}, ${ad.state} ${ad.zipCode}`}
                </span>
              </div>
            </div>

            {/* Col 2: Contacts (Sensitive Data Handling) */}
            <div className="lg:col-span-1 grid grid-cols-1 gap-3 border-slate-100 lg:border-x lg:px-8">
              <a
                href={`tel:${seller?.phone}`}
                className={`flex items-center gap-4 p-3 rounded-2xl bg-slate-50 transition-all ${seller?.phone === "Private" ? "pointer-events-none opacity-60" : "hover:bg-[#0064AE] hover:text-white group"}`}
              >
                <Phone
                  size={20}
                  className="text-[#0064AE] group-hover:text-white"
                />
                <span className="text-sm font-bold tracking-wider">
                  {seller?.phone}
                </span>
              </a>

              <a
                href={`mailto:${seller?.email}`}
                className={`flex items-center gap-4 p-3 rounded-2xl bg-slate-50 transition-all ${seller?.email === "Private" ? "pointer-events-none opacity-60" : "hover:bg-[#0064AE] hover:text-white group"}`}
              >
                <Mail
                  size={20}
                  className="text-[#0064AE] group-hover:text-white"
                />
                <span className="text-sm font-medium">{seller?.email}</span>
              </a>
            </div>

            {/* Col 3: Business/Seller Badge (Static or from Profile) */}
            <div className="lg:col-span-2">
              <div className="bg-slate-900 text-white p-6 rounded-3xl shadow-xl transform lg:rotate-2">
                <h5 className="text-[10px] font-bold text-slate-400 uppercase mb-4 flex items-center gap-2">
                  Safety First
                </h5>
                <p className="text-[11px] text-slate-300 leading-relaxed">
                  Always meet in public places and inspect the item thoroughly
                  before making any payment.
                </p>
                <Badge className="mt-4 bg-[#0064AE]">
                  Member Since {new Date().getFullYear()}
                </Badge>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DescriptionAndSellerInfo;
