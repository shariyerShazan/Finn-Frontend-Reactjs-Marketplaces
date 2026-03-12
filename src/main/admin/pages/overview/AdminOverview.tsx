/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import CommonTable, { type Column } from "@/main/user/_components/CustomTable";
import { Eye, Ban, Trash2, ShieldCheck, ShieldAlert, Verified } from "lucide-react";
import AdminStat from "./_components/AdminStats";
// import UserViewModal from "./_components/UserViewModal"; // আপনার তৈরি করা সেই মডাল
import { useDeleteSellerMutation, useGetRecentUsersQuery, useToggleSuspensionMutation } from "@/redux/fetures/admin/admin.api";
import UserViewModal from "./_components/UserViewModal";
import { toast } from "react-toastify";
import Swal from "sweetalert2";

const AdminOverview = () => {
  const [selectedUserId, setSelectedUserId] = useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  // RTK Query to fetch 5 recent users
  const { data: response } = useGetRecentUsersQuery(undefined);
  const recentUsers = response?.data || [];

  const handleViewDetails = (id: string) => {
    setSelectedUserId(id);
    setIsModalOpen(true);
  };


  const handleQuickDelete = async (id: string) => {
    Swal.fire({
      title: "Are you sure?",
      text: "User account will be permanently deleted!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#e11d48",
      cancelButtonColor: "#64748b",
      confirmButtonText: "Yes, delete it!",
      customClass: { popup: "rounded-xl" },
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await deleteUser(id).unwrap();
          Swal.fire({
            title: "Deleted!",
            icon: "success",
            timer: 1500,
            showConfirmButton: false,
            customClass: { popup: "rounded-xl" },
          });
        } catch (err) {
          console.log(err);
          toast.error("Operation failed.");
        }
      }
    });
  };
  const [deleteUser] = useDeleteSellerMutation();
  const [toggleSuspension] = useToggleSuspensionMutation();
  const handleQuickSuspension = async (
    id: string,
    isCurrentlySuspended: boolean,
  ) => {
    if (isCurrentlySuspended) {
      Swal.fire({
        title: "Reactivate User?",
        icon: "question",
        showCancelButton: true,
        confirmButtonColor: "#10b981",
        confirmButtonText: "Yes, activate!",
        customClass: { popup: "rounded-xl" },
      }).then(async (result) => {
        if (result.isConfirmed) {
          try {
            await toggleSuspension({ userId: id, reason: "" }).unwrap();
            toast.success("User Restored");
          } catch (err) {
            console.log(err);
            toast.error("Action failed");
          }
        }
      });
    } else {
      const { value: reason } = await Swal.fire({
        title: "Suspension Reason",
        input: "textarea",
        showCancelButton: true,
        confirmButtonColor: "#f59e0b",
        confirmButtonText: "Suspend Now",
        customClass: { popup: "rounded-xl" },
        inputValidator: (value) => {
          if (!value) return "Reason is required!";
        },
      });
      if (reason) {
        try {
          await toggleSuspension({ userId: id, reason }).unwrap();
          toast.success("User Suspended");
        } catch (err) {
          console.log(err);
          toast.error("Action failed");
        }
      }
    }
  };

  const columns: Column<any>[] = [
    {
      header: "User / Identity",
      render: (item) => (
        <div className="flex items-center gap-3">
          <div className="relative">
            <img
              src={
                item.profilePicture ||
                `https://api.dicebear.com/7.x/initials/svg?seed=${item.nickName}`
              }
              className="w-10 h-10 rounded-xl object-cover border border-slate-100"
            />
            <div
              className={`absolute -right-1 -bottom-1 p-0.5 rounded-full border border-white ${item.isVerified ? "bg-blue-500" : "bg-amber-500"}`}
            >
              {item.isVerified ? (
                <ShieldCheck size={10} className="text-white" />
              ) : (
                <ShieldAlert size={10} className="text-white" />
              )}
            </div>
          </div>
          <div>
            <p className="font-bold text-slate-800 text-sm leading-none">
              {item.firstName} {item.lastName}
            </p>
            <p className="text-[10px] font-medium text-slate-400 mt-1 uppercase">
              @{item.nickName}
            </p>
          </div>
        </div>
      ),
    },
    {
      header: "Email Verification",
      render: (item) => (
        <div className="flex items-center gap-1.5">
          {item.isVerified ? (
            <div className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-blue-50 text-[#0064AE] border border-blue-100">
              <ShieldCheck size={12} className="fill-current" />
              <span className="text-[10px] font-black uppercase tracking-tight">
                Verified
              </span>
            </div>
          ) : (
            <div className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-50 text-slate-400 border border-slate-100">
              <span className="text-[10px] font-black uppercase tracking-tight">
                Unverified
              </span>
            </div>
          )}
        </div>
      ),
    },
    {
      header: "Email Address",
      render: (item) => (
        <span className="text-xs font-medium text-slate-600 lowercase">
          {item.email}
        </span>
      ),
    },
    {
      header: "Role",
      render: (item) => (
        <span
          className={`px-2 flex gap-2 w-max py-0.5 rounded-full text-[10px] font-black uppercase tracking-tighter ${item.role == "SELLER" ? "bg-purple-100 text-purple-600" : "bg-blue-100 text-blue-600"}`}
        >
          {item.role == "SELLER" ? "Seller" : "Buyer"}
          {item.isSeller && (
            <p>
              <Verified size={12} />
            </p>
          )}
        </span>
      ),
    },
    {
      header: "Registered Date",
      render: (item) => (
        <span className="text-xs font-semibold text-slate-600">
          {new Date(item.createdAt).toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          })}
        </span>
      ),
    },
    {
      header: "Status",
      render: (item) => (
        <div
          className={`px-2 py-0.5 rounded text-[10px] w-max font-bold uppercase tracking-wider border ${
            item.isSuspended
              ? "bg-rose-50 text-rose-600 border-rose-100"
              : "bg-emerald-50 text-emerald-600 border-emerald-100"
          }`}
        >
          {item.isSuspended ? "Suspended" : "Active"}
        </div>
      ),
    },
    {
      header: "Action",
      render: (item) => (
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleViewDetails(item.id)}
            className="p-2 cursor-pointer rounded-lg border border-slate-200 text-slate-400 hover:text-[#0064AE] hover:bg-blue-50 transition-all"
            title="View Details"
          >
            <Eye size={16} />
          </button>
          <button
            onClick={() => handleQuickSuspension(item.id, item.isSuspended)}
            className={`p-2 cursor-pointer rounded-lg border border-slate-200 transition-colors ${item.isSuspended ? "text-emerald-500 hover:bg-emerald-50" : "text-amber-500 hover:bg-amber-50"}`}
          >
            {item.isSuspended ? <ShieldCheck size={16} /> : <Ban size={16} />}
          </button>
          <button
            onClick={() => handleQuickDelete(item.id)}
            className="p-2 cursor-pointer rounded-lg border border-slate-200 text-rose-400 hover:bg-rose-50 hover:text-rose-600 transition-colors"
          >
            <Trash2 size={16} />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="p-4 space-y-8 mx-auto ">
      <div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">
          System Overview
        </h1>
        <p className="text-sm font-medium text-slate-500">
          Real-time statistics and recently joined members.
        </p>
      </div>

      <AdminStat />

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-6 py-5 bg-slate-50/50 border-b border-slate-100 flex items-center justify-between">
          <h3 className="text-sm font-black uppercase tracking-widest text-slate-800 flex items-center gap-2">
            Recently Registered{" "}
            <span className="text-blue-600 bg-blue-100 px-2 py-0.5 rounded-full text-[10px]">
              Latest 5
            </span>
          </h3>
        </div>

        <CommonTable
          columns={columns}
          data={recentUsers}
          // isLoading={isLoading}
        />
      </div>

      <UserViewModal
        userId={selectedUserId}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedUserId("");
        }}
      />
    </div>
  );
};

export default AdminOverview;
