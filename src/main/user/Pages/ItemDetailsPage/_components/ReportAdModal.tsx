/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useState } from "react";
import { toast } from "react-toastify";
import { Loader2, AlertTriangle, ShieldAlert } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useReportAdMutation } from "@/redux/fetures/admin/report.api";

const ReportAdModal = ({
  adId,
  adTitle,
}: {
  adId: string;
  adTitle: string;
}) => {
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState("");
  const [description, setDescription] = useState("");
  const [reportAd, { isLoading }] = useReportAdMutation();

  const reasons = [
    { label: "Fraud / Scam", value: "FRAUD" },
    { label: "Spam", value: "SPAM" },
    { label: "Inappropriate", value: "INAPPROPRIATE" },
    { label: "Misleading Info", value: "MISLEADING" },
    { label: "Other", value: "OTHER" },
  ];

  const handleReport = async () => {
    try {
      await reportAd({
        adId,
        data: { reason, description },
      }).unwrap();

      toast.success("Report submitted to our team!");
      setOpen(false);
      setReason("");
      setDescription("");
    } catch (err: any) {
      toast.error(err?.data?.message || "Something went wrong. Please login.");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="rounded-full gap-2 hover:text-red-700 cursor-pointer hover:bg-white text-red-500 border-red-500  transition-all font-bold group"
        >
          <AlertTriangle size={16} className="" />{" "}
          Report
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[425px] rounded-[2.5rem] p-8 border-none shadow-2xl bg-white">
        <DialogHeader className="space-y-3">
          <div className="w-14 h-14 bg-[#0064AE]/10 rounded-2xl flex items-center justify-center text-[#0064AE] mb-2">
            <ShieldAlert size={28} />
          </div>
          <DialogTitle className="text-2xl font-black text-slate-900 leading-tight tracking-tight">
            Report Listing
          </DialogTitle>
          <p className="text-[13px] text-slate-500 font-medium leading-relaxed">
            Help us protect the community. Tell us what is wrong with
            <span className="text-slate-900 font-bold ml-1">"{adTitle}"</span>.
          </p>
        </DialogHeader>

        <div className="space-y-6 mt-6">
          {/* Reason Selection */}
          <div className="space-y-3">
            <label className="text-[10px] font-black uppercase tracking-[0.1em] text-[#0064AE] ml-1">
              Select a Reason
            </label>
            <div className="grid grid-cols-2 gap-2">
              {reasons.map((r) => (
                <button
                  key={r.value}
                  type="button"
                  onClick={() => setReason(r.value)}
                  className={`text-[12px] font-bold py-3 px-4 rounded-xl border-2 border-slate-300 transition-all text-left relative overflow-hidden ${
                    reason === r.value
                      ? "bg-[#0064AE] border-[#0064AE] text-white shadow-lg shadow-[#0064AE]/20"
                      : "bg-slate-50  text-slate-600 hover:border-slate-400"
                  }`}
                >
                  {r.label}
                </button>
              ))}
            </div>
          </div>

          {/* Text Area */}
          <div className="space-y-3">
            <label className="text-[10px] font-black uppercase tracking-[0.1em] text-[#0064AE] ml-1">
              Description (Optional)
            </label>
            <textarea
              placeholder="Provide more details to help us investigate..."
              className="w-full min-h-[110px]  bg-slate-50 border-2 border-gray-300 rounded-[1.5rem] p-4 text-sm focus:bg-white focus:border-[#0064AE]/20 outline-none resize-none transition-all placeholder:text-slate-400 font-medium"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-2">
            <Button
              type="button"
              variant="ghost"
              onClick={() => setOpen(false)}
              className="flex-1 rounded-xl cursor-pointer font-bold text-slate-400 hover:bg-slate-100"
            >
              Cancel
            </Button>
            <Button
              onClick={handleReport}
              disabled={isLoading || !reason}
              className="flex-[2] h-12 cursor-pointer rounded-xl bg-[#0064AE] hover:bg-[#004f8b] text-white font-bold shadow-xl shadow-[#0064AE]/20 disabled:opacity-30 transition-all active:scale-95"
            >
              {isLoading ? (
                <Loader2 className="animate-spin" size={20} />
              ) : (
                "Submit Report"
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ReportAdModal;
