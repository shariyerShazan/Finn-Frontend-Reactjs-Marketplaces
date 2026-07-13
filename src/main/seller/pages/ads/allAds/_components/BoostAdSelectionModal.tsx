/* eslint-disable react-hooks/immutability */

/* eslint-disable @typescript-eslint/no-explicit-any */
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useGetAllBoostPackagesQuery } from "@/redux/fetures/admin/ad-boost.api.";
import { useCreateBoostCheckoutSessionMutation } from "@/redux/fetures/admin/pay-for-subsc";

import { Zap, Loader2, CheckCircle2 } from "lucide-react";
import { toast } from "react-toastify";

const BoostAdSelectionModal = ({ isOpen, onClose, adId }: any) => {
  const { data: response, isLoading } = useGetAllBoostPackagesQuery(undefined);
  const [createCheckout, { isLoading: isRedirecting }] = useCreateBoostCheckoutSessionMutation();

  const handleBoost = async (packageId: string) => {
    try {
      const res = await createCheckout({ adId, packageId }).unwrap();
      if (res.url) {
        window.location.href = res.url; // Redirect to Stripe
      }
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to initiate checkout");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] rounded-3xl p-6">
        <DialogHeader>
          <DialogTitle className="text-xl font-black text-slate-800 flex items-center gap-2">
            <Zap className="text-amber-500 fill-amber-500" size={20} />
            Boost Your Ad Visibility
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          {isLoading ? (
            <div className="flex justify-center py-10"><Loader2 className="animate-spin text-blue-600" /></div>
          ) : (
            response?.data?.map((pkg: any) => (
              <div 
                key={pkg.id}
                className="group relative border border-slate-200 rounded-2xl p-4 hover:border-blue-500 hover:bg-blue-50 transition-all cursor-pointer"
                onClick={() => !isRedirecting && handleBoost(pkg.id)}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-black text-slate-800 uppercase text-xs tracking-widest">{pkg.name}</h4>
                    <p className="text-2xl font-black text-slate-900 mt-1">${pkg.price}</p>
                    <p className="text-xs text-slate-500 font-bold mt-1">{pkg.durationDays} Days Duration</p>
                  </div>
                  <div className="bg-white p-2 rounded-xl border border-slate-100 shadow-sm group-hover:text-blue-600">
                    {isRedirecting ? <Loader2 className="animate-spin" size={18} /> : <Zap size={18} />}
                  </div>
                </div>
                <div className="mt-3 pt-3 border-t border-slate-100 flex items-center gap-2 text-[10px] font-black text-blue-600 uppercase">
                  <CheckCircle2 size={12} /> Get {pkg.type} Visibility
                </div>
              </div>
            ))
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BoostAdSelectionModal;