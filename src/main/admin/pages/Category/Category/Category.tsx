/* eslint-disable @typescript-eslint/no-explicit-any */
import  { useState } from "react";
import {
  Plus,
  Edit2,
  Trash2,
  Image as ImageIcon,
  Globe,
  Search,

  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import CommonTable from "@/main/user/_components/CustomTable";
import CommonPagination from "@/main/user/_components/CommonPagination";
import { CategorySheet } from "./_components/CategorySheet";
import { toast } from "react-toastify";
import { useDeleteCategoryMutation, useGetAllCategoriesQuery } from "@/redux/fetures/admin/admin-category.api";


const Category = () => {
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<any>(null);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  // RTK Query Hooks
  const { data: categoriesResponse, isLoading } = useGetAllCategoriesQuery({
  page: 1, 
  limit: 1000,
});

const categories = categoriesResponse?.data || [];
// const meta = categoriesResponse?.meta;
  const [deleteCategory, { isLoading: isDeleting }] =
    useDeleteCategoryMutation();

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure?")) return;
    try {
      await deleteCategory(id).unwrap();
      toast.success("Category deleted successfully");
    } catch (err: any) {
      toast.error(err?.data?.message || "Delete failed");
    }
  };

  const handleEdit = (category: any) => {
    setSelectedCategory(category);
    setIsSheetOpen(true);
  };

  const filteredData = categories.filter((c: any) =>
    c.name.toLowerCase().includes(search.toLowerCase()),
  );

  const columns = [
    {
      header: "Identity",
      render: (item: any) => (
        <div className="flex items-center gap-4 py-2">
          <div className="h-10 w-10 rounded-lg bg-slate-900 border flex items-center justify-center overflow-hidden shrink-0 shadow-sm">
            {item.image ? (
              <img
                src={item.image}
                alt=""
                className="object-cover w-full h-full"
              />
            ) : (
              <ImageIcon size={16} className="text-slate-400" />
            )}
          </div>
          <div>
            <p className="font-bold text-slate-900 text-sm">{item.name}</p>
            <p className="text-[10px] text-slate-400 font-mono">
              ID: {item.id}
            </p>
          </div>
        </div>
      ),
    },
    {
      header: "Route Path",
      render: (item: any) => (
        <div className="flex items-center gap-2 px-2 py-1 rounded bg-slate-50 border w-fit">
          <Globe size={12} className="text-slate-400" />
          <span className="text-[11px] font-mono text-slate-600">
            /{item.slug}
          </span>
        </div>
      ),
    },
    {
      header: "Action",
      render: (item: any) => (
        <div className="flex justify-end gap-1">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => handleEdit(item)}
            className="h-8 w-8"
          >
            <Edit2 size={14} />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => handleDelete(item.id)}
            disabled={isDeleting}
            className="h-8 w-8 hover:text-red-600"
          >
            <Trash2 size={14} />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="p-4 space-y-10">
      <header className="flex justify-between items-end border-b pb-8">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tighter text-slate-900">
            Parent Categories
          </h1>
          <p className="text-slate-500 text-[13px]">
            Manage global taxonomy settings.
          </p>
        </div>

        <div className="flex gap-4">
          <div className="relative">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              size={14}
            />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-[280px] h-10 bg-white"
              placeholder="Search..."
            />
          </div>
          <Button
            onClick={() => {
              setSelectedCategory(null);
              setIsSheetOpen(true);
            }}
            className="bg-slate-900 text-white font-bold text-[11px] uppercase tracking-widest"
          >
            <Plus size={16} className="mr-2" /> Create Category
          </Button>
        </div>
      </header>

      <div className="bg-white border rounded-xl overflow-hidden min-h-[400px]">
        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <Loader2 className="animate-spin text-slate-400" />
          </div>
        ) : (
          <CommonTable columns={columns} data={filteredData} />
        )}
        <div className="p-4 border-t bg-slate-50/50">
          <CommonPagination
            currentPage={currentPage}
            totalPages={1}
            onPageChange={setCurrentPage}
          />
        </div>
      </div>

      <CategorySheet
        open={isSheetOpen}
        onOpenChange={setIsSheetOpen}
        editData={selectedCategory}
      />
    </div>
  );
};

export default Category;
