/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  // ShoppingBag,
  CheckCircle,
  Trash2,
  Loader2,
  Mail,
  Eye,
  Ban,
  Building,
  ExternalLink,
  MapPin,
  LayoutDashboard,
} from "lucide-react";
import {
  useToggleSuspensionMutation,
  useDeleteSellerMutation,
  useGetSingleUserQuery,
} from "@/redux/fetures/admin/admin.api";
import { toast } from "react-toastify";
import Swal from "sweetalert2";

const SellerViewModal = ({
  isOpen,
  onClose,
  userId,
}: {
  isOpen: boolean;
  onClose: () => void;
  userId: string ;
}) => {
  const [reason, setReason] = useState("");

  const { data: response, isLoading: isFetching } = useGetSingleUserQuery(
    userId,
    { skip: !userId },
  );
  const seller = response?.data;

  const [toggleSuspension, { isLoading: isSuspending }] =
    useToggleSuspensionMutation();
  const [deleteSeller, { isLoading: isDeleting }] = useDeleteSellerMutation();

  useEffect(() => {
    if (isOpen) setReason("");
  }, [isOpen]);

  const handleStatus = async () => {
    if (!seller.isSuspended && !reason)
      return toast.warning("Reason is required");
    try {
      await toggleSuspension({ userId: seller.id, reason }).unwrap();
      toast.success(
        seller.isSuspended ? "Seller Activated" : "Seller Suspended",
      );
      onClose();
    } catch (err) {
      console.log(err)
      toast.error("Action failed");
    }
  };

  const handleDelete = async () => {
    Swal.fire({
      title: "Terminate Seller Account?",
      text: "This will remove all their posted ads and profile data!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#e11d48",
      cancelButtonColor: "#64748b",
      confirmButtonText: "Yes, Terminate!",
      target: "body",
      didOpen: () => {
        document.body.style.pointerEvents = "auto";
        const container = Swal.getContainer();
        if (container) container.style.zIndex = "9999";
      },
      customClass: { popup: "rounded-xl" },
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await deleteSeller(seller.id).unwrap();
          Swal.fire({
            title: "Removed!",
            icon: "success",
            timer: 1500,
            showConfirmButton: false,
          });
          onClose();
        } catch (err) {
          console.log(err);
          toast.error("Process failed.");
        }
      }
    });
  };

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[550px] p-0 border-none rounded-xl overflow-hidden bg-white shadow-2xl">
        <DialogHeader className="p-4 bg-slate-900 text-white">
          <DialogTitle className="text-sm font-bold uppercase tracking-widest flex items-center gap-2">
            <Eye size={16} /> Seller Inspection
          </DialogTitle>
        </DialogHeader>

        {isFetching ? (
          <div className="h-96 flex items-center justify-center">
            <Loader2 className="animate-spin text-slate-900" size={32} />
          </div>
        ) : (
          seller && (
            <div className="p-6 max-h-[85vh] overflow-y-auto custom-scrollbar">
              {/* Seller Info */}
              <div className="flex items-start gap-4 mb-6">
                <img
                  src={
                    seller.profilePicture ||
                    `https://api.dicebear.com/7.x/initials/svg?seed=${seller.nickName}`
                  }
                  className="w-20 h-20 rounded-xl object-cover border-2 border-slate-100 shadow-sm"
                />
                <div className="flex-1">
                  <h2 className="text-xl font-bold text-slate-900">
                    {seller.firstName} {seller.lastName}
                  </h2>
                  <p className="text-xs font-bold text-blue-600 mb-2">
                    @{seller.nickName}
                  </p>
                  <div className="flex flex-col gap-1 text-[11px] text-slate-500 font-semibold uppercase">
                    <span className="flex items-center gap-2">
                      <Mail size={12} /> {seller.email}
                    </span>
                    <span className="flex items-center gap-2">
                      <LayoutDashboard size={12} /> Role: {seller.role}
                    </span>
                  </div>
                </div>
              </div>

              {/* Company Details Card */}
              {seller.sellerProfile && (
                <div className="bg-slate-900 rounded-xl p-4 text-white mb-6 shadow-xl">
                  <h3 className="text-[10px] font-black uppercase text-slate-400 mb-3 tracking-widest flex items-center gap-2">
                    <Building size={12} /> Company Profile
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-[10px] text-slate-400 font-bold uppercase">
                        Company Name
                      </p>
                      <p className="text-sm font-bold">
                        {seller.sellerProfile.companyName}
                      </p>
                    </div>
                    <div>
                      <p className="text-[10px] text-slate-400 font-bold uppercase">
                        Website
                      </p>
                      <a
                        href={seller.sellerProfile.companyWebSite}
                        target="_blank"
                        className="text-sm font-bold text-blue-400 flex items-center gap-1 hover:underline"
                      >
                        Visit <ExternalLink size={12} />
                      </a>
                    </div>
                    <div className="col-span-2">
                      <p className="text-[10px] text-slate-400 font-bold uppercase">
                        Location
                      </p>
                      <p className="text-sm font-bold flex items-center gap-1 text-slate-200">
                        <MapPin size={12} /> {seller.sellerProfile.address},{" "}
                        {seller.sellerProfile.city},{" "}
                        {seller.sellerProfile.country}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Stats and Recent Ads */}
              <div className="grid grid-cols-1 gap-4 mb-6">
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-[10px] font-black uppercase text-slate-400 tracking-widest">
                      Recent Ads
                    </h3>
                    <span className="bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full text-[10px] font-bold">
                      Total: {seller._count?.postedAds}
                    </span>
                  </div>
                  <div className="space-y-2">
                    {seller.postedAds?.map((ad: any) => (
                      <div
                        key={ad.id}
                        className="flex items-center justify-between p-2 bg-white rounded-lg border border-slate-100 shadow-sm"
                      >
                        <p className="text-[11px] font-bold text-slate-700 line-clamp-1 truncate w-40">
                          {ad.title}
                        </p>
                        <div
                          className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-tighter border ${
                            ad.isSold
                              ? "bg-rose-50 text-rose-600 border-rose-100"
                              : "bg-emerald-50 text-emerald-600 border-emerald-100"
                          }`}
                        >
                          {ad.isSold ? "Sold Out" : "Available"}
                        </div>
                        <span className="text-[10px] font-black text-blue-600">
                          ${ad.price || ad.basePrice}
                        </span>
                      </div>
                    ))}
                    {seller.postedAds?.length === 0 && (
                      <p className="text-[11px] text-slate-400 text-center">
                        No ads posted yet
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Suspension Logic */}
              <div className="space-y-4 pt-4 border-t border-slate-100">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase">
                    Suspension Note
                  </label>
                  <textarea
                    className="w-full h-16 bg-slate-50 rounded-lg p-3 text-xs font-medium border border-slate-200 outline-none focus:ring-1 focus:ring-blue-500 resize-none"
                    placeholder={
                      seller.isSuspended
                        ? "Reason: " + (seller.suspensionReason || "N/A")
                        : "Write reason for suspension..."
                    }
                    value={seller.isSuspended ? "" : reason}
                    onChange={(e) => setReason(e.target.value)}
                    disabled={seller.isSuspended}
                  />
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={handleStatus}
                    disabled={isSuspending}
                    className={`flex-1 py-3 cursor-pointer rounded-xl text-xs font-black text-white flex items-center justify-center gap-2 transition-all ${seller.isSuspended ? "bg-emerald-600" : "bg-amber-600 shadow-lg shadow-amber-200"}`}
                  >
                    {isSuspending ? (
                      <Loader2 size={14} className="animate-spin" />
                    ) : seller.isSuspended ? (
                      <CheckCircle size={14} />
                    ) : (
                      <Ban size={14} />
                    )}
                    {seller.isSuspended ? "LIFT RESTRICTION" : "SUSPEND SELLER"}
                  </button>
                  <button
                    onClick={handleDelete}
                    disabled={isDeleting}
                    className="px-4 py-3 cursor-pointer bg-rose-50 text-rose-600 hover:bg-rose-600 hover:text-white rounded-xl border border-rose-100 transition-all"
                  >
                    {isDeleting ? (
                      <Loader2 size={14} className="animate-spin" />
                    ) : (
                      <Trash2 size={14} />
                    )}
                  </button>
                </div>
              </div>
            </div>
          )
        )}
      </DialogContent>
    </Dialog>
  );
};

export default SellerViewModal;
