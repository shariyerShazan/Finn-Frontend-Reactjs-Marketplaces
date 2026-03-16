/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
//   CheckCircle2,
  Calendar,
  CreditCard,
  User,
  Zap,
  PackageSearch,
} from "lucide-react";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  boost: any;
}

const BoostViewModal = ({ isOpen, onClose, boost }: Props) => {
  if (!boost) return null;

  const detailItem = (icon: any, label: string, value: string) => (
    <div className="flex items-start gap-3 p-3 rounded-lg bg-slate-50 border border-slate-100 min-w-0">
      <div className="p-2 bg-white rounded-md shadow-sm text-amber-600 shrink-0">
        {icon}
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
          {label}
        </p>
        <p className="text-sm font-bold text-slate-800 break-all leading-tight">
          {value}
        </p>
      </div>
    </div>
  );

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md bg-white rounded-[24px] p-6 border-none shadow-2xl">
        <DialogHeader>
          <div className="flex items-center gap-2 mb-2">
            <div className="w-2 h-6 bg-amber-500 rounded-full" />
            <DialogTitle className="text-xl font-black text-slate-900 uppercase tracking-tight">
              Boost Transaction Details
            </DialogTitle>
          </div>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          <div className="flex items-center justify-between p-4 bg-amber-50 rounded-2xl border border-amber-100">
            <div className="flex items-center gap-3">
              <Zap className="text-amber-600 fill-amber-500" size={24} />
              <div>
                <p className="text-xs font-black text-amber-800 uppercase">
                  Package Type
                </p>
                <p className="text-sm font-bold text-amber-600">
                  {boost.package.name}
                </p>
              </div>
            </div>
            <span className="bg-amber-600 text-white text-[10px] font-black px-3 py-1 rounded-full uppercase">
              {boost.status}
            </span>
          </div>

          <div className="grid grid-cols-1 gap-3">
            {detailItem(
              <User size={18} />,
              "Seller",
              `${boost.seller.firstName} ${boost.seller.lastName}`,
            )}
            {detailItem(
              <PackageSearch size={18} />,
              "Ad Title",
              boost.ad.title,
            )}
            {detailItem(
              <CreditCard size={18} />,
              "Transaction ID",
              boost.transactionId || "N/A",
            )}

            <div className="grid grid-cols-2 gap-3">
              {detailItem(
                <Zap size={18} />,
                "Price Paid",
                `${boost.package.price} PLN`,
              )}
              {detailItem(
                <Calendar size={18} />,
                "Duration",
                `${boost.package.durationDays} Days`,
              )}
            </div>

            <div className="grid grid-cols-2 gap-3">
              {detailItem(
                <Calendar size={18} />,
                "Activated",
                new Date(boost.createdAt).toLocaleDateString(),
              )}
              {detailItem(
                <Calendar size={18} />,
                "Expires",
                new Date(boost.endDate).toLocaleDateString(),
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BoostViewModal;
