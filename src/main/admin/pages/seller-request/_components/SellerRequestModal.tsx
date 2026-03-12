/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Building2,
  Globe,
  MapPin,
  Loader2,
  CheckCircle,
  Ban,
} from "lucide-react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  seller: any;
  onAction: (id: string, action: "APPROVE" | "SUSPEND") => void;
  isUpdating: boolean;
}

const SellerRequestModal = ({
  isOpen,
  onClose,
  seller,
  onAction,
  isUpdating,
}: ModalProps) => {
  if (!seller) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      {/* SweetAlert এর জন্য z-index হ্যান্ডেল করা হয়েছে */}
      <DialogContent className="sm:max-w-[480px] p-0 rounded-3xl overflow-hidden border-none shadow-2xl bg-white z-[50]">
        <DialogHeader className="p-5 bg-slate-900 text-white">
          <DialogTitle className="text-sm font-black uppercase tracking-widest">
            Seller Review Details
          </DialogTitle>
        </DialogHeader>

        <div className="p-6 space-y-6">
          <div className="flex items-center gap-4 border-b border-slate-100 pb-4">
            <img
              src={
                seller.profilePicture ||
                `https://api.dicebear.com/7.x/initials/svg?seed=${seller.nickName}`
              }
              className="w-16 h-16 rounded-2xl object-cover border-2 border-slate-50"
            />
            <div>
              <h3 className="text-lg font-black text-slate-800 leading-none">
                {seller.firstName} {seller.lastName}
              </h3>
              <p className="text-xs font-bold text-blue-600 mt-1 uppercase tracking-tight">
                @{seller.nickName}
              </p>
            </div>
          </div>

          <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100 space-y-4 text-slate-700">
            <div className="flex items-start gap-3">
              <Building2 className="text-slate-400 mt-1" size={18} />
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase">
                  Company Name
                </p>
                <p className="text-sm font-bold leading-tight">
                  {seller.sellerProfile?.companyName}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Globe className="text-slate-400 mt-1" size={18} />
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase">
                  Website
                </p>
                <a
                  href={seller.sellerProfile?.companyWebSite}
                  target="_blank"
                  className="text-sm font-bold text-blue-500 hover:underline"
                >
                  {seller.sellerProfile?.companyWebSite || "Not provided"}
                </a>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <MapPin className="text-slate-400 mt-1" size={18} />
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase">
                  Address
                </p>
                <p className="text-xs font-bold leading-relaxed">
                  {seller.sellerProfile?.address}, {seller.sellerProfile?.city},{" "}
                  <br />
                  {seller.sellerProfile?.state} {seller.sellerProfile?.country}
                </p>
              </div>
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              onClick={() => onAction(seller.id, "APPROVE")}
              disabled={isUpdating}
              className="flex-1 cursor-pointer bg-emerald-600 hover:bg-emerald-700 text-white py-4 rounded-2xl text-xs font-black transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-100 disabled:opacity-50"
            >
              {isUpdating ? (
                <Loader2 className="animate-spin" size={16} />
              ) : (
                <CheckCircle size={16} />
              )}
              APPROVE
            </button>

            <button
              onClick={() => onAction(seller.id, "SUSPEND")}
              disabled={isUpdating}
              className="px-6 py-4 cursor-pointer bg-rose-50 text-rose-600 hover:bg-rose-600 hover:text-white rounded-2xl text-xs font-black transition-all flex items-center justify-center gap-2 border border-rose-100 disabled:opacity-50"
            >
              <Ban size={18} />
              SUSPEND
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SellerRequestModal;
