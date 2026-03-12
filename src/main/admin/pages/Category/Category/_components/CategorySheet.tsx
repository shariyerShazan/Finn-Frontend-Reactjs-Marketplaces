/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect, useRef } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Save, Loader2, UploadCloud, X } from "lucide-react";
import { toast } from "react-toastify";
import {
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
} from "@/redux/fetures/admin/admin-category.api";

export function CategorySheet({ open, onOpenChange, editData }: any) {
  // States
  const [formData, setFormData] = useState({ name: "", slug: "" });
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // RTK Mutations
  const [createCategory, { isLoading: isCreating }] =
    useCreateCategoryMutation();
  const [updateCategory, { isLoading: isUpdating }] =
    useUpdateCategoryMutation();

  // Reset or Set data on Open/Edit
  useEffect(() => {
    if (editData) {
      setFormData({ name: editData.name, slug: editData.slug });
      setPreview(editData.image || null);
    } else {
      setFormData({ name: "", slug: "" });
      setPreview(null);
    }
    setFile(null);
  }, [editData, open]);

  // Handle File Change
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
    }
  };

  const handleSubmit = async () => {
    if (!formData.name || !formData.slug) {
      return toast.error("Name and Slug are required!");
    }

    // Creating FormData for Multipart Upload
    const data = new FormData();
    data.append("name", formData.name);
    data.append("slug", formData.slug);
    if (file) {
      data.append("image", file); // Backend expects 'image' key
    }

    try {
      if (editData) {
        // Update call
        await updateCategory({ id: editData.id, data }).unwrap();
        toast.success("Category updated successfully!");
      } else {
        // Create call
        await createCategory(data).unwrap();
        toast.success("Category created successfully!");
      }
      onOpenChange(false);
    } catch (err: any) {
      toast.error(err?.data?.message || "Operation failed");
    }
  };

  const isPending = isCreating || isUpdating;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-[450px] flex flex-col p-0 border-l border-slate-200">
        <SheetHeader className="p-8 border-b border-slate-100">
          <SheetTitle className="text-xl font-bold text-slate-900">
            {editData ? "Edit Category" : "New Category"}
          </SheetTitle>
          <SheetDescription className="text-xs text-slate-500">
            Upload an image and set the category taxonomy.
          </SheetDescription>
        </SheetHeader>

        <div className="flex-1 p-8 space-y-8 bg-slate-50/30 overflow-y-auto">
          {/* Asset/Image Section */}
          <div className="space-y-3">
            <Label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">
              Category Image
            </Label>

            <div
              onClick={() => fileInputRef.current?.click()}
              className="relative border-2 border-dashed border-slate-200 rounded-xl p-4 flex flex-col items-center justify-center bg-white hover:border-slate-400 transition-all cursor-pointer min-h-[160px] group"
            >
              {preview ? (
                <div className="relative w-full h-32">
                  <img
                    src={preview}
                    alt="Preview"
                    className="w-full h-full object-contain rounded-lg"
                  />
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setFile(null);
                      setPreview(null);
                    }}
                    className="absolute -top-2 -right-2 bg-red-500 text-white p-1 rounded-full shadow-lg hover:bg-red-600"
                  >
                    <X size={14} />
                  </button>
                </div>
              ) : (
                <>
                  <div className="h-10 w-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 group-hover:text-slate-900 transition-colors">
                    <UploadCloud size={20} />
                  </div>
                  <p className="mt-3 text-[11px] font-bold text-slate-900">
                    Click to upload image
                  </p>
                  <p className="text-[10px] text-slate-400 mt-1 font-medium">
                    PNG, JPG or SVG
                  </p>
                </>
              )}
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                className="hidden"
                accept="image/*"
              />
            </div>
          </div>

          {/* Form Fields */}
          <div className="space-y-6">
            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">
                Display Name
              </Label>
              <Input
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                placeholder="e.g. Vehicles"
                className="h-11 bg-white focus:ring-0 focus:border-slate-900"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">
                URL Slug
              </Label>
              <Input
                value={formData.slug}
                onChange={(e) =>
                  setFormData({ ...formData, slug: e.target.value })
                }
                placeholder="vehicles-cars"
                className="h-11 bg-white font-mono text-xs focus:ring-0 focus:border-slate-900"
              />
            </div>
          </div>
        </div>

        <SheetFooter className="p-6 bg-white border-t border-slate-200">
          <Button
            onClick={handleSubmit}
            disabled={isPending}
            className="w-full h-11 bg-slate-900 hover:bg-slate-800 text-white font-bold uppercase text-[11px] tracking-widest shadow-lg shadow-slate-200"
          >
            {isPending ? (
              <Loader2 className="animate-spin mr-2" size={16} />
            ) : (
              <Save size={16} className="mr-2" />
            )}
            {editData ? "Update Category" : "Save Category"}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
