/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { Plus, Edit2, Trash2, Box, Hash, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import CommonTable from "@/main/user/_components/CustomTable";
import CommonPagination from "@/main/user/_components/CommonPagination";
import { SubCategorySheet } from "./_components/SubCategorySheet";
import { 
  useGetAllSubCategoriesQuery,
  useDeleteSubCategoryMutation,
  useGetAllCategoriesQuery,
} from "@/redux/fetures/admin/admin-category.api";
import { toast } from "react-toastify";

const SubCategory = () => {
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [currentPage, setCurrentPage] = useState(1);

  // Fetch with pagination
  const { data: subCategoryResponse, isLoading } = useGetAllSubCategoriesQuery({
    page: currentPage,
    limit: 10,
  });
  const { data: categoryResponse } = useGetAllCategoriesQuery();
  const [deleteSub, { isLoading: isDeleting }] = useDeleteSubCategoryMutation();

  const subCategories = subCategoryResponse?.data || [];
  const meta = subCategoryResponse?.meta || { totalPage: 1 };
  const categories = categoryResponse?.data || categoryResponse || [];

  const handleEdit = (item: any) => {
    setSelectedItem(item);
    setIsSheetOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this?")) return;
    try {
      await deleteSub(id).unwrap();
      toast.success("Sub-category deleted successfully");
    } catch (err: any) {
      toast.error(err?.data?.message || "Delete failed");
    }
  };

  const columns = [
    {
      header: "Sub-Category",
      render: (item: any) => (
        <div className="flex items-center gap-3 py-1">
          <div className="h-9 w-9 rounded-lg bg-slate-900 flex items-center justify-center text-white shadow-inner">
            <Box size={18} strokeWidth={2} />
          </div>
          <div>
            <p className="font-semibold text-slate-900 text-sm tracking-tight">
              {item.name}
            </p>
            <p className="text-[11px] text-slate-400 font-mono italic">
              /{item.slug}
            </p>
          </div>
        </div>
      ),
    },
    {
      header: "Parent Category",
      render: (item: any) => (
        <div className="flex items-center gap-2 border w-fit px-2 py-1 rounded-md bg-slate-50 border-slate-200">
          <Hash size={12} className="text-slate-400" />
          <span className="text-[12px] font-bold text-slate-600 uppercase tracking-tight">
            {item.category?.name || "N/A"}
          </span>
        </div>
      ),
    },
    {
      header: "Schema Attributes",
      render: (item: any) => (
        <div className="flex flex-wrap gap-1.5 max-w-[300px]">
          {item.specFields?.map((field: any, idx: number) => (
            <div
              key={idx}
              className="bg-white border border-slate-200 px-2 py-0.5 rounded text-[11px] font-medium text-slate-600"
            >
              {field.label}
            </div>
          ))}
        </div>
      ),
    },
    {
      header: "",
      render: (item: any) => (
        <div className="flex justify-end gap-1 px-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => handleEdit(item)}
            className="h-8 w-8 text-slate-400 hover:text-slate-900"
          >
            <Edit2 size={14} />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => handleDelete(item.id)}
            disabled={isDeleting}
            className="h-8 w-8 text-slate-400 hover:text-red-600"
          >
            <Trash2 size={14} />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="p-4 mx-auto space-y-10">
      <header className="flex justify-between items-end border-b border-slate-200 pb-8">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tighter text-slate-900">
            Taxonomy Manager
          </h1>
          <p className="text-slate-500 text-[13px] font-medium">
            Manage dynamic schemas for product specifications.
          </p>
        </div>
        <Button
          onClick={() => {
            setSelectedItem(null);
            setIsSheetOpen(true);
          }}
          className="bg-slate-900 text-white hover:bg-slate-800"
        >
          <Plus size={16} className="mr-2" strokeWidth={3} /> New Sub-Category
        </Button>
      </header>

      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden flex flex-col min-h-[450px]">
        {isLoading ? (
          <div className="flex-1 flex flex-col items-center justify-center gap-4">
            <Loader2 className="animate-spin text-slate-400" size={32} />
            <p className="text-xs font-bold uppercase tracking-widest text-slate-400">
              Loading Blueprints...
            </p>
          </div>
        ) : (
          <>
            <div className="flex-1">
              <CommonTable columns={columns} data={subCategories} />
            </div>

            {/* Pagination Implementation */}
            <div className="p-4 border-t bg-slate-50/50">
              <CommonPagination
                currentPage={currentPage}
                totalPages={meta.totalPage}
                onPageChange={(page: number) => setCurrentPage(page)}
              />
            </div>
          </>
        )}
      </div>

      <SubCategorySheet
        open={isSheetOpen}
        onOpenChange={setIsSheetOpen}
        categories={categories}
        editData={selectedItem}
      />
    </div>
  );
};

export default SubCategory;
