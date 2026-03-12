/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Calendar, ShoppingBag, Download, Hash } from "lucide-react";
import moment from "moment";
import { useState, useEffect } from "react";
import { generatePurchaseInvoice } from "./generatePurchaseInvoice";

const PurchaseDetailsDialog = ({ open, onOpenChange, data }: any) => {
  const [activeImage, setActiveImage] = useState<string>("");

  useEffect(() => {
    if (data?.ad?.images?.length > 0) {
      setActiveImage(data.ad.images[0].url);
    }
  }, [data, open]);

  if (!data) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md p-0 overflow-hidden border-none bg-white rounded-[32px] shadow-2xl">
        <div className="p-8 space-y-6">
          {/* Top Status Bar */}
          <div className="flex justify-between items-center">
            <div className="bg-blue-50 text-[#0064AE] p-3 rounded-2xl">
              <ShoppingBag size={24} />
            </div>
            <Badge className="bg-emerald-500 hover:bg-emerald-600 text-white border-none uppercase text-[10px] tracking-widest px-3 py-1 rounded-full font-bold">
              {data.status}
            </Badge>
          </div>

          <DialogHeader className="p-0 text-left">
            <DialogTitle className="text-2xl font-black text-slate-800 tracking-tight">
              Purchase Details
            </DialogTitle>
            <div className="flex items-center gap-2 text-xs text-slate-400 font-bold mt-1">
              <Hash size={14} />
              <span>ID: {data.stripeId.substring(0, 16).toUpperCase()}</span>
            </div>
          </DialogHeader>

          {/* Image Gallery Section */}
          <div className="space-y-3">
            <div className="relative group aspect-video w-full overflow-hidden rounded-3xl border-4 border-white shadow-lg bg-slate-100">
              <img
                src={activeImage}
                className="w-full h-full object-cover transition-all duration-500 group-hover:scale-105"
                alt="Main View"
              />
            </div>

            {/* Thumbnails */}
            {data.ad?.images?.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                {data.ad.images.map((img: any, idx: number) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImage(img.url)}
                    className={`relative flex-shrink-0 w-14 h-14 rounded-xl overflow-hidden border-2 transition-all ${
                      activeImage === img.url
                        ? "border-[#0064AE] scale-95 shadow-md"
                        : "border-transparent opacity-60 hover:opacity-100"
                    }`}
                  >
                    <img
                      src={img.url}
                      className="w-full h-full object-cover"
                      alt={`thumb-${idx}`}
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Ad Title & Date */}
          <div className="space-y-1">
            <h4 className="text-lg font-black text-slate-700 leading-tight">
              {data.ad?.title}
            </h4>
            <div className="flex items-center gap-2 text-slate-400">
              <Calendar size={14} />
              <span className="text-xs font-bold uppercase tracking-wider">
                {moment(data.createdAt).format("DD MMMM YYYY")}
              </span>
            </div>
          </div>

          {/* Pricing Card */}
          <div className="space-y-4">
            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 space-y-2">
              <div className="flex justify-between text-[10px] font-black text-slate-400 uppercase tracking-widest">
                <span>Unit Price</span>
                <span className="text-slate-600">
                  ${data.totalAmount.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between text-[10px] font-black text-slate-400 uppercase tracking-widest">
                <span>Platform Charges</span>
                <span className="text-slate-600">$0.00</span>
              </div>
              <Separator className="bg-slate-200/50 my-2" />
              <div className="flex justify-between items-center">
                <span className="text-xs font-black text-[#0064AE] uppercase tracking-widest">
                  Grand Total
                </span>
                <span className="text-2xl font-black text-slate-800">
                  ${data.totalAmount.toFixed(2)}
                </span>
              </div>
            </div>
          </div>

          {/* Action Button */}
          <button
            onClick={() => generatePurchaseInvoice(data)}
            className="w-full py-4 bg-[#0064AE] text-white rounded-2xl flex items-center justify-center gap-3 font-bold hover:bg-blue-700 transition-all active:scale-[0.98] shadow-xl shadow-blue-200"
          >
            <Download size={20} />
            Download PDF Receipt
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PurchaseDetailsDialog;
