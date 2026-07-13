/* eslint-disable @typescript-eslint/no-explicit-any */
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Zap, Calendar, Info, ShieldCheck } from "lucide-react";

const BoostPackageViewModal = ({ isOpen, onClose, pkg }: any) => {
  if (!pkg) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[450px] rounded-3xl p-0 overflow-hidden border-none">
        <div className="bg-gradient-to-br from-[#0064AE] to-[#003d6b] p-8 text-white relative">
          <div className="space-y-1">
            <p className="text-blue-100 text-[10px] font-black uppercase tracking-[3px]">
              Package Tier
            </p>
            <h2 className="text-3xl font-black flex items-center gap-2">
              <Zap className="fill-amber-400 text-amber-400" size={24} />
              {pkg.name}
            </h2>
          </div>
          <div className="absolute top-8 right-8 text-4xl font-black opacity-20">
            ${pkg.price}
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
                  Validity
                </p>
                <p className="text-sm font-bold text-slate-700">
                  {pkg.durationDays} Days
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-slate-50 rounded-xl text-slate-400">
                <ShieldCheck size={20} />
              </div>
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase">
                  Level
                </p>
                <p className="text-sm font-bold text-slate-700 uppercase">
                  {pkg.type}
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-2 border-b pb-2">
              <Info size={14} className="text-slate-400" />
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                Package Description
              </p>
            </div>
            <p className="text-sm font-semibold text-slate-600 leading-relaxed">
              {pkg.description ||
                "No detailed description provided for this boost package."}
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BoostPackageViewModal;
