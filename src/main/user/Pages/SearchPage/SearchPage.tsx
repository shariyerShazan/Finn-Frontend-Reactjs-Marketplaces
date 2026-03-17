/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useEffect, useState } from "react";
import {
  LayoutGrid,
  Map as MapIcon,
  Loader2,
  PackageSearch,
  // ExternalLink,
} from "lucide-react";
import FilterSearch from "./_components/FilterSearch";
import AdCard from "../HomePage/_components/AdCard";
import CommonPagination from "../../_components/CommonPagination";
import { useGetAllAdsQuery } from "@/redux/fetures/ads.api";
import { Link, useSearchParams } from "react-router-dom";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const SearchPage = () => {
  // Fix for default Leaflet marker icons in React
  const customIcon = new L.Icon({
    iconUrl:
      "[https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png](https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png)",
    shadowUrl:
      "[https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png](https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png)",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
  });

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

  const defaultCenter: [number, number] =
    ads.length > 0 && ads[0].latitude
      ? [ads[0].latitude, ads[0].longitude]
      : [23.8103, 90.4125]; // Default Dhaka

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
          <div className="w-full h-[75vh] rounded-[2rem] overflow-hidden border-4 border-white shadow-2xl z-10 relative group">
            {/* Floating Indicator */}
            <div className="absolute top-4 left-1/2 -translate-x-1/2 z-[1000] bg-white/90 backdrop-blur-md px-4 py-2 rounded-full shadow-lg border border-slate-200 text-xs font-bold text-slate-700 flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              Showing {ads?.length || 0} Available Locations
            </div>

            <MapContainer
              center={defaultCenter}
              zoom={13}
              scrollWheelZoom={true}
              className="w-full h-full"
              zoomControl={false}
              style={{ height: "100%", width: "100%" }}
            >
              {/* 🌍 Standard TileLayer: এটি কখনও মিস হবে না */}
              <TileLayer
                attribution='&copy; <a href="[https://www.openstreetmap.org/copyright](https://www.openstreetmap.org/copyright)">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />

              {ads?.map(
                (ad: any) =>
                  ad.latitude &&
                  ad.longitude && (
                    <Marker
                      key={ad.id}
                      position={[Number(ad.latitude), Number(ad.longitude)]}
                      icon={customIcon} // নিশ্চিত করুন customIcon উপরে ডিফাইন করা আছে
                    >
                      <Popup minWidth={260} className="custom-popup">
                        <div className="relative overflow-hidden rounded-xl bg-white">
                          <div className="relative h-32 w-full overflow-hidden">
                            <img
                              src={
                                ad.images?.[0]?.url ||
                                ad.images?.[0] ||
                                "[https://via.placeholder.com/300x200](https://via.placeholder.com/300x200)"
                              }
                              alt={ad.title}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="p-3">
                            <h4 className="font-bold text-slate-900 text-sm">
                              {ad.title}
                            </h4>
                            <p className="text-[#0064AE] font-bold text-xs">
                              {ad.price} {ad.currency || "PLN"}
                            </p>
                            <Link
                              to={`/item-details/${ad.id}`}
                              className="mt-3 block text-center bg-slate-900 text-white py-2 rounded-lg text-[11px] font-bold"
                            >
                              View Details
                            </Link>
                          </div>
                        </div>
                      </Popup>
                    </Marker>
                  ),
              )}
            </MapContainer>
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
