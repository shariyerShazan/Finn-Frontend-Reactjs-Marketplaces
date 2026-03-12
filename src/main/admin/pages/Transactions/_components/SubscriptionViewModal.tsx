/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  CheckCircle2,
  Calendar,
  CreditCard,
  User,
  Package,
} from "lucide-react";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  transaction: any;
}

const SubscriptionViewModal = ({ isOpen, onClose, transaction }: Props) => {
  if (!transaction) return null;

 const detailItem = (icon: any, label: string, value: string) => (
   <div className="flex items-start gap-3 p-3 rounded-lg bg-slate-50 border border-slate-100 min-w-0">
     {" "}
     <div className="p-2 bg-white rounded-md shadow-sm text-[#0064AE] shrink-0">
       {" "}
       {icon}
     </div>
     <div className="min-w-0 flex-1">
       {" "}
       <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
         {label}
       </p>
       <p className="text-sm font-bold text-slate-800 break-all leading-tight">
         {" "}
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
            <div className="w-2 h-6 bg-[#0064AE] rounded-full" />
            <DialogTitle className="text-xl font-black text-slate-900 uppercase tracking-tight">
              Transaction Details
            </DialogTitle>
          </div>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          {/* Status Banner */}
          <div className="flex items-center justify-between p-4 bg-emerald-50 rounded-2xl border border-emerald-100">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="text-emerald-600" size={24} />
              <div>
                <p className="text-xs font-black text-emerald-800 uppercase">
                  Payment Status
                </p>
                <p className="text-sm font-bold text-emerald-600">
                  {transaction.paymentStatus}
                </p>
              </div>
            </div>
            <span className="bg-emerald-600 text-white text-[10px] font-black px-3 py-1 rounded-full uppercase">
              {transaction.status}
            </span>
          </div>

          <div className="grid grid-cols-1 gap-3">
            {detailItem(
              <User size={18} />,
              "Seller Info",
              `${transaction.seller.firstName} ${transaction.seller.lastName}`,
            )}

            {detailItem(
              <CreditCard size={18} />,
              "Transaction ID",
              transaction.transactionId,
            )}

            <div className="grid grid-cols-2 gap-3">
              {detailItem(
                <Package size={18} />,
                "Plan Name",
                transaction.plan.name,
              )}
              {detailItem(
                <Calendar size={18} />,
                "Plan Price",
                `${transaction.plan.price} PLN`,
              )}
            </div>

            <div className="grid grid-cols-2 gap-3">
              {detailItem(
                <Calendar size={18} />,
                "Start Date",
                new Date(transaction.startDate).toLocaleDateString(),
              )}
              {detailItem(
                <Calendar size={18} />,
                "End Date",
                new Date(transaction.endDate).toLocaleDateString(),
              )}
            </div>
          </div>

          <div className="p-4 bg-blue-50/50 rounded-2xl border border-blue-100 flex justify-between items-center">
            <div>
              <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest">
                Post Usage
              </p>
              <p className="text-sm font-black text-[#0064AE]">
                {transaction.usedAdIds.length} / {transaction.totalLimit} Posts
              </p>
            </div>
            <div className="w-16 h-1 bg-blue-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-[#0064AE]"
                style={{
                  width: `${(transaction.usedAdIds.length / transaction.totalLimit) * 100}%`,
                }}
              />
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SubscriptionViewModal;
