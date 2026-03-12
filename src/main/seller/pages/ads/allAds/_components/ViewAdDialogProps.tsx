/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  MapPin,
  Calendar,
  Layers,
//   Info,
  CheckCircle2,
  XCircle,
  Settings2,
  Phone,
  Mail,
  Edit,
  Eye,
  GanttChartSquare,
} from "lucide-react";

interface ViewAdDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  ad: any;
  onEdit: (id: string) => void;
}

const ViewAdDialog = ({
  isOpen,
  onOpenChange,
  ad,
  onEdit,
}: ViewAdDialogProps) => {
  const [activeImgIndex, setActiveImgIndex] = useState(0);

  // Reset image index when dialog opens with a new ad
  useEffect(() => {
    setActiveImgIndex(0);
  }, [ad?.id]);

  if (!ad) return null;

  const images =
    ad.images?.length > 0
      ? ad.images
      : [
          {
            url: "https://images.unsplash.com/photo-1583121274602-3e2820c69888?q=80&w=1000&auto=format&fit=crop",
          },
        ];

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl p-0 overflow-hidden bg-white rounded-[2rem] border-none shadow-2xl">
        {/* Header section with glassmorphism feel */}
        <DialogHeader className="p-8 pb-4 bg-gradient-to-b from-slate-50/50 to-white">
          <div className="flex flex-col md:flex-row justify-between items-start gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Badge className="bg-blue-50 text-blue-600 hover:bg-blue-50 border-none px-3 py-1 rounded-lg font-bold uppercase tracking-tighter text-[10px]">
                  {ad.propertyFor}
                </Badge>
                <span className="text-slate-300">|</span>
                <span className="font-mono text-slate-400 text-xs tracking-tight">
                  REF: {ad.id.slice(-8).toUpperCase()}
                </span>
              </div>
              <DialogTitle className="text-3xl font-black text-slate-900 leading-none">
                {ad.title}
              </DialogTitle>
              <div className="flex items-center gap-4 text-slate-500 text-sm font-medium">
                <span className="flex items-center gap-1.5">
                  <Calendar size={15} className="text-slate-400" />
                  {new Date(ad.createdAt).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </span>
                <span className="flex items-center gap-1.5 text-blue-500 bg-blue-50/50 px-2 py-0.5 rounded-md">
                  <Eye size={15} /> {ad.viewerIds?.length || 0} Views
                </span>
              </div>
            </div>
            <Badge
              className={`text-sm px-6 py-2 rounded-2xl shadow-sm border-none ${
                ad.isSold
                  ? "bg-orange-500 text-white"
                  : "bg-emerald-500 text-white"
              }`}
            >
              {ad.isSold ? "Sold Out" : "Active Listing"}
            </Badge>
          </div>
        </DialogHeader>

        {/* Scrollable Content Area */}
        <div className="px-8 pb-8 max-h-[70vh] overflow-y-auto custom-scrollbar">
          <div className="grid grid-cols-1  ">
            {/* Left Column: Media & Specs */}
            <div className="lg:col-span-7 space-y-8">
              {/* Image Gallery Container */}
              <div className="space-y-3">
                <div className="relative aspect-[16/10] bg-slate-100 rounded-[1.5rem] overflow-hidden border border-slate-100 shadow-inner group">
                  <img
                    src={images[activeImgIndex]?.url}
                    alt="Property"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute bottom-4 right-4 bg-black/50 backdrop-blur-md text-white px-3 py-1 rounded-full text-xs font-bold">
                    {activeImgIndex + 1} / {images.length}
                  </div>
                </div>

                {/* Thumbnails */}
                {images.length > 1 && (
                  <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
                    {images.map((img: any, idx: number) => (
                      <button
                        key={idx}
                        onClick={() => setActiveImgIndex(idx)}
                        className={`relative flex-shrink-0 w-20 h-16 rounded-xl overflow-hidden border-2 transition-all ${
                          activeImgIndex === idx
                            ? "border-blue-500 scale-95 shadow-md"
                            : "border-transparent opacity-60 hover:opacity-100"
                        }`}
                      >
                        <img
                          src={img.url}
                          className="w-full h-full object-cover"
                          alt="thumb"
                        />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Description Section */}
              <div className="space-y-4">
                <h4 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <GanttChartSquare size={20} className="text-blue-600" />
                  Description
                </h4>
                <div className="prose prose-slate max-w-none">
                  <p className="text-slate-600 text-sm leading-relaxed whitespace-pre-line bg-slate-50/50 p-5 rounded-2xl border border-dashed border-slate-200">
                    {ad.description ||
                      "No detailed description provided for this listing."}
                  </p>
                </div>
              </div>

              {/* Specifications Card */}
              {ad.specifications && (
                <div className="space-y-4">
                  <h4 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                    <Settings2 size={20} className="text-blue-600" />
                    Key Specifications
                  </h4>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {Object.entries(ad.specifications).map(
                      ([key, value]: [string, any]) => (
                        <div
                          key={key}
                          className="p-3 bg-white border border-slate-100 rounded-2xl shadow-sm hover:shadow-md transition-shadow"
                        >
                          <p className="text-[10px] text-slate-400 uppercase font-black tracking-wider mb-1">
                            {key}
                          </p>
                          <p className="text-sm text-slate-800 font-bold truncate">
                            {value}
                          </p>
                        </div>
                      ),
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Right Column: Pricing, Location & Meta */}
            <div className="lg:col-span-5 space-y-6">
              {/* Pricing Card */}
              <div className="bg-slate-900 rounded-[2rem] mt-4 p-8 text-white relative overflow-hidden group">
                <div className="absolute -right-4 -top-4 w-24 h-24 bg-blue-600/20 rounded-full blur-3xl group-hover:bg-blue-600/40 transition-all"></div>
                <p className="text-slate-400 text-xs font-bold uppercase tracking-[0.2em] mb-2">
                  Price Value
                </p>
                <div className="flex items-baseline gap-2">
                  <span className="text-5xl font-black text-blue-400">
                    ${ad.price?.toLocaleString()}
                  </span>
                  <span className="text-slate-500 text-sm font-medium">
                    {ad.type}
                  </span>
                </div>
                <div className="mt-8 pt-6 border-t border-slate-800 grid grid-cols-2 gap-4 text-center">
                  <div className="bg-slate-800/50 p-3 rounded-2xl">
                    <p className="text-slate-500 text-[10px] font-bold uppercase">
                      Bids Count
                    </p>
                    <p className="text-xl font-black">{ad._count?.bids || 0}</p>
                  </div>
                  <div className="bg-slate-800/50 p-3 rounded-2xl">
                    <p className="text-slate-500 text-[10px] font-bold uppercase">
                      Type
                    </p>
                    <p className="text-sm font-black text-blue-400">
                      {ad.propertyFor}
                    </p>
                  </div>
                </div>
              </div>

              {/* Location Details */}
              <div className="bg-slate-50 rounded-[2rem] p-6 border border-slate-100 space-y-5">
                <h4 className="font-bold text-slate-900 flex items-center gap-2">
                  <MapPin size={18} className="text-red-500" /> Location Context
                </h4>
                <div className="space-y-3">
                  {[
                    { label: "City / Region", value: ad.city },
                    { label: "State / Province", value: ad.state },
                    { label: "Zip Code", value: ad.zipCode },
                  ].map((loc, i) => (
                    <div
                      key={i}
                      className="flex justify-between items-center text-sm"
                    >
                      <span className="text-slate-400 font-medium">
                        {loc.label}
                      </span>
                      <span className="font-bold text-slate-700">
                        {loc.value}
                      </span>
                    </div>
                  ))}
                </div>
                {ad.showAddress && (
                  <div className="bg-emerald-50 text-emerald-700 p-4 rounded-2xl text-xs flex items-start gap-3 border border-emerald-100">
                    <CheckCircle2 size={16} className="mt-0.5 shrink-0" />
                    <p className="font-medium leading-tight">
                      Property address is set to be fully visible on the public
                      listing page.
                    </p>
                  </div>
                )}
              </div>

              {/* Classification & Permissions */}
              <div className="bg-white rounded-[2rem] p-6 border border-slate-100 space-y-5 shadow-sm">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center shadow-inner">
                    <Layers size={24} />
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">
                      Category
                    </p>
                    <p className="font-bold text-slate-800">
                      {ad.category?.name || "General"}
                    </p>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-50">
                  <p className="text-[10px] text-slate-400 font-black uppercase mb-3">
                    Communication Channel
                  </p>
                  <div className="grid grid-cols-2 gap-3">
                    <PermissionBadge
                      active={ad.allowEmail}
                      icon={<Mail size={14} />}
                      label="Email"
                    />
                    <PermissionBadge
                      active={ad.allowPhone}
                      icon={<Phone size={14} />}
                      label="Phone"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Floating Action Footer */}
        <div className="p-8 bg-white border-t border-slate-50 flex flex-col sm:flex-row gap-4">
          <Button
            className="flex-[2] h-14 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-black text-lg shadow-xl shadow-blue-200 transition-all hover:-translate-y-1 active:scale-95"
            onClick={() => onEdit(ad.id)}
          >
            <Edit size={20} className="mr-2" /> Modify This Listing
          </Button>
          <Button
            variant="outline"
            className="flex-1 h-14 border-slate-200 hover:bg-slate-50 rounded-2xl font-bold text-slate-500 transition-all"
            onClick={() => onOpenChange(false)}
          >
            Close Details
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

// Sub-component for Permissions
const PermissionBadge = ({
  active,
  icon,
  label,
}: {
  active: boolean;
  icon: any;
  label: string;
}) => (
  <div
    className={`flex items-center gap-2 p-3 rounded-2xl border transition-all ${
      active
        ? "border-emerald-500/20 bg-emerald-50/50 text-emerald-700"
        : "border-slate-100 bg-slate-50 text-slate-400"
    }`}
  >
    {active ? icon : <XCircle size={14} />}
    <span className="text-xs font-bold">{label}</span>
  </div>
);

export default ViewAdDialog;
