"use client";
import { useEffect } from "react";
import { useParams } from "react-router-dom";

// Components
import ItemDetailsImage from "./_components/ItemDetailsImage";
import ItemSpecification from "./_components/ItemSpecification";
import DescriptionAndSellerInfo from "./_components/DescriptionAndSellerInfo";
import ChatWithItemOwner from "./_components/ChatWithItemOwner";
import MoreItemOfSeller from "./_components/MoreItemOfSeller";
import ItemDetailsMap from "./_components/ItemDetailsMap";
import CommentSection from "./_components/CommentSection";

// UI Components
import {
  Share2,
  Flag,
  ShieldCheck,
  Zap,
  Loader2,
  Clock,
  LayoutGrid,
  Eye,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "react-toastify";

// Hooks
import {
  useGetAdByIdQuery,
  useRecordAdViewMutation,
} from "@/redux/fetures/ads.api";
import ReportAdModal from "./_components/ReportAdModal";

function ItemDetailsPage() {
  const { id } = useParams();

  // ১. অ্যাড ডাটা ফেচ করা
  const { data: response, isLoading, isError } = useGetAdByIdQuery(id as string);
  const [recordView] = useRecordAdViewMutation();

  const ad = response?.data;

  // ২. ইউনিক ভিউ রেকর্ড করা এবং স্ক্রল পজিশন রিসেট
  useEffect(() => {
    if (id) {
      recordView(id);
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [id, recordView]);

  // --- 🔗 Share/Copy URL Function ---
  const handleShare = () => {
    const currentUrl = window.location.href;
    navigator.clipboard.writeText(currentUrl);
    toast.success("Link copied to clipboard!");
  };

  if (isLoading) {
    return (
      <div className="h-screen flex flex-col items-center justify-center gap-4 bg-white">
        <Loader2 className="animate-spin text-[#0064AE]" size={48} />
        <p className="text-slate-500 font-medium animate-pulse">
          Loading amazing deals...
        </p>
      </div>
    );
  }

  if (isError || !ad) {
    return (
      <div className="h-screen flex flex-col items-center justify-center gap-6">
        <div className="bg-rose-50 p-6 rounded-full">
          <Flag className="text-rose-500" size={40} />
        </div>
        <div className="text-center">
          <h2 className="text-2xl font-black text-slate-900">
            Oops! Ad not found
          </h2>
          <p className="text-slate-500">
            The listing might have been removed or is no longer available.
          </p>
        </div>
        <Button
          onClick={() => window.history.back()}
          className="bg-[#0064AE] hover:bg-[#004f8b] rounded-full px-8 transition-all"
        >
          Go Back
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-20 bg-[#F8FAFC]">
      {/* 🔝 Floating Header Section */}
      <div className="bg-white/80 backdrop-blur-md border-b sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-3">
              <Badge className="bg-[#0064AE] hover:bg-[#0064AE] uppercase text-[10px] px-2 py-0.5 tracking-wider">
                Verified Listing
              </Badge>
              <div className="flex items-center gap-3 text-[12px] text-slate-400 font-medium">
                <span className="flex items-center gap-1">
                  <Clock size={12} />
                  {new Date(ad.createdAt).toLocaleDateString()}
                </span>
                <span className="flex items-center gap-1 bg-slate-100 px-2 py-0.5 rounded text-[#0064AE]">
                  <Eye size={12} />
                  {ad.viewerIds?.length || 0} Views
                </span>
              </div>
            </div>
            <h1 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-3">
              {ad.title}
              <span className="text-[#0064AE] font-extrabold">
                — ${ad.price?.toLocaleString()}
              </span>
            </h1>
          </div>

          <div className="flex items-center gap-2">
            <Button
              onClick={handleShare}
              variant="outline"
              size="sm"
              className="rounded-full gap-2 border-slate-200 hover:bg-[#0064AE] hover:text-white transition-all active:scale-90"
            >
              <Share2 size={16} /> Share
            </Button>
            <ReportAdModal adId={ad.id} adTitle={ad.title} />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* 🛡️ LEFT COLUMN: Main Content */}
          <div className="lg:col-span-8 space-y-10">
            {/* Image Gallery */}
            <section className="bg-white rounded-[2.5rem] p-3 shadow-xl shadow-slate-200/40 border border-white">
              <ItemDetailsImage images={ad.images} />
            </section>

            {/* Product Details Sections */}
            <div className="space-y-12">
              <ItemSpecification specifications={ad.specifications} />

              <div className="h-[1px] bg-gradient-to-r from-transparent via-slate-200 to-transparent" />

              <DescriptionAndSellerInfo ad={ad} />

              <div className="h-[1px] bg-gradient-to-r from-transparent via-slate-200 to-transparent" />

              {/* Public Interaction: Comments */}
              <CommentSection adId={ad.id} />
            </div>
          </div>

          {/* ⚡ RIGHT COLUMN: Sticky Sidebar */}
          <div className="lg:col-span-4 space-y-8 h-fit lg:sticky lg:top-28">
            {/* Interactive Map */}
            <ItemDetailsMap
              latitude={ad.latitude}
              longitude={ad.longitude}
              address={`${ad.city}, ${ad.state}`}
              price={ad.price}
            />

            {/* Direct Communication Section */}
            <div className="space-y-4">
              <div className="flex items-center justify-between px-2">
                <h3 className="font-bold text-slate-800 flex items-center gap-2">
                  <Zap size={18} className="text-amber-500 fill-amber-500" />
                  Instant Communication
                </h3>
                <span className="text-[10px] text-green-500 animate-pulse font-black uppercase tracking-widest">
                  Online Now
                </span>
              </div>
              <ChatWithItemOwner
                sellerId={ad.sellerId}
                sellerName={ad.seller?.nickName}
              />
            </div>

            {/* Safety & Trust Card */}
            <div className="p-6 bg-gradient-to-br from-green-50 to-emerald-50 rounded-[2rem] border border-green-100 shadow-sm relative overflow-hidden group">
              <div className="absolute -right-4 -top-4 text-green-100/60 transform rotate-12 group-hover:scale-110 transition-transform duration-500">
                <ShieldCheck size={140} />
              </div>
              <div className="relative z-10 flex flex-col gap-4">
                <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-green-600 shadow-sm">
                  <ShieldCheck size={28} />
                </div>
                <h4 className="font-bold text-green-900">Safety Guidelines</h4>
                <div className="space-y-2">
                  <p className="text-[12px] text-green-800/80 leading-relaxed font-medium flex gap-2">
                    <span className="text-green-500 font-bold">1.</span> Always
                    meet in a safe, public location.
                  </p>
                  <p className="text-[12px] text-green-800/80 leading-relaxed font-medium flex gap-2">
                    <span className="text-green-500 font-bold">2.</span>{" "}
                    Thoroughly inspect the item before buying.
                  </p>
                  <p className="text-[12px] text-green-800/80 leading-relaxed font-medium flex gap-2">
                    <span className="text-green-500 font-bold">3.</span> Never
                    send money before seeing the item.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 🚀 Footer Section: More items from same seller */}
        <div className="mt-20 pt-16 border-t border-slate-200">
          <div className="mb-10 flex flex-col gap-2">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#0064AE]/10 flex items-center justify-center text-[#0064AE]">
                <LayoutGrid size={22} />
              </div>
              <h2 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">
                More from{" "}
                <span className="text-[#0064AE]">
                  {ad.seller?.nickName || "this seller"}
                </span>
              </h2>
            </div>
            <p className="text-slate-500 text-sm ml-13 font-medium">
              Explore other amazing deals listed by this verified seller.
            </p>
          </div>

          <MoreItemOfSeller sellerId={ad.sellerId} currentAdId={ad.id} />
        </div>
      </div>
    </div>
  );
}

export default ItemDetailsPage;
