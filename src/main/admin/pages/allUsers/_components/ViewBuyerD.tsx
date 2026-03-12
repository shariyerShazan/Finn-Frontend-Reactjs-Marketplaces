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
  // History,
  // Gavel,
  Phone,
  Clock,
  UserCircle,
} from "lucide-react";
import {
  useToggleSuspensionMutation,
  useDeleteSellerMutation,
  useGetSingleUserQuery,
} from "@/redux/fetures/admin/admin.api";
import { toast } from "react-toastify";
import Swal from "sweetalert2";

const UserViewModal = ({
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
  const user = response?.data;

  const [toggleSuspension, { isLoading: isSuspending }] =
    useToggleSuspensionMutation();
  const [deleteUser, { isLoading: isDeleting }] = useDeleteSellerMutation();

  useEffect(() => {
    if (isOpen) setReason("");
  }, [isOpen]);

  const handleStatus = async () => {
    if (!user?.isSuspended && !reason)
      return toast.warning("Suspension reason is required");
    try {
      await toggleSuspension({ userId: user.id, reason }).unwrap();
      toast.success(user.isSuspended ? "User Unlocked" : "User Restricted");
      onClose();
    } catch (err) {
      console.log(err);
      toast.error("Process failed");
    }
  };

  const handleDelete = async () => {
    Swal.fire({
      title: "Are you sure?",
      text: "User account will be deleted permanently!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#e11d48",
      cancelButtonColor: "#64748b",
      confirmButtonText: "Yes, delete!",
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
          await deleteUser(user.id).unwrap();
          Swal.fire({
            title: "Deleted!",
            icon: "success",
            timer: 1500,
            showConfirmButton: false,
          });
          onClose();
        } catch (err) {
          console.log(err);
          toast.error("Delete failed.");
        }
      }
    });
  };

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[520px] p-0 border-none rounded-2xl overflow-hidden bg-white shadow-2xl">
        <DialogHeader className="p-4 bg-slate-900 text-white flex flex-row items-center justify-between">
          <DialogTitle className="text-sm font-bold uppercase tracking-widest flex items-center gap-2 text-white">
            <Eye size={16} /> User Profile Details
          </DialogTitle>
        </DialogHeader>

        {isFetching ? (
          <div className="h-80 flex items-center justify-center">
            <Loader2 className="animate-spin text-slate-900" size={40} />
          </div>
        ) : (
          user && (
            <div className="p-6 overflow-y-auto max-h-[85vh] custom-scrollbar">
              {/* Header Profile Section */}
              <div className="flex flex-col items-center text-center border-b border-slate-100 pb-6 mb-6">
                <div className="relative mb-4">
                  <img
                    src={
                      user.profilePicture ||
                      `https://api.dicebear.com/7.x/initials/svg?seed=${user.nickName}`
                    }
                    className="w-28 h-28 rounded-3xl object-cover border-4 border-white shadow-md"
                  />
                  <div
                    className={`absolute -right-1 -bottom-1 p-2 rounded-xl border-2 border-white shadow-sm ${user.isVerified ? "bg-blue-600" : "bg-amber-500"}`}
                  >
                    {user.isVerified ? (
                      <ShieldCheck size={16} className="text-white" />
                    ) : (
                      <ShieldAlert size={16} className="text-white" />
                    )}
                  </div>
                </div>
                <h2 className="text-2xl font-black text-slate-900 leading-none">
                  {user.firstName} {user.lastName}
                </h2>
                <p className="text-xs font-bold text-blue-600 mt-2 uppercase tracking-tighter">
                  ID: {user.id.slice(0, 8)}...
                </p>
              </div>

              {/* Information Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="space-y-3 bg-slate-50 p-4 rounded-xl border border-slate-100">
                  <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1">
                    Contact Info
                  </h4>
                  <div className="flex items-center gap-3 text-xs font-bold text-slate-700">
                    <Mail size={14} className="text-slate-400" /> {user.email}
                  </div>
                  <div className="flex items-center gap-3 text-xs font-bold text-slate-700">
                    <Phone size={14} className="text-slate-400" />{" "}
                    {user.phone || "No phone"}
                  </div>
                  <div className="flex items-center gap-3 text-xs font-bold text-slate-700">
                    <UserCircle size={14} className="text-slate-400" /> Role:{" "}
                    {user.role}
                  </div>
                </div>

                <div className="space-y-3 bg-slate-50 p-4 rounded-xl border border-slate-100">
                  <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1">
                    Activity
                  </h4>
                  <div className="flex items-center gap-3 text-xs font-bold text-slate-700">
                    <Clock size={14} className="text-slate-400" /> Last Login:{" "}
                    {user.lastLogin
                      ? new Date(user.lastLogin).toLocaleDateString()
                      : "N/A"}
                  </div>
                  <div className="flex items-center gap-3 text-xs font-bold text-slate-700">
                    <span className="w-3.5 h-3.5 rounded-full bg-emerald-500" />{" "}
                    Status: {user.isSuspended ? "Suspended" : "Active"}
                  </div>
                  <div className="flex items-center gap-3 text-xs font-bold text-slate-700">
                    <Clock size={14} className="text-slate-400" /> Joined:{" "}
                    {new Date(user.createdAt).toLocaleDateString()}
                  </div>
                </div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 gap-3 mb-6">
                <div className="bg-blue-50/50 p-3 rounded-xl border border-blue-100 text-center">
                  <ShoppingBag
                    size={18}
                    className="mx-auto text-blue-600 mb-1"
                  />
                  <p className="text-xl font-black text-slate-800 leading-none">
                    {user._count?.boughtAds || 0}
                  </p>
                  <p className="text-[9px] font-black text-blue-600 uppercase mt-1">
                    Bought
                  </p>
                </div>
                {/* <div className="bg-emerald-50/50 p-3 rounded-xl border border-emerald-100 text-center">
                  <Gavel size={18} className="mx-auto text-emerald-600 mb-1" />
                  <p className="text-xl font-black text-slate-800 leading-none">
                    {user._count?.bids || 0}
                  </p>
                  <p className="text-[9px] font-black text-emerald-600 uppercase mt-1">
                    Bids
                  </p>
                </div> */}
                <div className="bg-purple-50/50 p-3 rounded-xl border border-purple-100 text-center">
                  <ShoppingBag
                    size={18}
                    className="mx-auto text-purple-600 mb-1"
                  />
                  <p className="text-xl font-black text-slate-800 leading-none">
                    {user._count?.postedAds || 0}
                  </p>
                  <p className="text-[9px] font-black text-purple-600 uppercase mt-1">
                    Ads
                  </p>
                </div>
              </div>

              {/* Actions Section */}
              <div className="space-y-4 pt-4 border-t border-slate-100">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                    Suspension Reason
                  </label>
                  <textarea
                    className="w-full h-16 bg-slate-50 rounded-xl p-3 text-xs font-bold border border-slate-200 outline-none focus:ring-1 focus:ring-blue-500 resize-none transition-all"
                    placeholder={
                      user.isSuspended
                        ? "Reason: " +
                          (user.suspensionReason || "Violation of terms")
                        : "Provide a reason to suspend..."
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
                    className={`flex-1 cursor-pointer py-3 rounded-xl text-xs font-black text-white transition-all flex items-center justify-center gap-2 shadow-lg ${user.isSuspended ? "bg-emerald-600 shadow-emerald-100 hover:bg-emerald-700" : "bg-amber-500 shadow-amber-100 hover:bg-amber-600"}`}
                  >
                    {isSuspending ? (
                      <Loader2 size={16} className="animate-spin" />
                    ) : user.isSuspended ? (
                      <CheckCircle size={16} />
                    ) : (
                      <Ban size={16} />
                    )}
                    {user.isSuspended ? "RECOVER ACCOUNT" : "SUSPEND ACCOUNT"}
                  </button>
                  <button
                    onClick={handleDelete}
                    disabled={isDeleting}
                    className="px-5 py-3 cursor-pointer bg-rose-50 text-rose-600 hover:bg-rose-600 hover:text-white rounded-xl border border-rose-100 transition-all shadow-sm flex items-center justify-center"
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
