/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useState } from "react";
import CommonPagination from "@/main/user/_components/CommonPagination";
import CommonTable from "@/main/user/_components/CustomTable";
import {
  Eye,
  // Search,
  Loader2,
  Trash2,
  CheckCircle2,
  Clock,
  // Ban,
  CheckCircle,
  ShieldCheck,
  ShieldAlert,
} from "lucide-react";
import {
  useGetAllReportsQuery,
  useDeleteReportMutation,
  useGetReportByIdQuery,
  useResolveReportMutation,
  // useSuspendAuthMutation,
} from "@/redux/fetures/admin/report.api";
import { toast } from "react-toastify";
import ReportActionDialog from "./_components/ReportDetails";
// import ReportActionDialog from "./_components/ReportActionDialog";

const AdminReport = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedReportId, setSelectedReportId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // --- API Hooks ---
  const { data: response, isLoading } = useGetAllReportsQuery({
    page: currentPage,
    limit: 10,
  });

  const { data: detailResponse, isFetching: isDetailLoading } =
    useGetReportByIdQuery(selectedReportId as string, {
      skip: !selectedReportId,
    });

  const [deleteReport] = useDeleteReportMutation();
  const [resolveReport, { isLoading: isResolving }] =
    useResolveReportMutation();
  // const [suspendAuth, { isLoading: isSuspending }] = useSuspendAuthMutation();

  const reports = response?.data || [];
  const meta = response?.meta;

  // --- Action Handlers ---

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this report record?")) return;
    try {
      await deleteReport(id).unwrap();
      toast.success("Report deleted successfully");
    } catch (err: any) {
      toast.error(err?.data?.message || "Delete failed");
    }
  };
  const handleQuickResolve = async (id: string) => {
    try {
      const res = await resolveReport(id).unwrap();
      toast.success(res.message || "Report marked as resolved");
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to resolve");
    }
  };

  const columns = [
    {
      header: "Reporter & ID",
      render: (item: any) => (
        <div className="flex items-center gap-3">
          <div className="relative">
            <img
              src={
                item?.reporter.profilePicture ||
                `https://api.dicebear.com/7.x/initials/svg?seed=${item?.reporter.nickName}`
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
            <span className="text-sm font-black text-slate-800 block mb-0.5">
              {item.reporter?.nickName || "Unknown"}
            </span>
            <span className="text-[10px] font-mono text-slate-400">
              ID: {item.id.slice(0, 8)}
            </span>
          </div>
        </div>
      ),
    },
    //
    {
      header: "Reason",
      render: (item: any) => (
        <span
          className={`text-[10px] font-black px-2 py-1 rounded-md uppercase tracking-tighter ${
            item.status === "RESOLVED"
              ? "bg-slate-100 text-slate-400"
              : "bg-rose-50 text-rose-600"
          }`}
        >
          {item.reason}
        </span>
      ),
    },
    {
      header: "Given Note",
      render: (item: any) => (
        <span
          className={`text-[11px] font-black px-2 py-1 rounded-md text-gray-500`}
        >
          {item.description?.slice(0, 25)}{" "}
          {item.description.split("").length > 25 && "..."}
        </span>
      ),
    },
    {
      header: "Status",
      render: (item: any) => (
        <div className="flex items-center gap-1.5">
          {item.status === "PENDING" ? (
            <span className="text-[10px] font-bold text-amber-500 bg-amber-50 px-2 py-1 rounded-full border border-amber-100 flex items-center gap-1">
              <Clock size={12} /> PENDING
            </span>
          ) : (
            <span className="text-[10px] font-bold text-emerald-500 bg-emerald-50 px-2 py-1 rounded-full border border-emerald-100 flex items-center gap-1">
              <CheckCircle2 size={12} /> RESOLVED
            </span>
          )}
        </div>
      ),
    },
    {
      header: "Quick Actions",
      render: (item: any) => (
        <div className="flex items-center gap-2">
          {/* View Details */}
          <button
            onClick={() => {
              setSelectedReportId(item.id);
              setIsModalOpen(true);
            }}
            title="View Details"
            className="p-2 cursor-pointer rounded-lg border border-slate-200 text-slate-400 hover:text-[#0064AE] hover:bg-[#0064AE]/5 transition-all"
          >
            <Eye size={17} strokeWidth={2.5} />
          </button>

          {/* Quick Resolve Button */}
          {item.status === "PENDING" && (
            <button
              onClick={() => handleQuickResolve(item.id)}
              disabled={isResolving}
              title="Mark Resolved"
              className="p-2 cursor-pointer rounded-lg border border-slate-200 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 transition-all"
            >
              <CheckCircle size={17} strokeWidth={2.5} />
            </button>
          )}

          {/* Delete Button */}
          <button
            onClick={() => handleDelete(item.id)}
            title="Delete Report"
            className="p-2 cursor-pointer rounded-lg border border-slate-200   text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-all"
          >
            <Trash2 size={17} strokeWidth={2.5} />
          </button>
        </div>
      ),
    },
  ];

  if (isLoading)
    return (
      <div className="p-20 flex justify-center">
        <Loader2 className="animate-spin text-[#0064AE]" size={40} />
      </div>
    );

  return (
    <div className="p-4">
      <div className="p-6 bg-white rounded-xl border border-slate-100 shadow-sm">
        <div className="flex justify-between items-center mb-10">
          <div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">
              System Reports
            </h2>
            <p className="text-xs text-slate-400 font-medium">
              Review and enforce community guidelines
            </p>
          </div>
          {/* <div className="relative">
            <Search
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300"
              size={18}
            />
            <input
              placeholder="Filter reports..."
              className="pl-12 pr-6 py-3 bg-slate-50 border-none rounded-2xl text-sm w-64 focus:ring-2 focus:ring-[#0064AE]/10 transition-all outline-none"
            />
          </div> */}
        </div>
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <CommonTable columns={columns} data={reports} />
        </div>

        <div className=" p-4 border-t border-slate-50">
          <CommonPagination
            currentPage={currentPage}
            totalPages={meta?.totalPage || 1}
            onPageChange={setCurrentPage}
          />
        </div>
      </div>

  
      <ReportActionDialog
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedReportId(null);
        }}
        report={detailResponse?.data}
        isLoading={isDetailLoading}
      />
    </div>
  );
};

export default AdminReport;
