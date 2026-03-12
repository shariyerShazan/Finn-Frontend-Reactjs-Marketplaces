/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Search, Download, Eye, Loader2, ShoppingCart } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { Column } from "@/main/user/_components/CustomTable";
import moment from "moment";
import { useGetMyPurchasesQuery } from "@/redux/fetures/users.api";
import CommonTable from "@/main/user/_components/CustomTable";
import CommonPagination from "@/main/user/_components/CommonPagination";
import PurchaseDetailsDialog from "./_components/PurchaseDetailsDialog";
import { generatePurchaseInvoice } from "./_components/generatePurchaseInvoice";

const SellerPurchases = () => {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [isOpen, setIsOpen] = useState(false);

  const limit = 6;
  const { data: response, isLoading } = useGetMyPurchasesQuery({ page, limit });

  const purchaseData = response?.data || [];
  const totalPages = response?.meta?.totalPages || 1;

  const handleView = (item: any) => {
    setSelectedItem(item);
    setIsOpen(true);
  };

  const columns: Column<any>[] = [
    {
      header: "Type",
      render: () => (
        <div className="flex justify-center">
          <ShoppingCart
            size={18}
            className="text-blue-500 bg-blue-50 rounded-full p-0.5"
          />
        </div>
      ),
    },
    {
      header: "Ad Title",
      render: (item) => (
        <div className="flex items-center gap-3">
          <img
            src={item.ad?.images[0]?.url || "https://via.placeholder.com/40"}
            className="w-10 h-10 rounded-lg object-cover"
            alt=""
          />
          <span className="text-sm font-bold text-slate-700 truncate max-w-[200px]">
            {item.ad?.title}
          </span>
        </div>
      ),
    },
    {
      header: "Total Paid",
      render: (item) => (
        <span className="font-bold text-slate-800">
          ${item.totalAmount.toFixed(2)}
        </span>
      ),
    },
    {
      header: "Purchase Date",
      render: (item) => (
        <div className="flex flex-col text-xs font-medium">
          <span className="text-slate-600">
            {moment(item.createdAt).format("DD MMM YYYY")}
          </span>
          <span className="text-slate-400">
            {moment(item.createdAt).format("hh:mm A")}
          </span>
        </div>
      ),
    },
    {
      header: "Status",
      render: (item) => (
        <Badge className="bg-emerald-50 text-emerald-600 border-emerald-100 shadow-none rounded-full px-3 font-bold">
          {item.status}
        </Badge>
      ),
    },
    {
      header: "Action",
      render: (item) => (
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleView(item)}
            className="p-2 text-blue-600 bg-blue-50 hover:bg-blue-600 hover:text-white rounded-xl transition-all cursor-pointer"
          >
            <Eye size={16} />
          </button>
          <button
            onClick={() => generatePurchaseInvoice(item)}
            className="p-2 text-slate-400 bg-slate-50 hover:bg-slate-200 rounded-xl transition-all cursor-pointer"
          >
            <Download size={16} />
          </button>
        </div>
      ),
    },
  ];

  return (
    <>
      <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
        <div className="p-6 flex flex-wrap items-center justify-between gap-4 border-b border-slate-50">
          <div>
            <h2 className="text-2xl font-black text-slate-800">My Purchases</h2>
            <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">
              Order History
            </p>
          </div>
          <div className="relative w-full sm:w-80">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300"
              size={18}
            />
            <Input
              placeholder="Search orders..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="pl-10 h-11 bg-slate-50 border-none rounded-2xl focus-visible:ring-blue-100"
            />
          </div>
        </div>

        <div className="min-h-[500px] relative">
          {isLoading ? (
            <div className="absolute inset-0 flex items-center justify-center bg-white/60 z-10">
              <Loader2 className="animate-spin text-blue-600" size={40} />
            </div>
          ) : (
            <CommonTable columns={columns} data={purchaseData} />
          )}
        </div>

        <div className="p-6 bg-slate-50/50 border-t border-slate-100 flex items-center justify-between">
          <CommonPagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={(p) => setPage(p)}
          />
        </div>
      </div>

      <PurchaseDetailsDialog
        open={isOpen}
        onOpenChange={setIsOpen}
        data={selectedItem}
      />
    </>
  );
};

export default SellerPurchases;
