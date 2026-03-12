/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search, Eye, Edit, Trash2, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { Column } from "@/main/user/_components/CustomTable";
import CommonTable from "@/main/user/_components/CustomTable";
import { useNavigate } from "react-router";
import Swal from "sweetalert2";
import { useGetSellerRecentAdsQuery } from "@/redux/fetures/users.api";
import { useDeleteAdMutation } from "@/redux/fetures/ads.api";
import ViewAdDialog from "../../ads/allAds/_components/ViewAdDialogProps";

interface AdData {
  id: string;
  title: string;
  price: number;
  createdAt: string;
  isSold: boolean;
  images: { url: string }[];
  category: { name: string };
  description?: string;
}

const RecentAds = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");

  // --- View Dialog States ---
  const [selectedAd, setSelectedAd] = useState<AdData | null>(null);
  const [isViewOpen, setIsViewOpen] = useState(false);

  // --- Real API Hook ---
  const { data, isLoading, isFetching } = useGetSellerRecentAdsQuery({
    search,
  });
  const [deleteAd] = useDeleteAdMutation();

  const adsList = data?.data || [];

  // --- Handlers ---
  const handleOpenView = (ad: AdData) => {
    setSelectedAd(ad);
    setIsViewOpen(true);
  };

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
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
      <div className="p-5 flex flex-wrap items-center justify-between gap-4 border-b border-slate-50">
        <div className="flex flex-wrap items-center gap-3">
          <h2 className="text-xl font-bold text-slate-800 tracking-tight">
            Recent Ads
          </h2>

          <div className="relative w-full sm:w-80">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              size={16}
            />
            <Input
              placeholder="Search by title..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 h-10 bg-slate-50 border-slate-200 focus-visible:ring-2 focus-visible:ring-[#0064AE]/20 focus-visible:border-[#0064AE]"
            />
          </div>
        </div>

        <Button
          onClick={() => navigate("/seller/dashboard/ads/create")}
          className="bg-[#0064AE] hover:bg-[#004e8a] cursor-pointer text-white px-6 py-5 rounded-xl flex items-center gap-2 font-bold transition-all active:scale-95 shadow-lg shadow-blue-100"
        >
          Post New <Plus size={20} strokeWidth={2.5} />
        </Button>
      </div>

      <div className="min-h-[300px] relative">
        {isLoading || isFetching ? (
          <div className="absolute inset-0 flex items-center justify-center bg-white/50 z-10">
            <Loader2 className="animate-spin text-blue-600" size={30} />
          </div>
        ) : (
          <CommonTable columns={columns} data={adsList} />
        )}
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

export default RecentAds;
