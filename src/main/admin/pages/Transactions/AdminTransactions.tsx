/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useState } from "react";
import {
  Download,
  Search,
  Filter,
  Eye,
  Layers,
  Rocket,
  Zap,
  ShieldCheck,
  ShieldAlert,
} from "lucide-react";
import CommonTable, { type Column } from "@/main/user/_components/CustomTable";
import CommonPagination from "@/main/user/_components/CommonPagination";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import {
  useGetAllPaymentHistoryQuery,
  useGetAllBoostHistoryQuery,
} from "@/redux/fetures/admin/pay-for-subsc";
import SubscriptionViewModal from "./_components/SubscriptionViewModal";
import BoostViewModal from "./_components/BoostViewModal";
// import BoostViewModal from "./_components/BoostViewModal";

const AdminTransactions = () => {
  const [activeTab, setActiveTab] = useState<"SUBS" | "BOOSTS">("SUBS");
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [isViewOpen, setIsViewOpen] = useState(false);

  // --- API Integration ---
  const { data: subsRes } = useGetAllPaymentHistoryQuery(undefined);
  const { data: boostRes } = useGetAllBoostHistoryQuery(undefined);

  const subTransactions = subsRes?.data || [];
  const boostTransactions = boostRes?.data || [];

  // --- PDF Generator for Subscriptions ---
  const handleDownloadPDF = (item: any) => {
    const doc = new jsPDF();
    const brandColor = [0, 100, 174];
    doc.setFontSize(22);
    doc.setTextColor(brandColor[0], brandColor[1], brandColor[2]);
    doc.text("PAYMENT INVOICE", 14, 20);

    autoTable(doc, {
      startY: 45,
      head: [["Description", "Details"]],
      body: [
        ["Seller", `${item.seller.firstName} ${item.seller.lastName}`],
        ["Plan", item.plan.name],
        ["Price", `${item.plan.price} PLN`],
        ["Transaction ID", item.transactionId],
        ["Date", new Date(item.createdAt).toLocaleDateString()],
      ],
      headStyles: { fillColor: brandColor } as any,
    });
    doc.save(`Invoice_${item.transactionId.slice(0, 8)}.pdf`);
  };

  // --- Column Definitions: Subscriptions ---
  const subColumns: Column<any>[] = [
    {
      header: "Seller",
      render: (item) => (
        <div className="flex items-center gap-3">
          {/* Profile Picture with Verification Badge */}
          <div className="relative shrink-0">
            <img
              src={
                item.seller.profilePicture ||
                `https://api.dicebear.com/7.x/initials/svg?seed=${item.seller.firstName}`
              }
              className="w-10 h-10 rounded-xl object-cover border border-slate-100 shadow-sm"
            />
            <div
              className={`absolute -right-1 -bottom-1 p-0.5 rounded-full border-2 border-white ${
                item.seller.isVerified ? "bg-blue-500" : "bg-amber-500"
              }`}
            >
              {item.seller.isVerified ? (
                <ShieldCheck size={10} className="text-white" />
              ) : (
                <ShieldAlert size={10} className="text-white" />
              )}
            </div>
          </div>

          <div>
            <p className="font-bold text-slate-900 leading-none">
              {item.seller.firstName} {item.seller.lastName}
            </p>
            <p className="text-[10px] text-slate-400 mt-1">
              {item.seller.email}
            </p>
          </div>
        </div>
      ),
    },
    {
      header: "Plan",
      render: (item) => (
        <span className="font-black text-[#0064AE] text-xs uppercase tracking-wider">
          {item.plan.name}
        </span>
      ),
    },
    {
      header: "Charges",
      render: (item) => (
        <span className="font-bold text-slate-900">{item.totalSpent || 0} PLN</span>
      ),
    },
    {
      header: "Date",
      render: (item) => (
        <div className="leading-tight">
          <p className="font-semibold text-slate-700 text-xs">
            {new Date(item.createdAt).toLocaleDateString()}
          </p>
          <p className="text-[9px] text-slate-400 uppercase font-bold">
            {new Date(item.createdAt).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>
        </div>
      ),
    },
    {
      header: "Status",
      render: (item) => (
        <span
          className={`px-2.5 py-1 rounded text-[10px] font-black border uppercase ${item.status === "ACTIVE" ? "bg-emerald-50 text-emerald-700 border-emerald-100" : "bg-amber-50 text-amber-700 border-amber-100"}`}
        >
          {item.status}
        </span>
      ),
    },
    {
      header: "Action",
      render: (item) => (
        <div className="flex gap-2">
          <button
            onClick={() => {
              setSelectedItem(item);
              setIsViewOpen(true);
            }}
            className="p-2 border border-slate-200 rounded-lg text-slate-400 hover:text-[#0064AE] cursor-pointer"
          >
            <Eye size={14} />
          </button>
          <button
            onClick={() => handleDownloadPDF(item)}
            className="p-2 border border-slate-200 rounded-lg text-slate-400 hover:text-[#0064AE] cursor-pointer"
          >
            <Download size={14} />
          </button>
        </div>
      ),
    },
  ];

  // --- Column Definitions: Boosts ---
  const boostColumns: Column<any>[] = [
    {
      header: "Seller",
      render: (item) => (
        <div className="flex items-center gap-3">
          {/* Profile Picture with Verification Badge */}
          <div className="relative shrink-0">
            <img
              src={
                item.seller.profilePicture ||
                `https://api.dicebear.com/7.x/initials/svg?seed=${item.seller.firstName}`
              }
              className="w-10 h-10 rounded-xl object-cover border border-slate-100 shadow-sm"
            />
            <div
              className={`absolute -right-1 -bottom-1 p-0.5 rounded-full border-2 border-white ${
                item.seller.isVerified ? "bg-blue-500" : "bg-amber-500"
              }`}
            >
              {item.seller.isVerified ? (
                <ShieldCheck size={10} className="text-white" />
              ) : (
                <ShieldAlert size={10} className="text-white" />
              )}
            </div>
          </div>

          <div>
            <p className="font-bold text-slate-900 leading-none">
              {item.seller.firstName} {item.seller.lastName}
            </p>
            <p className="text-[10px] text-slate-400 mt-1">
              {item.seller.email}
            </p>
          </div>
        </div>
      ),
    },
    {
      header: "Package",
      render: (item) => (
        <div className="flex items-center gap-1.5">
          <Zap size={12} className="text-amber-500 fill-amber-500" />
          <span className="font-black text-amber-600 text-xs uppercase">
            {item.package.name}
          </span>
        </div>
      ),
    },
    {
      header: "Target Ad",
      render: (item) => (
        <p className="text-xs font-medium text-slate-600 line-clamp-1 max-w-[150px]">
          {item.ad.title}
        </p>
      ),
    },
    {
      header: "Price",
      render: (item) => (
        <span className="font-bold text-slate-900">
          {item.package.price} PLN
        </span>
      ),
    },
    {
      header: "Status",
      render: (item) => (
        <span
          className={`px-2 py-0.5 rounded text-[9px] font-black border uppercase ${item.status === "ACTIVE" ? "bg-amber-50 text-amber-700 border-amber-100" : "bg-slate-50 text-slate-400"}`}
        >
          {item.status}
        </span>
      ),
    },
    {
      header: "Action",
      render: (item) => (
        <button
          onClick={() => {
            setSelectedItem(item);
            setIsViewOpen(true);
          }}
          className="p-2 border border-slate-200 rounded-lg text-slate-400 hover:text-amber-600 cursor-pointer"
        >
          <Eye size={14} />
        </button>
      ),
    },
  ];

  // --- Filtering Logic ---
  const currentData =
    activeTab === "SUBS" ? subTransactions : boostTransactions;
  const filteredData = currentData.filter((t: any) =>
    `${t.seller.firstName} ${t.seller.lastName}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="p-6 space-y-6">
      {/* Header & Tabs */}
      <div className="flex flex-col md:flex-row justify-between items-end gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Financial Records
          </h1>
          <div className="flex gap-2 mt-4 bg-slate-100 p-1 rounded-2xl w-fit border border-slate-200">
            <button
              onClick={() => {
                setActiveTab("SUBS");
                setSearchTerm("");
              }}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-black transition-all ${activeTab === "SUBS" ? "bg-white text-[#0064AE] shadow-sm" : "text-slate-500 hover:text-slate-700"}`}
            >
              <Layers size={16} /> SUBSCRIPTIONS
            </button>
            <button
              onClick={() => {
                setActiveTab("BOOSTS");
                setSearchTerm("");
              }}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-black transition-all ${activeTab === "BOOSTS" ? "bg-white text-amber-600 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}
            >
              <Rocket size={16} /> AD BOOSTS
            </button>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:flex-none">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              size={16}
            />
            <input
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by seller name..."
              className="pl-10 pr-4 py-2 text-sm bg-white border border-slate-200 rounded-xl w-full md:w-64 focus:ring-2 focus:ring-blue-500/20 outline-none"
            />
          </div>
          <button className="p-2.5 bg-white border border-slate-200 rounded-xl text-slate-500 hover:bg-slate-50 cursor-pointer">
            <Filter size={18} />
          </button>
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden">
        <CommonTable
          columns={activeTab === "SUBS" ? subColumns : boostColumns}
          data={filteredData}
        />
        <div className="p-6 bg-slate-50/50 border-t border-slate-50">
          <CommonPagination
            currentPage={currentPage}
            totalPages={1}
            onPageChange={setCurrentPage}
          />
        </div>
      </div>

      {/* Dynamic Modals */}
      {activeTab === "SUBS" ? (
        <SubscriptionViewModal
          isOpen={isViewOpen}
          onClose={() => setIsViewOpen(false)}
          transaction={selectedItem}
        />
      ) : (
        <BoostViewModal
          isOpen={isViewOpen}
          onClose={() => setIsViewOpen(false)}
          boost={selectedItem}
        />
      )}
    </div>
  );
};

export default AdminTransactions;
