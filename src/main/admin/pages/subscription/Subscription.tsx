/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { Plus, Edit2, Trash2, Package, Eye } from "lucide-react";
import CommonTable from "@/main/user/_components/CustomTable";
import SubscriptionDialog from "./_components/SubscriptionDialog";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import { useDeletePlanMutation, useGetAllPlansQuery } from "@/redux/fetures/admin/subscription";
import SubscriptionViewModal from "./_components/SubscriptionViewModal";

const Subscription = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<any>(null);
  const [isViewOpen, setIsViewOpen] = useState(false);

  const { data: response } = useGetAllPlansQuery(undefined);
  const [deletePlan,] = useDeletePlanMutation();

  const handleEdit = (plan: any) => {
    setSelectedPlan(plan);
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This plan will be removed permanently!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#0064AE", // Your Brand Color
      cancelButtonColor: "#64748b",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      try {
        await deletePlan(id).unwrap();
        toast.success("Plan deleted successfully");
      } catch (err: any) {
        toast.error(err?.data?.message || "Failed to delete");
      }
    }
  };

  const columns = [
    {
      header: "Plan Name",
      render: (item: any) => (
        <div className="flex items-center gap-2">
          <div className="p-2 bg-blue-50 text-[#0064AE] rounded-lg">
            <Package size={18} />
          </div>
          <span className="font-bold text-slate-800">{item.name}</span>
        </div>
      ),
    },
    {
      header: "Price",
      render: (item: any) => (
        <span className="font-black text-slate-700">${item.price}</span>
      ),
    },
    {
      header: "Key Features",
      render: (item: any) => {
        const features = item?.features || [];
        const displayFeatures = features.slice(0, 2); 
        const remainingCount = features.length - 2;
        return (
          <div className="flex flex-wrap items-center gap-1.5 max-w-[250px]">
            {displayFeatures.map((feature: string, index: number) => (
              <span
                key={index}
                className="px-2 py-0.5 bg-slate-50 border border-slate-200 text-slate-600 text-[10px] font-bold rounded-md whitespace-nowrap"
              >
                {feature}
              </span>
            ))}

            {remainingCount > 0 && (
              <span className="px-2 py-0.5 bg-blue-50 text-[#0064AE] text-[10px] font-black rounded-md border border-blue-100">
                +{remainingCount} More
              </span>
            )}

            {features.length === 0 && (
              <span className="text-[10px] font-medium text-slate-400 italic">
                No features added
              </span>
            )}
          </div>
        );
      },
    },
    {
      header: "Limit & Validity",
      render: (item: any) => (
        <div className="text-xs">
          <p className="font-bold text-slate-600">{item.postLimit} Posts</p>
          <p className="text-slate-400">{item.durationDays} Days Duration</p>
        </div>
      ),
    },
    {
      header: "Actions",
      render: (item: any) => (
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              setSelectedPlan(item);
              setIsViewOpen(true);
            }}
            className="p-2 cursor-pointer rounded-lg border border-slate-200 text-slate-400 hover:text-[#0064AE] hover:bg-blue-50 transition-all"
          >
            <Eye size={16} />
          </button>
          <button
            onClick={() => handleEdit(item)}
            className="p-2 cursor-pointer rounded-lg border border-slate-200 text-blue-600 hover:bg-blue-50 transition-all"
          >
            <Edit2 size={16} />
          </button>
          <button
            onClick={() => handleDelete(item.id)}
            className="p-2 cursor-pointer rounded-lg border border-slate-200 text-rose-600 hover:bg-rose-50 transition-all"
          >
            <Trash2 size={16} />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">
            Subscription Plans
          </h2>
          <p className="text-sm text-slate-500 font-medium">
            Manage seller post limits and pricing.
          </p>
        </div>
        <button
          onClick={() => {
            setSelectedPlan(null);
            setIsDialogOpen(true);
          }}
          className="flex cursor-pointer items-center gap-2 bg-[#0064AE] hover:bg-[#005291] text-white px-4 py-2.5 rounded-xl font-bold transition-all shadow-lg shadow-blue-200"
        >
          <Plus size={18} /> Create Plan
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
        <CommonTable columns={columns} data={response?.data || []} />
      </div>

      <SubscriptionDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        plan={selectedPlan}
      />

      <SubscriptionViewModal
        isOpen={isViewOpen}
        onClose={() => setIsViewOpen(false)}
        plan={selectedPlan}
      />
    </div>
  );
};

export default Subscription;
