/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React from "react";
import {
  Search,
  ArrowUpNarrowWide,
  CheckCircle2,
  XCircle,
  Layers,
  FilterIcon,
  Loader2,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
// import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  useGetAllCategoriesQuery,
  useGetSingleCategoryQuery,
} from "@/redux/fetures/admin/admin-category.api";

interface FilterProps {
  filters: any;
  setFilters: React.Dispatch<React.SetStateAction<any>>;
}

const FilterSearch = ({ filters, setFilters }: FilterProps) => {

  const { data: categoriesResponse, isLoading: catLoading } =
    useGetAllCategoriesQuery({ page: 1, limit: 100 });

  const allCategories = categoriesResponse?.data || [];

  const { data: categoryDetails, isFetching: subCatLoading } =
    useGetSingleCategoryQuery(filters.category, {
      skip: !filters.category || filters.category === "all",
    });

  const subCategories = categoryDetails?.subCategories || [];

  const handleUpdate = (key: string, value: string) => {
    setFilters((prev: any) => {
      const updated = { ...prev, [key]: value, page: 1 };
      if (key === "category") updated.subCategory = "all";
      return updated;
    });
  };

  return (
    <div className="sticky top-15 z-50 w-full bg-white/90 backdrop-blur-lg border-b border-slate-100 shadow-sm transition-all duration-300">
      <div className="mx-auto px-6 py-3">
        <div className="flex flex-col lg:flex-row lg:items-center gap-6">
          {/* 🔍 Dynamic Search */}
          <div className="relative flex-1 group">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#0064AE] transition-colors">
              <Search size={19} strokeWidth={2.5} />
            </div>
            <Input
              placeholder="Search products, services, or locations..."
              className="pl-10 h-11 border-slate-200 bg-slate-50/50 focus-visible:ring-[#0064AE] focus-visible:ring-offset-0 rounded-xl text-[15px] transition-all hover:bg-white"
              value={filters.search}
              onChange={(e) => handleUpdate("search", e.target.value)}
            />
          </div>

          <div className="flex flex-wrap md:flex-nowrap items-center gap-3">
            <Separator
              orientation="vertical"
              className="hidden lg:block h-8 mx-2 bg-slate-200"
            />

            {/* 💰 Sort By Price */}
            <Select
              value={filters.sortByPrice}
              onValueChange={(val) => handleUpdate("sortByPrice", val)}
            >
              <SelectTrigger className="w-[170px] h-11 rounded-xl border-slate-200 bg-white font-medium hover:border-[#0064AE] transition-colors">
                <div className="flex items-center gap-2">
                  <ArrowUpNarrowWide size={16} className="text-[#0064AE]" />
                  <SelectValue placeholder="Sort by price" />
                </div>
              </SelectTrigger>
              <SelectContent className="rounded-xl shadow-2xl border-slate-100">
                <SelectItem value="asc">Price: Low to High</SelectItem>
                <SelectItem value="desc">Price: High to Low</SelectItem>
              </SelectContent>
            </Select>

            {/* ✅ Status Filter */}
            <Select
              value={filters.isSold}
              onValueChange={(val) => handleUpdate("isSold", val)}
            >
              <SelectTrigger className="w-[150px] h-11 rounded-xl border-slate-200 bg-white font-medium hover:border-[#0064AE] transition-colors">
                <div className="flex items-center gap-2">
                  {filters.isSold === "true" ? (
                    <XCircle size={16} className="text-rose-500" />
                  ) : (
                    <CheckCircle2 size={16} className="text-emerald-500" />
                  )}
                  <SelectValue placeholder="Status" />
                </div>
              </SelectTrigger>
              <SelectContent className="rounded-xl shadow-2xl border-slate-100">
                <SelectItem value="false">Available</SelectItem>
                <SelectItem value="true">Sold Out</SelectItem>
              </SelectContent>
            </Select>

            {/* 📂 Category Select */}
            <Select
              value={filters.category}
              onValueChange={(val) => handleUpdate("category", val)}
            >
              <SelectTrigger className="w-[170px] h-11 rounded-xl border-slate-200 bg-white font-medium hover:border-[#0064AE] transition-colors">
                <div className="flex items-center gap-2">
                  {catLoading ? (
                    <Loader2 size={14} className="animate-spin" />
                  ) : (
                    <Layers size={16} className="text-slate-500" />
                  )}
                  <SelectValue placeholder="Category" />
                </div>
              </SelectTrigger>
              <SelectContent className="rounded-xl shadow-2xl border-slate-100">
                <SelectItem value="all">All Categories</SelectItem>
                {/* এখানে allCategories এখন নিরাপদ অ্যারে */}
                {allCategories.map((c: any) => (
                  <SelectItem key={c.id} value={c.id}>
                    {c.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* 🏷️ Sub-Category Select */}
            <div className="relative">
              <Select
                value={filters.subCategory}
                onValueChange={(val) => handleUpdate("subCategory", val)}
                disabled={
                  !filters.category ||
                  filters.category === "all" ||
                  subCategories.length === 0
                }
              >
                <SelectTrigger className="w-[180px] h-11 rounded-xl border-slate-200 bg-white font-medium hover:border-[#0064AE] transition-colors disabled:opacity-50">
                  <div className="flex items-center gap-2">
                    {subCatLoading ? (
                      <Loader2 size={14} className="animate-spin" />
                    ) : (
                      <FilterIcon size={14} className="text-slate-400" />
                    )}
                    <SelectValue placeholder="Sub-Category" />
                  </div>
                </SelectTrigger>
                <SelectContent className="rounded-xl shadow-2xl border-slate-100">
                  <SelectItem value="all">All Types</SelectItem>
                  {subCategories.map((s: any) => (
                    <SelectItem key={s.id} value={s.id}>
                      {s.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FilterSearch;
