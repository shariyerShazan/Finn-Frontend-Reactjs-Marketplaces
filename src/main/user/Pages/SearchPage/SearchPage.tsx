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
} from "lucide-react";

import FilterSearch from "./_components/FilterSearch";
import AdCard from "../HomePage/_components/AdCard";
import CommonPagination from "../../_components/CommonPagination";

import { useGetAllAdsQuery } from "@/redux/fetures/ads.api";
import { Link, useSearchParams } from "react-router-dom";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

/* ✅ FIX Leaflet Marker Icon Issue (IMPORTANT) */
delete (L.Icon.Default.prototype as any)._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
});

const SearchPage = () => {
  const [searchParams] = useSearchParams();
  // const [viewMode, setViewMode] = useState<"grid" | "map">("grid");
  const [viewMode, setViewMode] = useState<"grid" | "map">(() => {
    return searchParams.get("view") === "map" ? "map" : "grid";
  });

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

  // const defaultCenter: [number, number] =
  //   ads.length > 0 && ads[0].latitude
  //     ? [Number(ads[0].latitude), Number(ads[0].longitude)]
  //     : [23.8103, 90.4125];
const defaultCenter: [number, number] =
  ads.length > 0 && ads[0].latitude
    ? [Number(ads[0].latitude), Number(ads[0].longitude)]
    : [62.0, 15.0]; // Nordic balanced center
  return (
    <div className="min-h-screen bg-gray-50/30">
      {/* 🔍 Filters */}
      <FilterSearch filters={filters} setFilters={setFilters} />

      <div className="mx-auto px-6 pb-12">
        {/* 📊 Header */}
        <div className="top-30 z-40 py-4 bg-gray-50/30 backdrop-blur-md">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <h2 className="text-gray-800 text-base font-semibold flex items-center gap-2">
              Found
              <span className="text-[#0064AE] text-xl font-bold">
                {isFetching ? (
                  <Loader2 className="animate-spin" size={18} />
                ) : (
                  meta.total
                )}
              </span>
              Ads
            </h2>

            {/* View Toggle */}
            <div className="flex bg-white p-1 rounded-xl border shadow-sm">
              <button
                onClick={() => setViewMode("grid")}
                className={`px-4 py-2 rounded-lg ${
                  viewMode === "grid"
                    ? "bg-[#0064AE] text-white"
                    : "text-gray-500"
                }`}
              >
                <LayoutGrid size={18} />
              </button>
              <button
                onClick={() => setViewMode("map")}
                className={`px-4 py-2 rounded-lg ${
                  viewMode === "map"
                    ? "bg-[#0064AE] text-white"
                    : "text-gray-500"
                }`}
              >
                <MapIcon size={18} />
              </button>
            </div>
          </div>
        </div>

        {/* 📦 Content */}
        {/* 📦 Content */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center h-[50vh]">
            <Loader2 className="animate-spin text-[#0064AE]" size={40} />
          </div>
        ) : viewMode === "grid" ? (
          ads.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
              {ads.map((ad: any) => (
                <AdCard key={ad.id} ad={ad} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <PackageSearch size={60} className="mx-auto text-gray-300" />
              <p>No ads found</p>
            </div>
          )
        ) : (
          /* 🗺️ MAP VIEW (UPDATED DESIGN) */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 h-[80vh]">
            {/* 📦 LEFT SIDE (ADS LIST - DESKTOP ONLY) */}
            <div className="hidden lg:block lg:col-span-7 h-full overflow-y-auto pr-2">
              {ads.length > 0 ? (
                <div className="grid grid-cols-2 xl:grid-cols-3 gap-4">
                  {ads.map((ad: any) => (
                    <AdCard key={ad.id} ad={ad} />
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-full">
                  <PackageSearch size={50} className="text-gray-300 mb-2" />
                  <p className="text-gray-500 text-sm">No ads found</p>
                </div>
              )}
            </div>

            {/* 🗺️ RIGHT SIDE (MAP) */}
            <div className="col-span-1 lg:col-span-5 w-full h-full rounded-2xl overflow-hidden border">
              <MapContainer
                center={defaultCenter}
                zoom={5}
                className="w-full h-full"
              >
                <TileLayer
                attribution='&copy; OpenStreetMap contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

                {ads.map(
                  (ad: any) =>
                    ad.latitude &&
                    ad.longitude && (
                      <Marker
                        key={ad.id}
                        position={[Number(ad.latitude), Number(ad.longitude)]}
                      >
                        <Popup>
                          <div>
                            <img
                              src={
                                ad.images?.[0]?.url ||
                                "https://via.placeholder.com/300"
                              }
                              className="w-full h-24 object-cover rounded"
                            />
                            <h4 className="font-bold text-sm mt-2">
                              {ad.title}
                            </h4>
                            <p className="text-blue-600 font-bold text-xs">
                              {ad.price}
                            </p>

                            <Link to={`/item-details/${ad.id}`}>
                              View Details
                            </Link>
                          </div>
                        </Popup>
                      </Marker>
                    ),
                )}
              </MapContainer>
            </div>
          </div>
        )}

        {/* 📄 Pagination */}
        {!isLoading && totalPages > 1 && (
          <div className="mt-10 flex justify-center">
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
