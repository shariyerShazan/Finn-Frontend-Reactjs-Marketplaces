// /* eslint-disable @typescript-eslint/no-explicit-any */
// import { useState } from "react";
// import { Input } from "@/components/ui/input";
// import { Search, Download, Eye, Loader2, CheckCircle2 } from "lucide-react";
// import { Badge } from "@/components/ui/badge";
// import type { Column } from "@/main/user/_components/CustomTable";
// import moment from "moment";
// import { useGetMyEarningsQuery } from "@/redux/fetures/users.api";
// import { generatePrettyInvoice } from "./generatePrettyInvoice";
// import CommonTable from "@/main/user/_components/CustomTable";
// import CommonPagination from "@/main/user/_components/CommonPagination";
// import PaymentDetailsDialog from "./PaymentDetailsDialog";
// // import PaymentDetailsDialog from "./PaymentDetailsDialog";

// const BillingHistory = () => {
//   const [search, setSearch] = useState("");
//   const [page, setPage] = useState(1);
//   const [selectedPayment, setSelectedPayment] = useState<any>(null);
//   const [isDialogOpen, setIsDialogOpen] = useState(false);

//   const limit = 6;

//   const { data: response, isLoading } = useGetMyEarningsQuery({
//     page,
//     limit,
//   });

//   const billingData = response?.data || [];
//   const totalPages = response?.meta?.totalPages || 1;

//   const handleView = (item: any) => {
//     setSelectedPayment(item);
//     setIsDialogOpen(true);
//   };

//   const columns: Column<any>[] = [
//     {
//       header: "Verified",
//       render: () => (
//         <div className="flex justify-center">
//           <CheckCircle2
//             size={18}
//             className="text-emerald-500 bg-emerald-50 rounded-full p-0.5"
//           />
//         </div>
//       ),
//     },
//     {
//       header: "Transaction ID",
//       render: (item) => (
//         <span className="font-mono text-xs font-semibold text-slate-500 bg-slate-50 px-2 py-1 rounded">
//           {item.stripeId.substring(0, 14).toUpperCase()}
//         </span>
//       ),
//     },
//     {
//       header: "Details",
//       render: (item) => (
//         <div className="flex items-center gap-3">
//           <img
//             src={item.ad?.images[0]?.url || "https://via.placeholder.com/40"}
//             alt=""
//             className="w-10 h-10 rounded-lg object-cover border border-slate-100"
//           />
//           <div className="flex flex-col">
//             <span className="text-sm font-bold text-slate-700 truncate max-w-[150px]">
//               {item.ad?.title}
//             </span>
//             <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
//               {item.buyer?.firstName} {item.buyer?.lastName}
//             </span>
//           </div>
//         </div>
//       ),
//     },
//     {
//       header: "Net Earnings",
//       render: (item) => (
//         <div className="flex flex-col">
//           <span className="font-bold text-[#0064AE]">
//             ${item.sellerAmount.toFixed(2)}
//           </span>
//           <span className="text-[10px] text-slate-400 font-medium">
//             Fee: ${item.adminFee.toFixed(2)}
//           </span>
//         </div>
//       ),
//     },
//     {
//       header: "Date",
//       render: (item) => (
//         <div className="flex flex-col">
//           <span className="text-slate-600 text-sm font-medium">
//             {moment(item.createdAt).format("DD MMM YYYY")}
//           </span>
//           <span className="text-[10px] text-slate-400">
//             {moment(item.createdAt).format("hh:mm A")}
//           </span>
//         </div>
//       ),
//     },
//     {
//       header: "Status",
//       render: (item) => (
//         <Badge
//           className={`shadow-none font-bold rounded-full px-3 ${
//             item.status === "COMPLETED"
//               ? "bg-emerald-50 text-emerald-600 border-emerald-100"
//               : "bg-amber-50 text-amber-600 border-amber-100"
//           }`}
//         >
//           {item.status}
//         </Badge>
//       ),
//     },
//     {
//       header: "Action",
//       render: (item) => (
//         <div className="flex items-center gap-2">
//           <button
//             onClick={() => handleView(item)}
//             className="p-2 text-[#0064AE] bg-blue-50 hover:bg-[#0064AE] hover:text-white rounded-xl transition-all duration-300 cursor-pointer shadow-sm shadow-blue-100"
//           >
//             <Eye size={16} />
//           </button>

//           <button
//             onClick={() => generatePrettyInvoice(item)}
//             className="p-2 text-slate-500 bg-slate-50 hover:bg-slate-200 rounded-xl transition-all duration-300 cursor-pointer"
//           >
//             <Download size={16} />
//           </button>
//         </div>
//       ),
//     },
//   ];

//   return (
//     <>
//       <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
//         {/* Header */}
//         <div className="p-6 flex flex-wrap items-center justify-between gap-4 bg-gradient-to-r from-white to-slate-50/50 border-b border-slate-100">
//           <div>
//             <h2 className="text-2xl font-black text-slate-800 tracking-tight">
//               Billing History
//             </h2>
//             <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">
//               Financial Overview
//             </p>
//           </div>

//           <div className="relative w-full sm:w-80">
//             <Search
//               className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300"
//               size={18}
//             />
//             <Input
//               placeholder="Filter by invoice or buyer..."
//               value={search}
//               onChange={(e) => {
//                 setSearch(e.target.value);
//                 setPage(1);
//               }}
//               className="pl-10 h-11 bg-white border-slate-200 rounded-2xl focus-visible:ring-[#0064AE]/10 focus:border-[#0064AE]/30 transition-all"
//             />
//           </div>
//         </div>

//         {/* Table Area */}
//         <div className="min-h-[500px] relative">
//           {isLoading ? (
//             <div className="absolute inset-0 flex items-center justify-center bg-white/60 backdrop-blur-[2px] z-10">
//               <Loader2 className="animate-spin text-[#0064AE]" size={40} />
//             </div>
//           ) : (
//             <CommonTable columns={columns} data={billingData} />
//           )}
//         </div>

//         {/* Footer */}
//         <div className="p-6 bg-slate-50/50 border-t border-slate-100 flex items-center justify-between">
//           <CommonPagination
//             currentPage={page}
//             totalPages={totalPages}
//             onPageChange={(p) => setPage(p)}
//           />
//         </div>
//       </div>

//       {/* Payment Details Dialog */}
//       <PaymentDetailsDialog
//         open={isDialogOpen}
//         onOpenChange={setIsDialogOpen}
//         data={selectedPayment}
//       />
//     </>
//   );
// };

// export default BillingHistory;
