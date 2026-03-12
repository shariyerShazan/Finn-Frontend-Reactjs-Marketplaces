/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useState } from "react";
import {
  useResolveReportMutation,
  useSuspendAuthMutation,
} from "@/redux/fetures/admin/report.api";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import {
  Loader2,
  ShieldAlert,
  CheckCircle,
  Ban,
  User,
  Tag,
  AlertCircle,
  MapPin,
  Mail,
  Calendar,
  Phone,
  Store,
  ExternalLink,
} from "lucide-react";
import { toast } from "react-toastify";

interface ReportActionDialogProps {
  isOpen: boolean;
  onClose: () => void;
  report: any; // backend response data (getReportById)
  isLoading?: boolean; // API fetching state from parent
}

const ReportActionDialog = ({
  isOpen,
  onClose,
  report,
  isLoading,
}: ReportActionDialogProps) => {
  const [suspensionReason, setSuspensionReason] = useState("");

  // --- Redux Mutations ---
  const [resolveReport, { isLoading: isResolving }] =
    useResolveReportMutation();
  const [suspendAuth, { isLoading: isSuspending }] = useSuspendAuthMutation();

  if (isLoading) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-[400px] h-[300px] flex flex-col items-center justify-center border-none rounded-[2.5rem] bg-white">
          <Loader2 className="animate-spin text-[#0064AE]" size={40} />
          <p className="text-[10px] font-black text-slate-400 mt-4 uppercase tracking-[0.2em]">
            Loading Report Data...
          </p>
        </DialogContent>
      </Dialog>
    );
  }

  if (!report) return null;

  const handleResolve = async () => {
    try {
      const res = await resolveReport(report?.id).unwrap();
      toast.success(res.message || "Incident resolved successfully");
      onClose(); 
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to resolve report");
    }
  };

  const handleSuspend = async () => {
    if (!suspensionReason.trim()) {
      return toast.warning("Please provide a official reason for suspension");
    }

    try {
      const res = await suspendAuth({
        adId: report?.adId,
        reason: suspensionReason,
      }).unwrap();

      toast.success(res.message || "Seller account has been suspended");
      setSuspensionReason("");
      onClose();
    } catch (err: any) {
      toast.error(err?.data?.message || "Could not suspend user");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[850px] p-0 overflow-hidden rounded-[2.5rem] border-none shadow-2xl bg-white max-h-[90vh] overflow-y-auto">
        {/* 🔝 Premium Header */}
        <div className="bg-[#001B33] p-8 text-white relative">
          <div className="absolute -right-4 -top-4 opacity-10">
            <ShieldAlert size={140} />
          </div>
          <div className="relative z-10 flex justify-between items-end">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="px-2 py-0.5 bg-rose-600 text-[9px] font-black uppercase tracking-widest rounded-md animate-pulse">
                  High Priority
                </span>
                <span className="text-slate-400 text-[10px] font-mono tracking-tighter">
                  Case Reference: {report.id}
                </span>
              </div>
              <DialogTitle className="text-2xl font-black tracking-tight uppercase">
                Administrative Review
              </DialogTitle>
            </div>
            <div className="text-right hidden md:block">
              <p className="text-[9px] text-slate-500 font-black uppercase tracking-widest mb-1">
                Current Status
              </p>
              <span
                className={`px-4 py-1 rounded-full text-[10px] font-black border ${report.status === "PENDING" ? "border-amber-500/30 text-amber-500 bg-amber-500/5" : "border-emerald-500/30 text-emerald-500 bg-emerald-500/5"}`}
              >
                {report.status}
              </span>
            </div>
          </div>
        </div>

        <div className="p-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* 🛡️ COLUMN 1: Reporter Info */}
          <div className="space-y-6">
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
              <User size={14} className="text-[#0064AE]" /> Complainant Details
            </h3>
            <div className="p-5 bg-slate-50 rounded-[2rem] border border-slate-100 shadow-inner">
              <div className="flex items-center gap-4 mb-4">
                <img
                  src={
                    report?.reporter?.profilePicture ||
                    "https://i.pravatar.cc/100"
                  }
                  className="w-12 h-12 rounded-2xl object-cover ring-4 ring-white shadow-sm"
                  alt="Reporter"
                />
                <div>
                  <h4 className="text-sm font-black text-slate-900 leading-none mb-1">
                    {report?.reporter?.nickName}
                  </h4>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">
                    Verified Reporter
                  </p>
                </div>
              </div>
              <div className="space-y-3 pt-3 border-t border-slate-200/60 text-[11px] text-slate-600 font-medium">
                <p className="flex items-center gap-2">
                  <Mail size={12} className="text-slate-400" />{" "}
                  {report?.reporter?.email}
                </p>
                <p className="flex items-center gap-2">
                  <Phone size={12} className="text-slate-400" />{" "}
                  {report?.reporter?.phone || "Phone not provided"}
                </p>
                <p className="flex items-center gap-2">
                  <Calendar size={12} className="text-slate-400" /> Joined:{" "}
                  {new Date(report?.reporter?.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>

            <div className="p-5 bg-rose-50/50 rounded-[2rem] border border-rose-100 relative group transition-all hover:bg-rose-50">
              <div className="flex items-center gap-2 mb-3">
                <AlertCircle size={14} className="text-rose-500" />
                <span className="text-[10px] font-black text-rose-600 uppercase tracking-widest">
                  Allegation: {report.reason}
                </span>
              </div>
              <p className="text-xs text-slate-600 font-semibold italic leading-relaxed">
                "{report.description || "No detailed description provided."}"
              </p>
            </div>
          </div>

          {/* 🏷️ COLUMN 2: Evidence & Seller */}
          <div className="space-y-6">
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
              <Tag size={14} className="text-[#0064AE]" /> Target Listing
            </h3>
            <div className="rounded-[2rem] overflow-hidden border border-slate-100 shadow-lg bg-white group relative">
              <div className="relative h-36 overflow-hidden">
                <img
                  src={
                    report?.ad?.images?.[0]?.url ||
                    "https://via.placeholder.com/400x200"
                  }
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  alt="Ad"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-3 left-4">
                  <p className="text-[10px] text-white/70 font-bold uppercase tracking-widest">
                    Listing Price
                  </p>
                  <p className="text-lg font-black text-white">
                    ${report?.ad?.price?.toLocaleString()}
                  </p>
                </div>
                <a
                  href={`/item-details/${report?.adId}`}
                  target="_blank"
                  className="absolute top-3 right-3 p-2.5 bg-white/90 backdrop-blur-md rounded-xl text-[#0064AE] hover:bg-[#0064AE] hover:text-white transition-all shadow-xl"
                  title="View Live Ad"
                >
                  <ExternalLink size={16} strokeWidth={3} />
                </a>
              </div>
              <div className="p-5">
                <h4 className="text-xs font-black text-slate-900 truncate mb-2">
                  {report?.ad?.title}
                </h4>
                <div className="flex items-center gap-1.5 text-slate-400 text-[10px] font-bold">
                  <MapPin size={10} /> {report?.ad?.city}, {report?.ad?.state}
                </div>
              </div>
            </div>

            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
              <Store size={14} className="text-[#0064AE]" /> Seller Identity
            </h3>
            <div className="flex items-center gap-4 p-4 bg-indigo-50/40 rounded-[1.5rem] border border-indigo-100">
              <img
                src={
                  report?.ad?.seller?.profilePicture ||
                  "https://i.pravatar.cc/100"
                }
                className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-sm"
                alt="Seller"
              />
              <div>
                <h4 className="text-[12px] font-black text-slate-900 leading-none mb-1">
                  {report?.ad?.seller?.nickName}
                </h4>
                <p className="text-[9px] text-indigo-500 font-black uppercase tracking-tighter italic">
                  Pending Investigation
                </p>
              </div>
            </div>
          </div>

          {/* 🛠️ COLUMN 3: Admin Actions */}
          <div className="space-y-6 col-span-2 bg-slate-50/80 p-6 rounded-[2.5rem] border-2 border-dashed border-slate-200">
            <div>
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3 block text-center">
                Enforcement Command
              </label>
              <textarea
                value={suspensionReason}
                onChange={(e) => setSuspensionReason(e.target.value)}
                placeholder="State the official reason for account suspension..."
                className="w-full px-5 py-5 bg-white border border-slate-200 rounded-[1.5rem] text-xs min-h-[140px] focus:ring-4 focus:ring-[#0064AE]/10 transition-all outline-none resize-none shadow-sm placeholder:text-slate-300 font-medium"
              />
            </div>

            <div className="space-y-4">
              <button
                onClick={handleSuspend}
                disabled={isSuspending}
                className="w-full py-4 cursor-pointer bg-rose-600 text-white rounded-2xl font-black text-[11px] uppercase tracking-widest shadow-xl shadow-rose-200 hover:bg-rose-700 transition-all flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50"
              >
                {isSuspending ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  <Ban size={16} strokeWidth={2.5} />
                )}
                Execute Suspension
              </button>

              <button
                onClick={handleResolve}
                disabled={isResolving || report.status === "RESOLVED"}
                className="w-full cursor-pointer py-4 disabled:cursor-not-allowed bg-white border border-slate-200 text-slate-600 rounded-2xl font-black text-[11px] uppercase tracking-widest hover:bg-emerald-50 hover:text-emerald-600 hover:border-emerald-200 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isResolving ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  <CheckCircle size={16} strokeWidth={2.5} />
                )}
                {report.status === "RESOLVED"
                  ? "Report Resolved"
                  : "Dismiss & Resolve"}
              </button>
            </div>

            <p className="text-[9px] text-slate-400 text-center font-bold px-4 leading-relaxed italic">
              * Action will be recorded in system logs and the seller will be
              notified.
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ReportActionDialog;
