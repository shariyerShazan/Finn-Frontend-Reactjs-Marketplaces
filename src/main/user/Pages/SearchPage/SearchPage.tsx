/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import {
  LayoutGrid,
  Map as MapIcon,
  Loader2,
  PackageSearch,
  SlidersHorizontal,
} from "lucide-react";

import FilterSearch from "./_components/FilterSearch";
// import MobileFilterSheet from "@/components/MobileFilterSheet";
import AdCard from "../HomePage/_components/AdCard";
import CommonPagination from "../../_components/CommonPagination";

import { useGetAllAdsQuery } from "@/redux/fetures/ads.api";
import { useSearchParams } from "react-router-dom";
import MobileFilterSheet from "./_components/MobileFilterSheet";

const SearchPage = () => {
  const [searchParams] = useSearchParams();
  const [viewMode, setViewMode] = useState<"grid" | "map">("grid");
  const [openFilter, setOpenFilter] = useState(false);

  const initialSearch = searchParams.get("search") || "";
  const initialCategory = searchParams.get("category") || "all";

  const [filters, setFilters] = useState({
    search: initialSearch,
    isSold: "false",
    sortByPrice: "asc" as "asc" | "desc",
    category: initialCategory,
    subCategory: "all",
    page: 1,
    limit: 12,
  });

  useEffect(() => {
    setFilters((prev) => ({
      ...prev,
      search: searchParams.get("search") || "",
      category: searchParams.get("category") || "all",
      page: 1,
    }));
  }, [searchParams]);

  const { data, isLoading, isFetching } = useGetAllAdsQuery({
    page: filters.page,
    limit: filters.limit,
    search: filters.search,
    isSold: filters.isSold,
    sortByPrice: filters.sortByPrice,
    categoryId: filters.category === "all" ? "" : filters.category,
    subCategoryId: filters.subCategory === "all" ? "" : filters.subCategory,
  });

  const ads = data?.data || [];
  const meta = data?.meta || { total: 0, page: 1, limit: 12 };
  const totalPages = Math.ceil(meta.total / meta.limit) || 1;

  return (
    <div className="min-h-screen bg-gray-50/30">
      {/* Desktop Filter */}
      <div className="hidden md:block">
        <FilterSearch filters={filters} setFilters={setFilters} />
      </div>

      {/* Mobile Filter Button */}
      <div className="md:hidden p-4">
        <button
          onClick={() => setOpenFilter(true)}
          className="flex items-center gap-2 px-4 py-2 bg-[#0064AE] text-white rounded-lg font-semibold"
        >
          <SlidersHorizontal size={18} />
          Filters
        </button>
      </div>

      <div className="mx-auto px-3 sm:px-6 pb-12">
        {/* Header */}
        <div className="sticky top-24 sm:top-28 z-40 py-3 sm:py-4 bg-gray-50/30 backdrop-blur-md">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <h2 className="text-gray-800 text-sm sm:text-base font-semibold flex items-center gap-2">
              Found
              <span className="text-[#0064AE] text-lg sm:text-xl font-bold">
                {isFetching ? (
                  <Loader2 className="animate-spin" size={18} />
                ) : (
                  meta.total
                )}
              </span>
              Ads
            </h2>

            {/* View Switch */}
            <div className="flex items-center bg-white p-1 rounded-xl border border-slate-200 shadow-sm">
              <button
                onClick={() => setViewMode("grid")}
                className={`px-4 py-2 rounded-lg ${
                  viewMode === "grid"
                    ? "bg-[#0064AE] text-white"
                    : "text-slate-500"
                }`}
              >
                <LayoutGrid size={18} />
              </button>

              <button
                onClick={() => setViewMode("map")}
                className={`px-4 py-2 rounded-lg ${
                  viewMode === "map"
                    ? "bg-[#0064AE] text-white"
                    : "text-slate-500"
                }`}
              >
                <MapIcon size={18} />
              </button>
            </div>
          </div>
        </div>

        {/* Content */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center h-[50vh]">
            <Loader2 className="animate-spin text-[#0064AE] mb-3" size={48} />
            <p className="text-slate-500 font-medium animate-pulse">
              Curating the best ads for you...
            </p>
          </div>
        ) : viewMode === "grid" ? (
          <>
            {ads.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3 sm:gap-6 gap-y-8">
                {ads.map((ad: any) => (
                  <AdCard key={ad.id} ad={ad} />
                ))}
              </div>
            ) : (
              <div className="text-center py-20">
                <PackageSearch
                  size={60}
                  className="text-gray-300 mx-auto mb-4"
                />
                <p className="text-gray-500">No ads found</p>
              </div>
            )}
          </>
        ) : (
          <div className="h-[60vh] flex items-center justify-center bg-gray-100 rounded-2xl">
            Map view
          </div>
        )}

        {/* Pagination */}
        {!isLoading && totalPages > 1 && (
          <div className="mt-16 flex justify-center">
            <CommonPagination
              currentPage={filters.page}
              totalPages={totalPages}
              onPageChange={(page) => setFilters((prev) => ({ ...prev, page }))}
            />
          </div>
        )}
      </div>

      {/* Mobile Bottom Sheet */}
      <MobileFilterSheet open={openFilter} setOpen={setOpenFilter}>
        <FilterSearch filters={filters} setFilters={setFilters} />
      </MobileFilterSheet>
    </div>
  );
};

export default SearchPage;
