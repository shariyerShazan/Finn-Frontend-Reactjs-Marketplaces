/* eslint-disable @typescript-eslint/no-explicit-any */
import { baseApi } from "@/redux/api/baseApi";

export const adsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // --- Public/General Ads Endpoints ---

    getAllAds: builder.query<
      any,
      {
        page?: number;
        limit?: number;
        search?: string;
        isSold?: string;
        sortByPrice?: "asc" | "desc";
        subCategoryId: string;
        categoryId?: string;
      }
    >({
      query: (params) => ({
        url: "/ads",
        method: "GET",
        params: params,
      }),
      providesTags: ["Ad"],
    }),

    getAdById: builder.query<any, string>({
      query: (adId) => ({
        url: `/ads/${adId}`,
        method: "GET",
      }),
      providesTags: (arg) => [{ type: "Ad", id: arg }],
    }),

    // --- Seller Specific Mutations (Requires Auth) ---

    createAd: builder.mutation<any, FormData>({
      query: (formData) => ({
        url: "/ads",
        method: "POST",
        body: formData, // FormData directly sends as multipart/form-data
      }),
      invalidatesTags: ["Ad"],
    }),

    updateAd: builder.mutation<
      any,
      { adId: string | undefined; data: FormData }
    >({
      query: ({ adId, data }) => ({
        url: `/ads/${adId}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ({ adId }) => ["Ad", { type: "Ad", id: adId }],
    }),

    deleteAd: builder.mutation<any, string>({
      query: (adId) => ({
        url: `/ads/${adId}`,
        method: "DELETE",
      }),
      invalidatesTags: [{ type: "Ad", id: "LIST" }],
    }),

    toggleSoldStatus: builder.mutation<any, string>({
      query: (adId) => ({
        url: `/ads/${adId}/toggle-sold`,
        method: "PATCH",
      }),
      invalidatesTags: (adId) => [
        { type: "Ad", id: adId },
        { type: "Ad", id: "LIST" },
      ],
    }),

    // --- Engagement/Analytics ---

    recordAdView: builder.mutation<any, string>({
      query: (adId) => ({
        url: `/ads/${adId}/view`,
        method: "POST",
      }),
      // Usually doesn't need to invalidate unless views are shown live
    }),

    getAdViewers: builder.query<any, string>({
      query: (adId) => ({
        url: `/ads/${adId}/viewers`,
        method: "GET",
      }),
    }),
    getAdsBySeller: builder.query({
      query: ({ sellerId, page = 1, limit = 10, isSold = "" }) => ({
        url: `/ads/seller/${sellerId}`,
        params: { page, limit, isSold },
      }),
      providesTags: ["Ads"],
    }),
  }),
});

export const {
  useGetAllAdsQuery,
  useGetAdByIdQuery,
  useCreateAdMutation,
  useUpdateAdMutation,
  useDeleteAdMutation,
  useToggleSoldStatusMutation,
  useRecordAdViewMutation,
  useGetAdViewersQuery,
  useGetAdsBySellerQuery,
} = adsApi;
