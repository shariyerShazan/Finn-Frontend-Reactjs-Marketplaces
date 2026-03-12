/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useState } from "react";
import {
  Download,
  Search,
  ChevronDown,
  Filter,
  Eye,
  // Loader2,
} from "lucide-react";
import CommonTable, { type Column } from "@/main/user/_components/CustomTable";
import CommonPagination from "@/main/user/_components/CommonPagination";
// import { useGetAllPaymentHistoryQuery } from "@/redux/features/payment/payment.api";
// import SubscriptionViewModal from "../_components/SubscriptionViewModal";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { useGetAllPaymentHistoryQuery } from "@/redux/fetures/admin/pay-for-subsc";
import SubscriptionViewModal from "./_components/SubscriptionViewModal";

const AdminTransactions = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTransaction, setSelectedTransaction] = useState<any>(null);
  const [isViewOpen, setIsViewOpen] = useState(false);

  // --- API Integration ---
  const { data: response} = useGetAllPaymentHistoryQuery(undefined);
  const transactions = response?.data || [];
console.log(response);
  // --- PDF Generator Function ---
  const handleDownloadPDF = (item: any) => {
    const doc = new jsPDF();
    const brandColor = [0, 100, 174]; // #0064AE

    // Invoice Header
    doc.setFontSize(22);
    doc.setTextColor(brandColor[0], brandColor[1], brandColor[2]);
    doc.text("PAYMENT INVOICE", 14, 20);

    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text(`Transaction ID: ${item.transactionId}`, 14, 30);
    doc.text(`Date: ${new Date(item.createdAt).toLocaleDateString()}`, 14, 35);

    // Data Table
    autoTable(doc, {
      startY: 45,
      head: [["Description", "Details"]],
      body: [
        ["Seller Name", `${item.seller.firstName} ${item.seller.lastName}`],
        ["Seller Email", item.seller.email],
        ["Plan Name", item.plan.name],
        ["Price Paid", `${item.plan.price} PLN`],
        ["Ad Limit", `${item.postsRemaining} Posts`],
        ["Valid Until", new Date(item.endDate).toLocaleDateString()],
        ["Status", item.status],
      ],
      headStyles: { fillColor: brandColor } as any,
      theme: "striped",
    });

    doc.save(`Invoice_${item.transactionId.slice(0, 8)}.pdf`);
  };

  // --- Table Columns ---
  const columns: Column<any>[] = [
    {
      header: "Seller",
      render: (item) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded bg-blue-50 text-[#0064AE] flex items-center justify-center font-black text-xs border border-blue-100 uppercase">
            {item.seller.firstName[0]}
            {item.seller.lastName[0]}
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
        <span className="font-bold text-slate-900">{item.plan.price} PLN</span>
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
          className={`px-2.5 py-1 rounded text-[10px] font-black border uppercase ${
            item.status === "COMPLETED" || item.status === "ACTIVE"
              ? "bg-emerald-50 text-emerald-700 border-emerald-100"
              : "bg-amber-50 text-amber-700 border-amber-100"
          }`}
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
              setSelectedTransaction(item);
              setIsViewOpen(true);
            }}
            className="p-2 bg-white border border-slate-200 rounded-lg text-slate-400 hover:text-[#0064AE] hover:border-blue-100 transition-all cursor-pointer"
          >
            <Eye size={14} />
          </button>
          <button
            onClick={() => handleDownloadPDF(item)}
            className="p-2 bg-white border border-slate-200 rounded-lg text-slate-400 hover:text-[#0064AE] hover:border-blue-100 transition-all cursor-pointer"
          >
            <Download size={14} />
          </button>
        </div>
      ),
    },
  ];

  // ফিল্টারিং লজিক (Search)
  const filteredData = transactions.filter(
    (t: any) =>
      `${t.seller.firstName} ${t.seller.lastName}`
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      t.transactionId.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="p-4">
      <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-sm mx-auto">
        {/* Header Bar */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
          <div>
            <h1 className="text-xl font-black text-slate-900 tracking-tight">
              Transactions History
            </h1>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">
              Audit Log Management
            </p>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="relative group flex-1 md:flex-none">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#0064AE] transition-colors"
                size={16}
              />
              <input
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by Seller or ID..."
                className="pl-10 pr-4 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl w-full md:w-64 focus:outline-none focus:ring-2 focus:ring-[#0064AE40] focus:bg-white transition-all"
              />
            </div>
            <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-50 transition-all cursor-pointer">
              <Filter size={14} />
              Filter <ChevronDown size={14} />
            </button>
          </div>
        </div>

        {/* Main Table */}
        <div className="overflow-hidden rounded-2xl border border-slate-100">
          <CommonTable columns={columns} data={filteredData} />
        </div>

        {/* Pagination Footer */}
        <div className="mt-4 border-t border-slate-50 pt-4">
          <CommonPagination
            currentPage={currentPage}
            totalPages={1}
            onPageChange={setCurrentPage}
          />
        </div>
      </div>

      {/* View Detail Modal */}
      <SubscriptionViewModal
        isOpen={isViewOpen}
        onClose={() => setIsViewOpen(false)}
        transaction={selectedTransaction} 
      />
    </div>
  );
};

export default AdminTransactions;
