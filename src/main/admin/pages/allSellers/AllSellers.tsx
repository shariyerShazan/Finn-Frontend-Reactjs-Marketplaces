/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import CommonPagination from "@/main/user/_components/CommonPagination";
import CommonTable, { type Column } from "@/main/user/_components/CustomTable";
import {
  Eye,
  Search,
  Loader2,
  Ban,
  Trash2,
  ShieldCheck,
  Filter,
  ShieldAlert,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  useGetUsersQuery,
  useDeleteSellerMutation,
  useToggleSuspensionMutation,
} from "@/redux/fetures/admin/admin.api";
import SellerViewModal from "./_components/ViewSellerD";
import { toast } from "react-toastify";
import Swal from "sweetalert2";

const AllSellers = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const [selectedSeller, setSelectedSeller] = useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  // RTK Query Fetching
  const {
    data: response,
    isLoading,
    isError,
  } = useGetUsersQuery({
    page: currentPage,
    limit: 10,
    role: "SELLER",
    search: searchTerm,
    isSuspended:
      statusFilter === "Suspended"
        ? "true"
        : statusFilter === "Active"
          ? "false"
          : undefined,
  });

  const [deleteSeller] = useDeleteSellerMutation();
  const [toggleSuspension] = useToggleSuspensionMutation();

  const sellers = response?.data?.result || response?.data || [];
  const meta = response?.data?.meta || response?.meta;

  const handleQuickDelete = async (id: string) => {
    Swal.fire({
      title: "Are you sure?",
      text: "This seller will be permanently deleted!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#e11d48", // rose-600
      cancelButtonColor: "#64748b", // slate-500
      confirmButtonText: "Yes, delete it!",
      customClass: {
        popup: "rounded-xl",
      },
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await deleteSeller(id).unwrap();
          Swal.fire({
            title: "Deleted!",
            text: "Seller has been removed.",
            icon: "success",
            timer: 1500,
            showConfirmButton: false,
            customClass: { popup: "rounded-xl" },
          });
        } catch (err) {
          console.log(err)
          toast.error("Operation failed.");
        }
      }
    });
  };

  const handleQuickSuspension = async (
    id: string,
    isCurrentlySuspended: boolean,
  ) => {
    if (isCurrentlySuspended) {
      // সরাসরি এক্টিভেট করার জন্য
      Swal.fire({
        title: "Reactivate Account?",
        text: "This seller will gain access again.",
        icon: "question",
        showCancelButton: true,
        confirmButtonColor: "#10b981", // emerald-500
        confirmButtonText: "Yes, activate!",
        customClass: { popup: "rounded-xl" },
      }).then(async (result) => {
        if (result.isConfirmed) {
          try {
            await toggleSuspension({ userId: id, reason: "" }).unwrap();
            toast.success("Account Restored");
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
        inputLabel: "Why are you suspending this seller?",
        inputPlaceholder: "Enter reason here...",
        inputAttributes: { "aria-label": "Enter reason" },
        showCancelButton: true,
        confirmButtonColor: "#f59e0b",
        confirmButtonText: "Suspend Now",
        customClass: { popup: "rounded-xl" },
        inputValidator: (value) => {
          if (!value) return "You need to provide a reason!";
        },
      });

      if (reason) {
        try {
          await toggleSuspension({ userId: id, reason }).unwrap();
          toast.success("Account Suspended");
        } catch (err) {
          console.log(err);
          toast.error("Action failed");
        }
      }
    }
  };
  const columns: Column<any>[] = [
    {
      header: "Identity",
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
            <span className="font-bold text-slate-800 block text-sm leading-tight">
              {item.nickName}
            </span>
            <span className="text-[10px] text-slate-400 font-semibold uppercase">
              {new Date(item.createdAt).toLocaleDateString()}
            </span>
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
        <span className="text-xs font-medium text-slate-600 lowercase tracking-tight">
          {item.email}
        </span>
      ),
    },
    {
      header: "Admin Verification",
      render: (item) => (
        <div className="flex items-center gap-1.5">
          {item.isSeller ? (
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
      header: "Actions",
      render: (item) => (
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              setSelectedSeller(item.id);
              setIsModalOpen(true);
            }}
            className="p-2 cursor-pointer rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-400 hover:text-blue-600 transition-colors"
            title="View Details"
          >
            <Eye size={16} />
          </button>
          <button
            onClick={() => handleQuickSuspension(item.id, item.isSuspended)}
            className={`p-2 cursor-pointer rounded-lg border border-slate-200 transition-colors ${item.isSuspended ? "text-emerald-500 hover:bg-emerald-50" : "text-amber-500 hover:bg-amber-50"}`}
            title={item.isSuspended ? "Activate" : "Suspend"}
          >
            {item.isSuspended ? <ShieldCheck size={16} /> : <Ban size={16} />}
          </button>
          <button
            onClick={() => handleQuickDelete(item.id)}
            className="p-2 cursor-pointer rounded-lg border border-slate-200 text-rose-400 hover:bg-rose-50 hover:text-rose-600 transition-colors"
            title="Delete"
          >
            <Trash2 size={16} />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="p-4 space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-slate-800 tracking-tight">
          Seller Management
        </h2>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        {/* Search & Filter Header */}
        <div className="p-4 border-b border-slate-100 flex flex-col md:flex-row gap-4 justify-between bg-slate-50/30">
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search
                size={14}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                type="text"
                placeholder="Search sellers..."
                className="pl-9 pr-4 py-1.5 bg-white border border-slate-200 rounded-lg text-sm w-full md:w-64 focus:outline-none focus:ring-2 focus:ring-blue-500/10 transition-all"
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="flex items-center bg-white border border-slate-200 rounded-lg px-2">
              <Filter size={14} className="text-slate-400" />
              <Select onValueChange={setStatusFilter} defaultValue="all">
                <SelectTrigger className="w-[110px] border-none shadow-none text-xs font-bold h-8 focus:ring-0">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="Suspended">Suspended</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Table Body */}
        {isLoading ? (
          <div className="py-20 flex justify-center">
            <Loader2 className="animate-spin text-blue-500" size={32} />
          </div>
        ) : isError ? (
          <div className="py-10 text-center text-rose-500 font-medium">
            Failed to load seller data.
          </div>
        ) : (
          <CommonTable columns={columns} data={sellers} />
        )}

        {/* Pagination Footer */}
        <div className="p-4 border-t border-slate-100 bg-slate-50/30 flex justify-center">
          <CommonPagination
            currentPage={currentPage}
            totalPages={meta?.totalPage || 1}
            onPageChange={setCurrentPage}
          />
        </div>
      </div>

      <SellerViewModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        userId={selectedSeller}
      />
    </div>
  );
};

export default AllSellers;
