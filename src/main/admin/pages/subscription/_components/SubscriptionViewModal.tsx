/* eslint-disable @typescript-eslint/no-explicit-any */
// import React from "react";
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import { CheckCircle2, Calendar, HardDrive } from "lucide-react";

const SubscriptionViewModal = ({ isOpen, onClose, plan }: any) => {
  if (!plan) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[450px] rounded-3xl p-0 overflow-hidden border-none">
        <div className="bg-[#0064AE] p-8 text-white relative">
          <div className="space-y-1">
            <p className="text-blue-100 text-xs font-black uppercase tracking-[3px]">
              Plan Details
            </p>
            <h2 className="text-3xl font-black">{plan.name}</h2>
          </div>
          <div className="absolute top-8 right-8 text-4xl font-black opacity-20">
            ${plan.price}
          </div>
        </div>

        <div className="p-8 space-y-8 bg-white">
          <div className="grid grid-cols-2 gap-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-slate-50 rounded-xl text-slate-400">
                <Calendar size={20} />
              </div>
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase">
                  Duration
                </p>
                <p className="text-sm font-bold text-slate-700">
                  {plan.durationDays} Days
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-slate-50 rounded-xl text-slate-400">
                <HardDrive size={20} />
              </div>
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase">
                  Post Limit
                </p>
                <p className="text-sm font-bold text-slate-700">
                  {plan.postLimit} Ads
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest border-b pb-2">
              What's Included
            </p>
            <div className="space-y-3">
              {plan.features.map((feature: string, idx: number) => (
                <div key={idx} className="flex items-start gap-3">
                  <CheckCircle2
                    size={18}
                    className="text-[#0064AE] mt-0.5 shrink-0"
                  />
                  <span className="text-sm font-semibold text-slate-600">
                    {feature}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SubscriptionViewModal;
