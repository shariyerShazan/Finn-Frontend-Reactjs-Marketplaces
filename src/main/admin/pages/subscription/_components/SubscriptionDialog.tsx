/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Loader2, Plus, Trash2 } from "lucide-react";
import { toast } from "react-toastify";
import {
  useCreatePlanMutation,
  useUpdatePlanMutation,
} from "@/redux/fetures/admin/subscription";

const SubscriptionDialog = ({ isOpen, onClose, plan }: any) => {
  const { register, control, handleSubmit, reset } = useForm({
    defaultValues: {
      name: "",
      price: "",
      durationDays: "",
      postLimit: "", // Default value
      features: [{ value: "" }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "features" as any,
  });

  const [createPlan, { isLoading: isCreating }] = useCreatePlanMutation();
  const [updatePlan, { isLoading: isUpdating }] = useUpdatePlanMutation();

  useEffect(() => {
    if (plan) {
      reset({
        ...plan,
        features: plan.features?.map((f: string) => ({ value: f })) || [
          { value: "" },
        ],
      });
    } else {
      reset({
        name: "",
        price: "",
        durationDays: "",
        postLimit: "",
        features: [{ value: "" }],
      });
    }
  }, [plan, reset, isOpen]);

  const onSubmit = async (data: any) => {
    try {
      // Formatted data formatting
      const formattedData = {
        name: data.name,
        price: Number(data.price),
        durationDays: Number(data.durationDays),
        postLimit: Number(data.postLimit), // ekhon field add kora hoyeche, tai 1+ hobe
        features: data.features.map((f: any) => f.value).filter(Boolean),
      };

      if (plan) {
        await updatePlan({ id: plan.id, ...formattedData }).unwrap();
        toast.success("Plan updated successfully");
      } else {
        await createPlan(formattedData).unwrap();
        toast.success("New plan created");
      }
      onClose();
    } catch (err: any) {
      toast.error(err?.data?.message || "Operation failed");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[550px] max-h-[90vh] overflow-y-auto rounded-3xl p-8">
        <DialogHeader>
          <DialogTitle className="text-2xl font-black text-slate-800 tracking-tight">
            {plan ? "Update Plan" : "New Subscription"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 pt-4">
          <div className="grid grid-cols-2 gap-5">
            <div className="col-span-2 space-y-1.5">
              <label className="text-xs font-black text-slate-400 uppercase tracking-widest">
                Plan Identity
              </label>
              <input
                {...register("name", { required: true })}
                placeholder="Basic / Pro / Enterprise"
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:border-[#0064AE] outline-none font-bold"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-black text-slate-400 uppercase tracking-widest">
                Pricing (PLN)
              </label>
              <input
                type="number"
                {...register("price", { required: true, min: 1 })}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:border-[#0064AE] outline-none font-bold"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-black text-slate-400 uppercase tracking-widest">
                Validity (Days)
              </label>
              <input
                type="number"
                {...register("durationDays", { required: true, min: 1 })}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:border-[#0064AE] outline-none font-bold"
              />
            </div>

            {/* --- AD LIMIT FIELD (Eita missing chilo) --- */}
            <div className="col-span-2 space-y-1.5">
              <label className="text-xs font-black text-slate-400 uppercase tracking-widest">
                Ad Posting Limit (Must be 1 or more)
              </label>
              <input
                type="number"
                {...register("postLimit", { required: true, min: 1 })}
                placeholder="How many ads can they post?"
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:border-[#0064AE] outline-none font-bold"
              />
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <label className="text-xs font-black text-slate-400 uppercase tracking-widest">
                Plan Features
              </label>
              <button
                type="button"
                onClick={() => append({ value: "" })}
                className="text-[10px] cursor-pointer font-black bg-blue-50 text-[#0064AE] px-3 py-1 rounded-full flex items-center gap-1 uppercase hover:bg-blue-100 transition-all"
              >
                <Plus size={12} /> Add Feature
              </button>
            </div>

            <div className="space-y-2">
              {fields.map((field, index) => (
                <div key={field.id} className="flex items-center gap-2 group">
                  <input
                    {...register(`features.${index}.value` as const)}
                    placeholder="Enter benefit..."
                    className="flex-1 px-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:border-[#0064AE] outline-none text-sm font-medium"
                  />
                  <button
                    type="button"
                    onClick={() => remove(index)}
                    className="p-2 cursor-pointer text-slate-300 hover:text-rose-500 transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
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
              ) : plan ? (
                "Update Changes"
              ) : (
                "Create Plan Now"
              )}
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default SubscriptionDialog;
