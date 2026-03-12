/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from "@/components/ui/sheet";
import { Command, Save, Plus, Loader2, PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SpecFieldItem } from "./SpecFieldItem";
import {
  useCreateSubCategoryMutation,
  useUpdateSubCategoryMutation,
} from "@/redux/fetures/admin/admin-category.api";
import { toast } from "react-toastify";

export function SubCategorySheet({
  open,
  onOpenChange,
  categories,
  editData,
}: any) {
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    categoryId: "",
    specFields: [] as any[],
  });

  const [createSub, { isLoading: isCreating }] = useCreateSubCategoryMutation();
  const [updateSub, { isLoading: isUpdating }] = useUpdateSubCategoryMutation();

  useEffect(() => {
    if (editData && open) {
      const formattedFields =
        editData.specFields?.map((f: any) => ({
          ...f,
          options: Array.isArray(f.options)
            ? f.options.join(", ")
            : f.options || "",
        })) || [];

      setFormData({
        name: editData.name || "",
        slug: editData.slug || "",
        categoryId: editData.categoryId || "",
        specFields: formattedFields,
      });
    } else if (open) {
      setFormData({ name: "", slug: "", categoryId: "", specFields: [] });
    }
  }, [editData, open]);

  const handleNameChange = (val: string) => {
    const generatedSlug = val
      .toLowerCase()
      .trim()
      .replace(/\s+/g, "-")
      .replace(/[^\w-]+/g, "")
      .replace(/^-+|-+$/g, "");

    setFormData((prev) => ({
      ...prev,
      name: val,
      slug: generatedSlug,
    }));
  };

  const addField = () => {
    setFormData((p) => ({
      ...p,
      specFields: [
        ...p.specFields,
        { label: "", key: "", type: "text", required: true, options: "" },
      ],
    }));
  };

  const updateField = (index: number, key: string, value: any) => {
    setFormData((prev) => {
      const updatedFields = [...prev.specFields];
      updatedFields[index] = { ...updatedFields[index], [key]: value };

      if (key === "label") {
        updatedFields[index].key = value
          .toLowerCase()
          .trim()
          .replace(/\s+/g, "_")
          .replace(/[^\w_]+/g, "");
      }
      return { ...prev, specFields: updatedFields };
    });
  };

 const handleSave = async () => {

   const name = formData.name.trim();
   const slug = formData.slug.trim();
   const categoryId = formData.categoryId;

   if (!name || !slug || !categoryId) {
     return toast.error("Please provide Name, Slug, and Parent Category");
   }

   const processedPayload = {
     name,
     slug,
     categoryId,
     specFields: formData.specFields.map((field) => ({
       label: field.label || "",
       key: field.key || field.label.toLowerCase().replace(/\s+/g, "_"),
       type: field.type,
       required: String(field.required) === "true",
       options:
         field.type === "select"
           ? typeof field.options === "string"
             ? field.options
                 .split(",")
                 .map((o: string) => o.trim())
                 .filter(Boolean)
             : field.options
           : [],
     })),
   };

   try {
     if (editData) {
       const targetId = editData.id || editData._id;

       await updateSub({
         subCategoryId: targetId,
         data: processedPayload,
       }).unwrap();
       toast.success("Blueprint updated successfully");
     } else {
       await createSub(processedPayload).unwrap();
       toast.success("Blueprint deployed successfully");
     }
     onOpenChange(false);
   } catch (err: any) {
     const msg = Array.isArray(err?.data?.message)
       ? err.data.message[0]
       : err?.data?.message;
     toast.error(msg || "Operation failed");
     console.error("Payload sent:", processedPayload); 
   }
 };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-[600px] p-0 flex flex-col h-full overflow-hidden">
        {/* Header Section */}
        <div className="p-6 border-b shrink-0 bg-white">
          <SheetHeader>
            <div className="flex items-center gap-2 text-slate-400 mb-1">
              <Command size={14} />
              <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
                Schema Engine
              </span>
            </div>
            <SheetTitle className="text-xl font-bold">
              {editData ? "Edit Blueprint" : "New Blueprint"}
            </SheetTitle>
            <SheetDescription>
              Configure dynamic attributes for this sub-category.
            </SheetDescription>
          </SheetHeader>
        </div>

        {/* Scrollable Form Body */}
        <div className="flex-1 overflow-y-auto bg-slate-50/30">
          <div className="p-6 space-y-8 pb-10">
            {/* Configuration Card */}
            <div className="space-y-4 bg-white p-4 rounded-xl border border-slate-200">
              <div className="space-y-2">
                <Label className="text-[11px] font-bold uppercase text-slate-500">
                  Parent Category
                </Label>
                <Select
                  value={formData.categoryId}
                  onValueChange={(v) =>
                    setFormData({ ...formData, categoryId: v })
                  }
                >
                  <SelectTrigger className="bg-white">
                    <SelectValue placeholder="Select Category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((c: any) => (
                      <SelectItem key={c.id} value={c.id}>
                        {c.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-[11px] font-bold uppercase text-slate-500">
                    Name
                  </Label>
                  <Input
                    placeholder="e.g. Smart Watches"
                    value={formData.name}
                    onChange={(e) => handleNameChange(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-[11px] font-bold uppercase text-slate-500">
                    Slug
                  </Label>
                  <Input
                    className="bg-slate-50 font-mono text-xs"
                    value={formData.slug}
                    onChange={(e) =>
                      setFormData({ ...formData, slug: e.target.value })
                    }
                  />
                </div>
              </div>
            </div>

            {/* Attributes Section */}
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                <Label className="font-bold text-slate-900">
                  Dynamic Attributes
                </Label>
                <Button
                  onClick={addField}
                  size="sm"
                  variant="outline"
                  className="h-7 text-[10px] uppercase font-bold"
                >
                  <Plus size={12} className="mr-1" /> Add Field
                </Button>
              </div>

              <div className="space-y-3">
                {formData.specFields.map((field, idx) => (
                  <SpecFieldItem
                    key={idx}
                    index={idx}
                    field={field}
                    onUpdate={updateField}
                    onRemove={(i: number) =>
                      setFormData((p) => ({
                        ...p,
                        specFields: p.specFields.filter((_, idx) => idx !== i),
                      }))
                    }
                  />
                ))}

                {formData.specFields.length === 0 && (
                  <div className="py-10 border border-dashed rounded-lg flex flex-col items-center justify-center text-slate-400 gap-2 bg-white/50">
                    <PlusCircle size={20} className="opacity-20" />
                    <p className="text-[10px] uppercase font-bold tracking-widest">
                      No attributes added
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Action Footer */}
        <div className="p-6 border-t shrink-0 bg-white">
          <SheetFooter>
            <Button
              onClick={handleSave}
              disabled={isCreating || isUpdating}
              className="w-full h-11 bg-slate-900 hover:bg-slate-800 text-white font-bold transition-all"
            >
              {isCreating || isUpdating ? (
                <Loader2 className="animate-spin mr-2" />
              ) : (
                <Save size={16} className="mr-2" />
              )}
              {editData ? "Save Blueprint Changes" : "Deploy New Blueprint"}
            </Button>
          </SheetFooter>
        </div>
      </SheetContent>
    </Sheet>
  );
}
