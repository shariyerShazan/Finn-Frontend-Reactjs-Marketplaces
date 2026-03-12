// /* eslint-disable react-hooks/set-state-in-effect */
// /* eslint-disable @typescript-eslint/no-explicit-any */
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
// } from "@/components/ui/dialog";
// import { Badge } from "@/components/ui/badge";
// import { Separator } from "@/components/ui/separator";
// import {
//   Calendar,
//   Hash,
//   User,
//   Tag,
//   CreditCard,
//   Receipt,
//   Download,
// } from "lucide-react";
// import moment from "moment";
// import { useState, useEffect } from "react";
// import { generatePrettyInvoice } from "./generatePrettyInvoice";

// const PaymentDetailsDialog = ({ open, onOpenChange, data }: any) => {
//   const [activeImage, setActiveImage] = useState<string>("");

//   useEffect(() => {
//     if (data?.ad?.images?.length > 0) {
//       setActiveImage(data.ad.images[0].url);
//     }
//   }, [data, open]);

//   if (!data) return null;

//   const infoItems = [
//     {
//       label: "Transaction ID",
//       value: data.stripeId.substring(0, 18) + "...",
//       icon: Hash,
//     },
//     {
//       label: "Date",
//       value: moment(data.createdAt).format("DD MMM YYYY, hh:mm A"),
//       icon: Calendar,
//     },
//     {
//       label: "Buyer",
//       value: `${data.buyer?.firstName} ${data.buyer?.lastName}`,
//       icon: User,
//     },
//     { label: "Category", value: data.ad?.category?.name || "N/A", icon: Tag },
//   ];

//   return (
//     <Dialog open={open} onOpenChange={onOpenChange}>
//       <DialogContent className="max-w-md p-0 overflow-hidden border-none bg-white rounded-[32px] shadow-2xl">
//         {/* Top Gradient Bar */}
//         <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-[#0064AE] via-blue-400 to-cyan-300" />

//         <DialogHeader className="p-8 pb-4">
//           <div className="flex justify-between items-start">
//             <div className="space-y-1">
//               <DialogTitle className="text-2xl font-black text-slate-900 tracking-tight">
//                 Transaction
//               </DialogTitle>
//               <p className="text-[10px] font-bold text-[#0064AE] uppercase tracking-[0.2em]">
//                 Details & Summary
//               </p>
//             </div>
//             <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100 shadow-sm text-slate-400">
//               <Receipt size={24} />
//             </div>
//           </div>
//         </DialogHeader>

//         <div className="px-8 pb-8 space-y-6">
//           {/* --- Multi-Image Gallery --- */}
//           <div className="space-y-3">
//             <div className="relative group aspect-video w-full overflow-hidden rounded-[24px] border-4 border-slate-50 shadow-inner bg-slate-100">
//               <img
//                 src={activeImage}
//                 className="w-full h-full object-cover transition-all duration-500 group-hover:scale-105"
//                 alt="Product"
//               />
//               <div className="absolute bottom-3 left-3">
//                 <Badge className="bg-white/80 backdrop-blur-md text-slate-800 border-none text-[10px] font-bold">
//                   {data.status}
//                 </Badge>
//               </div>
//             </div>

//             {/* Thumbnails list */}
//             {data.ad?.images?.length > 1 && (
//               <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
//                 {data.ad.images.map((img: any, idx: number) => (
//                   <button
//                     key={idx}
//                     onClick={() => setActiveImage(img.url)}
//                     className={`relative flex-shrink-0 w-12 h-12 rounded-xl overflow-hidden border-2 transition-all ${
//                       activeImage === img.url
//                         ? "border-[#0064AE] scale-95"
//                         : "border-transparent opacity-50 hover:opacity-100"
//                     }`}
//                   >
//                     <img
//                       src={img.url}
//                       className="w-full h-full object-cover"
//                       alt=""
//                     />
//                   </button>
//                 ))}
//               </div>
//             )}
//           </div>

//           {/* Ad Info Brief */}
//           <div className="px-1">
//             <h4 className="font-black text-slate-800 text-lg leading-tight truncate">
//               {data.ad?.title}
//             </h4>
//           </div>

//           {/* Detailed Info List */}
//           <div className="space-y-4 px-1">
//             {infoItems.map((item, i) => (
//               <div key={i} className="flex items-center justify-between group">
//                 <div className="flex items-center gap-3">
//                   <div className="p-2 bg-slate-50 rounded-lg text-slate-400 group-hover:text-[#0064AE] transition-colors">
//                     <item.icon size={14} />
//                   </div>
//                   <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
//                     {item.label}
//                   </span>
//                 </div>
//                 <span className="text-xs font-bold text-slate-700">
//                   {item.value}
//                 </span>
//               </div>
//             ))}
//           </div>

//           {/* Pricing Section (Dark Theme) */}
//           <div className="relative mt-4">
//             <div className="bg-slate-900 rounded-[24px] p-6 text-white shadow-xl relative overflow-hidden">
//               <div className="absolute -top-10 -right-10 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl" />

//               <div className="space-y-3 relative z-10">
//                 <div className="flex justify-between text-[10px] font-bold text-slate-400 uppercase tracking-[0.1em]">
//                   <span>Gross Amount</span>
//                   <span className="text-slate-200">
//                     ${data.totalAmount.toFixed(2)}
//                   </span>
//                 </div>
//                 <div className="flex justify-between text-[10px] font-bold text-rose-400 uppercase tracking-[0.1em]">
//                   <span>Admin Fee (10%)</span>
//                   <span>-${data.adminFee.toFixed(2)}</span>
//                 </div>

//                 <Separator className="bg-slate-800 my-2" />

//                 <div className="flex justify-between items-end">
//                   <div>
//                     <p className="text-[9px] font-bold text-blue-400 uppercase tracking-[0.2em] mb-1">
//                       Your Earnings
//                     </p>
//                     <h3 className="text-3xl font-black tracking-tighter">
//                       ${data.sellerAmount.toFixed(2)}
//                     </h3>
//                   </div>
//                   <CreditCard className="text-slate-700 mb-1" size={32} />
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Action Button */}
//           <button
//             onClick={() => generatePrettyInvoice(data)}
//             className="w-full py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl flex items-center justify-center gap-2 font-bold text-slate-600 hover:bg-[#0064AE] hover:text-white hover:border-[#0064AE] transition-all active:scale-[0.98] shadow-sm"
//           >
//             <Download size={18} />
//             Download Statement
//           </button>
//         </div>
//       </DialogContent>
//     </Dialog>
//   );
// };

// export default PaymentDetailsDialog;
