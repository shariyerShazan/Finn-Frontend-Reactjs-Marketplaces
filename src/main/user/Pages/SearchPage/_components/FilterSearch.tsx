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

      if (key === "category") {
        updated.subCategory = "all";
      }

      return updated;
    });
  };

  return (
    <div className="w-full bg-white">
      <div className="mx-auto px-4 py-4">
        <div className="flex flex-col  gap-4">
          {/* Search */}
          <div className="relative group w-full">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
              <Search size={18} />
            </div>

            <Input
              placeholder="Search ads..."
              className="pl-10 h-11 rounded-xl"
              value={filters.search}
              onChange={(e) => handleUpdate("search", e.target.value)}
            />
          </div>

          <Separator />

          {/* Filters */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            {/* Sort */}
            <Select
              value={filters.sortByPrice}
              onValueChange={(val) => handleUpdate("sortByPrice", val)}
            >
              <SelectTrigger className="h-11 rounded-xl">
                <div className="flex items-center gap-2">
                  <ArrowUpNarrowWide size={15} />
                  <SelectValue placeholder="Sort price" />
                </div>
              </SelectTrigger>

              <SelectContent position="popper" className="z-[9999]">
                <SelectItem value="asc">Low → High</SelectItem>
                <SelectItem value="desc">High → Low</SelectItem>
              </SelectContent>
            </Select>

            {/* Status */}
            <Select
              value={filters.isSold}
              onValueChange={(val) => handleUpdate("isSold", val)}
            >
              <SelectTrigger className="h-11 rounded-xl">
                <div className="flex items-center gap-2">
                  {filters.isSold === "true" ? (
                    <XCircle size={15} className="text-red-500" />
                  ) : (
                    <CheckCircle2 size={15} className="text-green-500" />
                  )}
                  <SelectValue placeholder="Status" />
                </div>
              </SelectTrigger>

              <SelectContent position="popper" className="z-[9999]">
                <SelectItem value="false">Available</SelectItem>
                <SelectItem value="true">Sold</SelectItem>
              </SelectContent>
            </Select>

            {/* Category */}
            <Select
              value={filters.category}
              onValueChange={(val) => handleUpdate("category", val)}
            >
              <SelectTrigger className="h-11 rounded-xl">
                <div className="flex items-center gap-2">
                  {catLoading ? (
                    <Loader2 size={14} className="animate-spin" />
                  ) : (
                    <Layers size={16} />
                  )}
                  <SelectValue placeholder="Category" />
                </div>
              </SelectTrigger>

              <SelectContent position="popper" className="z-[9999]">
                <SelectItem value="all">All Categories</SelectItem>

                {allCategories.map((c: any) => (
                  <SelectItem key={c.id} value={c.id}>
                    {c.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Sub Category */}
            <Select
              value={filters.subCategory}
              onValueChange={(val) => handleUpdate("subCategory", val)}
              disabled={
                !filters.category ||
                filters.category === "all" ||
                subCategories.length === 0
              }
            >
              <SelectTrigger className="h-11 rounded-xl">
                <div className="flex items-center gap-2">
                  {subCatLoading ? (
                    <Loader2 size={14} className="animate-spin" />
                  ) : (
                    <FilterIcon size={14} />
                  )}
                  <SelectValue placeholder="Sub category" />
                </div>
              </SelectTrigger>

              <SelectContent position="popper" className="z-[9999]">
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
  );
};

export default FilterSearch;
