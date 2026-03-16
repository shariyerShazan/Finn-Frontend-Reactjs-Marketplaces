
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Loader2, Zap } from "lucide-react";
import { toast } from "react-toastify";
import { useCreateBoostPackageMutation, useUpdateBoostPackageMutation } from "@/redux/fetures/admin/ad-boost.api.";


const BoostPackageDialog = ({ isOpen, onClose, pkg }: any) => {
  const { register, handleSubmit, reset } = useForm({
    defaultValues: {
      name: "",
      price: "",
      durationDays: "",
      type: "BASIC",
      description: "",
    },
  });

  const [createPackage, { isLoading: isCreating }] = useCreateBoostPackageMutation();
  const [updatePackage, { isLoading: isUpdating }] = useUpdateBoostPackageMutation();

  useEffect(() => {
    if (pkg) {
      reset({
        ...pkg,
      });
    } else {
      reset({
        name: "",
        price: "",
        durationDays: "",
        type: "BASIC",
        description: "",
      });
    }
  }, [pkg, reset, isOpen]);

  const onSubmit = async (data: any) => {
    try {
      const formattedData = {
        ...data,
        price: Number(data.price),
        durationDays: Number(data.durationDays),
      };

      if (pkg) {
        await updatePackage({ id: pkg.id, ...formattedData }).unwrap();
        toast.success("Boost package updated");
      } else {
        await createPackage(formattedData).unwrap();
        toast.success("New boost package created");
      }
      onClose();
    } catch (err: any) {
      toast.error(err?.data?.message || "Operation failed");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] rounded-3xl p-8">
        <DialogHeader>
          <DialogTitle className="text-2xl font-black text-slate-800 tracking-tight flex items-center gap-2">
            <div className="p-2 bg-amber-50 text-amber-600 rounded-lg">
              <Zap size={20} />
            </div>
            {pkg ? "Update Boost Package" : "New Boost Package"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 pt-4">
          <div className="grid grid-cols-2 gap-5">
            <div className="col-span-2 space-y-1.5">
              <label className="text-xs font-black text-slate-400 uppercase tracking-widest">
                Package Name
              </label>
              <input
                {...register("name", { required: true })}
                placeholder="e.g. Premium Spotlight"
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:border-[#0064AE] outline-none font-bold"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-black text-slate-400 uppercase tracking-widest">
                Price ($)
              </label>
              <input
                type="number"
                {...register("price", { required: true, min: 0 })}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:border-[#0064AE] outline-none font-bold"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-black text-slate-400 uppercase tracking-widest">
                Duration (Days)
              </label>
              <input
                type="number"
                {...register("durationDays", { required: true, min: 1 })}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:border-[#0064AE] outline-none font-bold"
              />
            </div>

            <div className="col-span-2 space-y-1.5">
              <label className="text-xs font-black text-slate-400 uppercase tracking-widest">
                Boost Visibility Level
              </label>
              <select
                {...register("type", { required: true })}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:border-[#0064AE] outline-none font-bold"
              >
                <option value="BASIC">BASIC (Highlighted)</option>
                <option value="PREMIUM">PREMIUM (Category Top)</option>
                <option value="ULTRA">ULTRA (Home Page)</option>
              </select>
            </div>

            <div className="col-span-2 space-y-1.5">
              <label className="text-xs font-black text-slate-400 uppercase tracking-widest">
                Description
              </label>
              <textarea
                {...register("description")}
                rows={3}
                placeholder="Describe what the seller gets..."
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:border-[#0064AE] outline-none font-semibold text-sm"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button
              type="submit"
              disabled={isCreating || isUpdating}
              className="w-full cursor-pointer py-4 bg-[#0064AE] text-white font-black rounded-2xl hover:bg-[#005291] transition-all shadow-xl shadow-blue-100 uppercase tracking-widest text-sm"
            >
              {isCreating || isUpdating ? (
                <Loader2 className="animate-spin mx-auto" />
              ) : pkg ? (
                "Save Changes"
              ) : (
                "Create Package"
              )}
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default BoostPackageDialog;