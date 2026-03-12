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
  ShoppingBag,
  CheckCircle,
  Trash2,
  Loader2,
  Mail,
  Eye,
  Ban,
  ShieldCheck,
  ShieldAlert,
//   Gavel,
  Phone,
  Clock,
  Calendar,
  Building2,
  Globe,
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

interface UserViewModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string ;
}

const UserViewModal = ({ isOpen, onClose, userId }: UserViewModalProps) => {
  const [reason, setReason] = useState("");

  const { data: response, isLoading: isFetching } = useGetSingleUserQuery(
    userId,
    { skip: !userId },
  );
  const user = response?.data;

  const [toggleSuspension, { isLoading: isSuspending }] =
    useToggleSuspensionMutation();
  const [deleteUser, { isLoading: isDeleting }] = useDeleteSellerMutation();

  useEffect(() => {
    if (isOpen) setReason("");
  }, [isOpen]);

  const handleStatus = async () => {
    if (!user?.isSuspended && !reason)
      return toast.warning("Reason is required");
    try {
      await toggleSuspension({ userId: user.id, reason }).unwrap();
      toast.success(
        user.isSuspended ? "Account Activated" : "Account Suspended",
      );
      onClose();
    } catch (err) {
        console.log(err);
      toast.error("Process failed");
    }
  };

  const handleDelete = async () => {
    Swal.fire({
      title: "Are you sure?",
      text: "Permanent deletion cannot be undone!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#e11d48",
      confirmButtonText: "Yes, delete!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await deleteUser(user.id).unwrap();
          toast.success("Account deleted");
          onClose();
        } catch (err) {
            console.log(err)
          toast.error("Delete failed");
        }
      }
    });
  };

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[550px] p-0 border-none rounded-2xl overflow-hidden bg-white shadow-2xl">
        <DialogHeader className="p-4 bg-slate-900 text-white">
          <DialogTitle className="text-sm font-bold uppercase tracking-widest flex items-center gap-2">
            <Eye size={16} /> {user?.isSeller ? "Seller" : "User"} Profile
            Analysis
          </DialogTitle>
        </DialogHeader>

        {isFetching ? (
          <div className="h-80 flex items-center justify-center">
            <Loader2 className="animate-spin text-slate-900" size={32} />
          </div>
        ) : (
          user && (
            <div className="p-6 overflow-y-auto max-h-[85vh] custom-scrollbar space-y-6">
              {/* Profile Header */}
              <div className="flex flex-col items-center text-center">
                <div className="relative mb-3">
                  <img
                    src={
                      user.profilePicture ||
                      `https://api.dicebear.com/7.x/initials/svg?seed=${user.nickName}`
                    }
                    className="w-24 h-24 rounded-2xl object-cover border-4 border-slate-50 shadow-sm"
                  />
                  <div
                    className={`absolute -right-2 -top-2 p-1.5 rounded-lg border-2 border-white shadow-sm ${user.isVerified ? "bg-blue-500" : "bg-amber-500"}`}
                  >
                    {user.isVerified ? (
                      <ShieldCheck size={14} className="text-white" />
                    ) : (
                      <ShieldAlert size={14} className="text-white" />
                    )}
                  </div>
                </div>
                <h2 className="text-xl font-black text-slate-900 leading-none">
                  {user.firstName} {user.lastName}
                </h2>
                <div className="flex items-center gap-2 mt-2">
                  <span
                    className={`px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-widest ${user.isSeller ? "bg-purple-100 text-purple-600" : "bg-blue-100 text-blue-600"}`}
                  >
                    {user.isSeller ? "Seller Account" : "Buyer Account"}
                  </span>
                </div>
              </div>

              {/* Contact Info Card */}
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-center gap-3">
                  <Mail size={16} className="text-slate-400" />
                  <div className="truncate">
                    <p className="text-[9px] font-black text-slate-400 uppercase leading-none mb-1">
                      Email
                    </p>
                    <p className="text-xs font-bold text-slate-700 truncate">
                      {user.email}
                    </p>
                  </div>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-center gap-3">
                  <Phone size={16} className="text-slate-400" />
                  <div>
                    <p className="text-[9px] font-black text-slate-400 uppercase leading-none mb-1">
                      Phone
                    </p>
                    <p className="text-xs font-bold text-slate-700">
                      {user.phone || "N/A"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Conditional Seller Content */}
              {user.isSeller && user.sellerProfile && (
                <div className="bg-slate-900 rounded-2xl p-4 text-white shadow-xl">
                  <h3 className="text-[10px] font-black uppercase text-slate-400 mb-3 tracking-widest flex items-center gap-2">
                    <Building2 size={12} /> Company Information
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-[10px] text-slate-500 font-bold uppercase">
                        Company Name
                      </p>
                      <p className="text-sm font-bold">
                        {user.sellerProfile.companyName}
                      </p>
                    </div>
                    <div>
                      <p className="text-[10px] text-slate-500 font-bold uppercase">
                        Website
                      </p>
                      <a
                        href={user.sellerProfile.companyWebSite}
                        target="_blank"
                        className="text-sm font-bold text-blue-400 flex items-center gap-1 hover:underline"
                      >
                        <Globe size={12} /> Visit Link
                      </a>
                    </div>
                    <div className="col-span-2">
                      <p className="text-[10px] text-slate-500 font-bold uppercase">
                        Address
                      </p>
                      <p className="text-xs font-bold flex items-center gap-1 text-slate-300">
                        <MapPin size={12} /> {user.sellerProfile.address},{" "}
                        {user.sellerProfile.city}, {user.sellerProfile.country}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Stats & Logs */}
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-3">
                  <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                    Platform Activity
                  </h4>
                  <div className="grid grid-cols-1 gap-2">
                    {user.isSeller ? (
                      <div className="bg-purple-50 p-3 rounded-xl border border-purple-100 text-center">
                        <LayoutDashboard
                          size={14}
                          className="mx-auto text-purple-600 mb-1"
                        />
                        <p className="text-lg font-black text-slate-800 leading-none">
                          {user._count?.postedAds || 0}
                        </p>
                        <p className="text-[8px] font-black text-purple-500 uppercase mt-1">
                          Ads Posted
                        </p>
                      </div>
                    ) : (
                      <div className="bg-blue-50 p-3 rounded-xl border border-blue-100 text-center">
                        <ShoppingBag
                          size={14}
                          className="mx-auto text-blue-600 mb-1"
                        />
                        <p className="text-lg font-black text-slate-800 leading-none">
                          {user._count?.boughtAds || 0}
                        </p>
                        <p className="text-[8px] font-black text-blue-500 uppercase mt-1">
                          Purchases
                        </p>
                      </div>
                    )}
                    {/* <div className="bg-emerald-50 p-3 rounded-xl border border-emerald-100 text-center">
                      <Gavel
                        size={14}
                        className="mx-auto text-emerald-600 mb-1"
                      />
                      <p className="text-lg font-black text-slate-800 leading-none">
                        {user._count?.bids || 0}
                      </p>
                      <p className="text-[8px] font-black text-emerald-500 uppercase mt-1">
                        Bids Made
                      </p>
                    </div> */}
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                    Engagement Log
                  </h4>
                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5 text-slate-400">
                        <Calendar size={12} />
                        <span className="text-[9px] font-black uppercase">
                          Joined
                        </span>
                      </div>
                      <span className="text-[9px] font-black text-slate-700">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5 text-slate-400">
                        <Clock size={12} />
                        <span className="text-[9px] font-black uppercase">
                          Active
                        </span>
                      </div>
                      <span className="text-[9px] font-black text-slate-700">
                        {user.lastLogin
                          ? new Date(user.lastLogin).toLocaleDateString()
                          : "Never"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="space-y-4 pt-4 border-t border-slate-100">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    Suspension Note
                  </label>
                  <textarea
                    className="w-full h-16 bg-slate-50 rounded-xl p-3 text-xs font-bold border border-slate-200 outline-none focus:ring-1 focus:ring-blue-500 resize-none transition-all disabled:opacity-60"
                    placeholder={
                      user.isSuspended
                        ? "Reason: " +
                          (user.suspensionReason || "Violated terms")
                        : "Why are you suspending this account?"
                    }
                    value={user.isSuspended ? "" : reason}
                    onChange={(e) => setReason(e.target.value)}
                    disabled={user.isSuspended}
                  />
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={handleStatus}
                    disabled={isSuspending}
                    className={`flex-1 py-3 cursor-pointer rounded-xl text-xs font-black text-white transition-all flex items-center justify-center gap-2 shadow-lg ${user.isSuspended ? "bg-emerald-600 shadow-emerald-100 hover:bg-emerald-700" : "bg-amber-500 shadow-amber-100 hover:bg-amber-600"}`}
                  >
                    {isSuspending ? (
                      <Loader2 size={16} className="animate-spin" />
                    ) : user.isSuspended ? (
                      <CheckCircle size={16} />
                    ) : (
                      <Ban size={16} />
                    )}
                    {user.isSuspended ? "ACTIVATE ACCOUNT" : "SUSPEND ACCOUNT"}
                  </button>
                  <button
                    onClick={handleDelete}
                    disabled={isDeleting}
                    className="px-5 py-3 cursor-pointer bg-rose-50 text-rose-600 hover:bg-rose-600 hover:text-white rounded-xl border border-rose-100 transition-all flex items-center justify-center"
                  >
                    {isDeleting ? (
                      <Loader2 size={16} className="animate-spin" />
                    ) : (
                      <Trash2 size={16} />
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

export default UserViewModal;
