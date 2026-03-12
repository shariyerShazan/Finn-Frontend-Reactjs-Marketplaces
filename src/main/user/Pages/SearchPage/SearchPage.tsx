/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useEffect, useState } from "react";
import {
  LayoutGrid,
  Map as MapIcon,
  Loader2,
  PackageSearch,
} from "lucide-react";
import FilterSearch from "./_components/FilterSearch";
import AdCard from "../HomePage/_components/AdCard";
import CommonPagination from "../../_components/CommonPagination";
import { useGetAllAdsQuery } from "@/redux/fetures/ads.api";
import { useSearchParams } from "react-router-dom";

const SearchPage = () => {
  const [searchParams] = useSearchParams();
  const [viewMode, setViewMode] = useState<"grid" | "map">("grid");
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
      {/* 🔍 Sticky Filter Section */}
      <FilterSearch filters={filters} setFilters={setFilters} />

      <div className="mx-auto px-6 pb-12">
        {/* 📊 Header Section */}
        <div className="sticky top-30 z-40 py-4 bg-gray-50/30 backdrop-blur-md">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div>
              <h2 className="text-gray-800 text-base font-semibold flex items-center gap-2">
                Found{" "}
                <span className="text-[#0064AE] text-xl font-bold">
                  {isFetching ? (
                    <Loader2 className="animate-spin" size={18} />
                  ) : (
                    meta.total
                  )}
                </span>{" "}
                Ads for your search
              </h2>
            </div>

            {/* View Switcher Controls */}
            <div className="flex items-center bg-white p-1 rounded-xl border border-slate-200 shadow-sm">
              <button
                onClick={() => setViewMode("grid")}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all ${
                  viewMode === "grid"
                    ? "bg-[#0064AE] text-white shadow-md"
                    : "text-slate-500 hover:bg-slate-50"
                }`}
              >
                <LayoutGrid size={18} />
              </button>
              <button
                onClick={() => setViewMode("map")}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all ${
                  viewMode === "map"
                    ? "bg-[#0064AE] text-white shadow-md"
                    : "text-slate-500 hover:bg-slate-50"
                }`}
              >
                <MapIcon size={18} />
              </button>
            </div>
          </div>
        </div>

        {/* 📦 Main Display Area */}
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
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-x-6 gap-y-12 animate-in fade-in duration-700">
                {ads.map((ad: any) => (
                  <AdCard key={ad.id} ad={ad} />
                ))}
              </div>
            ) : (
              <div className="text-center py-24 bg-white rounded-3xl border-2 border-dashed border-slate-200 flex flex-col items-center">
                <PackageSearch size={64} className="text-slate-300 mb-4" />
                <h3 className="text-xl font-bold text-slate-800">
                  No results found
                </h3>
                <p className="text-slate-500 max-w-xs mx-auto mt-2">
                  Try adjusting your filters or search keywords to find what
                  you're looking for.
                </p>
                <button
                  onClick={() =>
                    setFilters({
                      ...filters,
                      search: "",
                      category: "all",
                      subCategory: "all",
                    })
                  }
                  className="mt-6 text-[#0064AE] font-bold hover:underline"
                >
                  Clear all filters
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="w-full h-[60vh] bg-slate-100 rounded-3xl border border-slate-200 flex items-center justify-center animate-in zoom-in duration-300">
            <div className="text-center">
              <MapIcon
                size={56}
                className="text-[#0064AE] mx-auto mb-4 opacity-20"
              />
              <h3 className="text-xl font-bold text-slate-800">
                Map Interface Ready
              </h3>
              <p className="text-slate-500 italic">
                Bhai, Google Maps API key dilei visual-ta joss hobe!
              </p>
            </div>
          </div>
        )}

        {/* 📄 Pagination Controls */}
        {!isLoading && totalPages > 1 && (
          <div className="mt-20 flex justify-center">
            <CommonPagination
              currentPage={filters.page}
              totalPages={totalPages}
              onPageChange={(page) => setFilters((prev) => ({ ...prev, page }))}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchPage;
