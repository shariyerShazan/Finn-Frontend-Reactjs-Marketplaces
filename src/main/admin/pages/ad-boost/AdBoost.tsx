/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { Plus, Edit2, Trash2, Zap, Eye, Calendar } from "lucide-react";
import CommonTable from "@/main/user/_components/CustomTable";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import { useDeleteBoostPackageMutation, useGetAllBoostPackagesQuery } from "@/redux/fetures/admin/ad-boost.api.";
import BoostPackageDialog from "./_components/BoostPackageDialog";
import BoostPackageViewModal from "./_components/BoostPackageViewModal";


const AdBoost = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState<any>(null);
  const [isViewOpen, setIsViewOpen] = useState(false);

  const { data: response } = useGetAllBoostPackagesQuery(undefined);
  const [deletePackage] = useDeleteBoostPackageMutation();

  const handleEdit = (pkg: any) => {
    setSelectedPackage(pkg);
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    const result = await Swal.fire({
      title: "Delete Boost Package?",
      text: "Sellers won't be able to purchase this package anymore!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#0064AE",
      cancelButtonColor: "#64748b",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      try {
        await deletePackage(id).unwrap();
        toast.success("Boost package removed");
      } catch (err: any) {
        toast.error(err?.data?.message || "Failed to delete");
      }
    }
  };

  const columns = [
    {
      header: "Package Name",
      render: (item: any) => (
        <div className="flex items-center gap-2">
          <div className="p-2 bg-amber-50 text-amber-600 rounded-lg">
            <Zap size={18} />
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
      header: "Boost Type",
      render: (item: any) => (
        <span className="px-3 py-1 bg-slate-100 text-slate-600 text-[10px] font-black rounded-full uppercase tracking-wider">
          {item.type}
        </span>
      ),
    },
    {
      header: "Duration",
      render: (item: any) => (
        <div className="flex items-center gap-1.5 text-xs font-bold text-slate-500">
          <Calendar size={14} />
          {item.durationDays} Days
        </div>
      ),
    },
    {
      header: "Actions",
      render: (item: any) => (
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              setSelectedPackage(item);
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
            Ad Boost Packages
          </h2>
          <p className="text-sm text-slate-500 font-medium">
            Configure visibility upgrades for seller listings.
          </p>
        </div>
        <button
          onClick={() => {
            setSelectedPackage(null);
            setIsDialogOpen(true);
          }}
          className="flex cursor-pointer items-center gap-2 bg-[#0064AE] hover:bg-[#005291] text-white px-4 py-2.5 rounded-xl font-bold transition-all shadow-lg shadow-blue-200"
        >
          <Plus size={18} /> Create Package
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
        <CommonTable columns={columns} data={response?.data || []} />
      </div>

      <BoostPackageDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        pkg={selectedPackage}
      />

      <BoostPackageViewModal
        isOpen={isViewOpen}
        onClose={() => setIsViewOpen(false)}
        pkg={selectedPackage}
      />
    </div>
  );
};

export default AdBoost;
