/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search, Eye, Edit, Trash2, Filter, Loader2, RotateCcw, CheckCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import type { Column } from "@/main/user/_components/CustomTable";
import CommonTable from "@/main/user/_components/CustomTable";
import CommonPagination from "@/main/user/_components/CommonPagination";
import { useNavigate } from "react-router";
// import { toast } from "react-toastify";
import Swal from "sweetalert2";
import { useDeleteAdMutation, useToggleSoldStatusMutation } from "@/redux/fetures/ads.api"; // delete ad common hote pare
import { useGetMyAdsQuery } from "@/redux/fetures/users.api";
import ViewAdDialog from "./ViewAdDialogProps";
import { toast } from "react-toastify";

interface AdData {
  id: string;
  title: string;
  price: number;
  createdAt: string;
  isSold: boolean;
  images: { url: string }[];
  category: { name: string };
  description?: string;
  city?: string;
  state?: string;
}

const AllAds = () => {
  const navigate = useNavigate();

  // --- States ---
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [selectedAd, setSelectedAd] = useState<AdData | null>(null);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const limit = 8;

  // --- API Fetching (Using useGetMyAdsQuery as requested) ---
  const { data, isLoading, isFetching } = useGetMyAdsQuery({
    page,
    limit,
    search: search || undefined,
    // Note: Backend-e isSold filter query-te handle na thakle eita active hobe na,
    // kintu standard practice hisebe eivabe pathano jay.
  });
console.log(data, "ok");
  const [deleteAd] = useDeleteAdMutation();
const [toggleSold] = useToggleSoldStatusMutation();

const handleToggleSold = async (adId: string, currentStatus: boolean) => {
  const result = await Swal.fire({
    title: "Are you sure?",
    text: currentStatus
      ? "Do you want to mark this item as AVAILABLE?"
      : "Do you want to mark this item as SOLD?",
    icon: "question",
    showCancelButton: true,
    confirmButtonColor: currentStatus ? "#0064AE" : "#10b981", // Available হলে Blue, Sold হলে Green
    cancelButtonColor: "#64748b",
    confirmButtonText: currentStatus
      ? "Yes, make it available!"
      : "Yes, mark as sold!",
    background: "#fff",
    customClass: {
      popup: "rounded-[24px]",
      confirmButton:
        "rounded-xl px-6 py-2.5 text-xs font-black uppercase tracking-widest",
      cancelButton:
        "rounded-xl px-6 py-2.5 text-xs font-black uppercase tracking-widest",
    },
  });

  if (result.isConfirmed) {
    try {
      const res = await toggleSold(adId).unwrap();
      if (res.success) {
        toast.success(res.message);
      }
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to update status");
    }
  }
};

  // Data structure according to your NestJS backend response
  const adsList = (data as any)?.data || [];
  const meta = (data as any)?.meta;
  const totalPages = meta?.lastPage || 1;

  // --- Handlers ---
const handleDelete = async (id: string) => {
  const result = await Swal.fire({
    title: "Are you sure?",
    text: "You won't be able to revert this!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#0064AE", 
    cancelButtonColor: "#ef4444",
    confirmButtonText: "Yes, delete it!",
    cancelButtonText: "Cancel",
    customClass: {
      popup: "rounded-2xl",
      confirmButton: "rounded-xl px-6 py-3",
      cancelButton: "rounded-xl px-6 py-3",
    },
  });

  if (result.isConfirmed) {
    try {
      await deleteAd(id).unwrap();
      await Swal.fire({
        title: "Deleted!",
        text: "Your ad has been removed successfully.",
        icon: "success",
        timer: 2000,
        showConfirmButton: false,
        customClass: {
          popup: "rounded-2xl",
        },
      });

    } catch (err: any) {
      Swal.fire({
        title: "Error!",
        text: err?.data?.message || "Failed to delete ad",
        icon: "error",
        confirmButtonColor: "#0064AE",
        customClass: {
          popup: "rounded-2xl",
        },
      });
    }
  }
};

  const handleOpenView = (ad: AdData) => {
    setSelectedAd(ad);
    setIsViewOpen(true);
  };

const columns: Column<AdData>[] = [
  {
    header: "Serial ID",
    render: (item) => (
      <span className="text-xs text-slate-400 font-mono bg-slate-50 px-2 py-1 rounded">
        #{item.id.slice(-6).toUpperCase()}
      </span>
    ),
  },
  {
    header: "Ads Title",
    render: (item) => (
      <div className="flex items-center gap-3">
        <img
          src={item.images?.[0]?.url || "https://via.placeholder.com/150"}
          alt=""
          className="w-12 h-12 rounded-lg object-cover border border-slate-100 shadow-sm"
        />
        <div className="flex flex-col">
          <span className="font-bold text-slate-800 line-clamp-1 max-w-[180px]">
            {item.title}
          </span>
          <span className="text-[10px] text-blue-600 font-bold uppercase tracking-wider">
            {item.category?.name || "General"}
          </span>
        </div>
      </div>
    ),
  },
  {
    header: "Price",
    render: (item) => (
      <span className="font-bold text-slate-900">
        ${item.price?.toLocaleString()}
      </span>
    ),
  },
  {
    header: "Views",
    render: (item) => (
      <div className="flex items-center gap-1.5 px-3 py-1 bg-slate-50 rounded-full w-fit">
        <Eye size={14} className="text-blue-500" />
        <span className="text-sm font-semibold text-slate-700">
          {(item as any).viewerIds.length || 0}
        </span>
      </div>
    ),
  },
  {
    header: "Published",
    render: (item) => (
      <div className="flex flex-col">
        <span className="text-sm text-slate-600 font-medium">
          {new Date(item.createdAt).toLocaleDateString("en-GB")}
        </span>
        <span className="text-[10px] text-slate-400">
          {new Date(item.createdAt).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </span>
      </div>
    ),
  },
  {
    header: "Status",
    render: (item) => (
      <Badge
        className={`px-3 py-1 border-none shadow-none font-bold ${
          !item.isSold
            ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-100"
            : "bg-slate-100 text-slate-500 hover:bg-slate-100"
        }`}
      >
        {!item.isSold ? "Active" : "Sold"}
      </Badge>
    ),
  },
  {
    header: "Action",
    render: (item) => (
      <div className="flex items-center gap-2">
        <button
          onClick={() => handleToggleSold(item.id, item.isSold)}
          title={item.isSold ? "Mark as Available" : "Mark as Sold"}
          className={`p-2 border rounded-xl transition-all cursor-pointer shadow-sm ${
            item.isSold
              ? "text-amber-500 border-amber-100 hover:bg-amber-50"
              : "text-emerald-500 border-emerald-100 hover:bg-emerald-50"
          }`}
        >
          {item.isSold ? <RotateCcw size={16} /> : <CheckCircle size={16} />}
        </button>
        <button
          onClick={() => handleOpenView(item)}
          title="View Details"
          className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 border border-slate-100 rounded-xl transition-all cursor-pointer shadow-sm"
        >
          <Eye size={16} />
        </button>
        <button
          onClick={() => navigate(`/seller/dashboard/ads/edit/${item.id}`)}
          title="Edit Ad"
          className="p-2 text-slate-400 hover:text-green-600 hover:bg-green-50 border border-slate-100 rounded-xl transition-all cursor-pointer shadow-sm"
        >
          <Edit size={16} />
        </button>
        <button
          onClick={() => handleDelete(item.id)}
          title="Delete Ad"
          className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 border border-slate-100 rounded-xl transition-all cursor-pointer shadow-sm"
        >
          <Trash2 size={16} />
        </button>
      </div>
    ),
  },
];

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
        {/* Top Controls */}
        <div className="p-6 border-b border-slate-50">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="flex flex-col gap-1">
              <h1 className="text-2xl font-black text-slate-900 tracking-tight">
                Manage My Ads
              </h1>
              <p className="text-sm text-slate-500">
                View and manage your personal inventory of ads.
              </p>
            </div>

            <Button
              onClick={() => navigate("/seller/dashboard/ads/create")}
              className="bg-[#0064AE] hover:bg-[#005596] text-white px-8 h-12 cursor-pointer rounded-2xl font-bold shadow-lg shadow-blue-100 flex gap-2"
            >
              <Plus size={20} strokeWidth={3} /> Post New Ad
            </Button>
          </div>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <div className="relative flex-1 min-w-[300px]">
              <Search
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                size={18}
              />
              <Input
                placeholder="Search your ads..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                className="pl-12 h-12 bg-slate-50 border-slate-200 rounded-2xl focus-visible:ring-blue-600/20"
              />
            </div>

            <div className="flex items-center gap-2">
              <div className="bg-slate-100 p-3 rounded-xl">
                <Filter size={18} className="text-slate-600" />
              </div>
              <Select
                value={statusFilter}
                onValueChange={(v) => {
                  setStatusFilter(v);
                  setPage(1);
                }}
              >
                <SelectTrigger className="w-[180px] !h-12 rounded-2xl bg-white border-slate-200 font-medium">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active Only</SelectItem>
                  <SelectItem value="closed">Sold/Closed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="bg-white min-h-[400px]">
          {isLoading || isFetching ? (
            <div className="flex justify-center items-center py-40">
              <Loader2 className="animate-spin text-blue-600" size={40} />
            </div>
          ) : (
            <>
              <CommonTable columns={columns} data={adsList} />
              {adsList.length === 0 && (
                <div className="py-20 text-center flex flex-col items-center gap-4">
                  <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center">
                    <Search size={32} className="text-slate-200" />
                  </div>
                  <p className="text-slate-400 font-medium">
                    No ads found in your account.
                  </p>
                </div>
              )}
            </>
          )}
        </div>

        {/* Pagination Section */}
        <div className="p-6 bg-slate-50/50 border-t border-slate-100">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
           
            <CommonPagination
              currentPage={page}
              totalPages={totalPages || 1}
              onPageChange={(p) => setPage(p)}
            />
          </div>
        </div>
      </div>

      {/* --- View Details Dialog --- */}
      <ViewAdDialog
        isOpen={isViewOpen}
        onOpenChange={setIsViewOpen}
        ad={selectedAd}
        onEdit={(id) => navigate(`/seller/dashboard/ads/edit/${id}`)}
      />
    </div>
  );
};

export default AllAds;
