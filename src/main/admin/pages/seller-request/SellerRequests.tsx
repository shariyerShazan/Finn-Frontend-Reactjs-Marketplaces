/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import CommonTable, { type Column } from "@/main/user/_components/CustomTable";
import { CheckCircle, Eye, Ban, ShieldCheck, ShieldAlert } from "lucide-react";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import {
  useGetRequestedSellersQuery,
  useToggleApprovalMutation,
  useToggleSuspensionMutation,
} from "@/redux/fetures/admin/admin.api";
import SellerRequestModal from "./_components/SellerRequestModal";
import CommonPagination from "@/main/user/_components/CommonPagination";

const SellerRequests = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedSeller, setSelectedSeller] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data: response } = useGetRequestedSellersQuery({
    page: currentPage,
    limit: 10,
  });

  const [approveSeller, { isLoading: isApproving }] =
    useToggleApprovalMutation();
  const [suspendSeller, { isLoading: isSuspending }] =
    useToggleSuspensionMutation();

 const handleAction = async (
   userId: string,
   actionType: "APPROVE" | "SUSPEND",
 ) => {
   const isApprove = actionType === "APPROVE";

   if (isApprove) {
     // Approve করার জন্য সাধারণ সুইট অ্যালার্ট
     const result = await Swal.fire({
       title: `<strong>Approve Seller?</strong>`,
       text: "This will grant the user seller privileges.",
       icon: "question",
       showCancelButton: true,
       confirmButtonColor: "#10b981", // emerald-500
       cancelButtonColor: "#64748b",
       confirmButtonText: "Yes, Approve!",
       target: "body",
       didOpen: () => {
         document.body.style.pointerEvents = "auto";
         const container = Swal.getContainer();
         if (container) container.style.zIndex = "9999";
       },
     });

     if (result.isConfirmed) {
       try {
         await approveSeller(userId).unwrap();
         toast.success("Seller approved successfully");
         setIsModalOpen(false);
       } catch (err: any) {
         toast.error(err?.data?.message || "Operation failed");
       }
     }
   } else {
     // Suspend করার জন্য Textarea সহ সুইট অ্যালার্ট (AllSellers এর মতো)
     const { value: reason } = await Swal.fire({
       title: "Suspension Reason",
       input: "textarea",
       inputLabel: "Why are you rejecting/suspending this seller?",
       inputPlaceholder: "Enter reason here...",
       showCancelButton: true,
       confirmButtonColor: "#e11d48", // rose-600
       confirmButtonText: "Suspend Now",
       cancelButtonColor: "#64748b",
       target: "body",
       didOpen: () => {
         document.body.style.pointerEvents = "auto";
         const container = Swal.getContainer();
         if (container) container.style.zIndex = "9999";
       },
       inputValidator: (value) => {
         if (!value) return "You need to provide a reason!";
       },
     });

     if (reason) {
       try {
         await suspendSeller({
           userId,
           reason: reason, 
         }).unwrap();
         toast.success("Seller suspended successfully");
         setIsModalOpen(false);
       } catch (err: any) {
         toast.error(err?.data?.message || "Operation failed");
       }
     }
   }
 };

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
      header: "Seller Info",
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
            <p className="font-bold text-slate-800 text-sm">
              {item.firstName} {item.lastName}
            </p>
            <p className="text-[10px] text-slate-400 font-medium">
              {item.email}
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
      header: "Company",
      render: (item) => (
        <p className="text-xs font-bold text-slate-600">
          {item.sellerProfile?.companyName || "N/A"}
        </p>
      ),
    },
    // {
    //   header: "Location",
    //   render: (item) => (
    //     <div className="flex flex-col gap-0.5 max-w-[200px]">
    //       {/* Main Street Address */}
    //       <div className="flex items-start gap-1.5 text-slate-700">
    //         <MapPin size={12} className="mt-0.5 text-blue-500 shrink-0" />
    //         <span
    //           className="text-[11px] font-bold leading-tight truncate"
    //           title={item.sellerProfile?.address}
    //         >
    //           {item.sellerProfile?.address || "No Address"}
    //         </span>
    //       </div>

    //       {/* City, State & Country */}
    //       <p className="pl-[18px] text-[10px] font-medium text-slate-400">
    //         {item.sellerProfile?.city && `${item.sellerProfile.city}, `}
    //         {item.sellerProfile?.state && `${item.sellerProfile.state}, `}
    //         <span className="text-slate-500 font-bold uppercase tracking-wider">
    //           {item.sellerProfile?.country || "N/A"}
    //         </span>
    //       </p>
    //     </div>
    //   ),
    // },
    {
      header: "Status",
      render: (item) => (
        <div
          className={`px-2 py-0.5 rounded text-[10px] w-max font-bold uppercase tracking-wider border ${item.isSuspended ? "bg-rose-50 text-rose-600 border-rose-100" : "bg-emerald-50 text-emerald-600 border-emerald-100"}`}
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
            onClick={() => {
              setSelectedSeller(item);
              setIsModalOpen(true);
            }}
            className="p-2 cursor-pointer rounded-lg border border-slate-200 text-blue-600 hover:bg-blue-50 transition-all"
          >
            <Eye size={16} />
          </button>
          <button
            onClick={() => handleAction(item.id, "APPROVE")}
            className="p-2 cursor-pointer rounded-lg border border-slate-200 text-emerald-600 hover:bg-emerald-50"
          >
            <CheckCircle size={16} />
          </button>
          <button
            onClick={() => handleQuickSuspension(item.id, item.isSuspended)}
            className={`p-2 cursor-pointer rounded-lg border border-slate-200  transition-colors ${item.isSuspended ? "text-emerald-500 hover:bg-emerald-50" : "text-amber-500 hover:bg-amber-50"}`}
          >
            {item.isSuspended ? <ShieldCheck size={16} /> : <Ban size={16} />}
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-4 p-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-black text-slate-900 tracking-tight">
          Seller Requests
        </h2>
        <span className="px-3 py-1 bg-amber-50 text-amber-600 text-[10px] font-black rounded-full border border-amber-100 uppercase">
          {response?.meta?.total || 0} Pending
        </span>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
        <CommonTable
          columns={columns}
          data={response?.data || []}
          //   isLoading={isLoading}
        />
        <div className="p-4 bg-slate-50/50 border-t border-slate-100 flex justify-end">
          <CommonPagination
            currentPage={currentPage}
            totalPages={response?.meta?.totalPage || 1}
            onPageChange={(page) => setCurrentPage(page)}
          />
        </div>
      </div>

      <SellerRequestModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        seller={selectedSeller}
        onAction={handleAction}
        isUpdating={isApproving || isSuspending}
      />
    </div>
  );
};

export default SellerRequests;
