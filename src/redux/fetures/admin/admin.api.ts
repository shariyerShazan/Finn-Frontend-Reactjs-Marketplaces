/* eslint-disable @typescript-eslint/no-explicit-any */
// import { baseApi } from "../baseApi";

import { baseApi } from "@/redux/api/baseApi";

export const adminApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // 📊 1. Dashboard Overall Statistics
    getAdminStats: builder.query<any, void>({
      query: () => "/admin/dashboard-stats",
      providesTags: ["AdminStats"],
    }),

    // 👥 2. User Management (All Users with Filters)
    getUsers: builder.query<any, any>({
      query: (params) => ({
        url: "/admin/users",
        method: "GET",
        params,
      }),
      providesTags: ["Auth", "Reports"],
    }),

    // 🔍 3. Single Item Details
    getSingleUser: builder.query<any, string>({
      query: (userId) => `/admin/users/${userId}`,
      providesTags: ["Auth"],
    }),

    getSingleAd: builder.query<any, string>({
      query: (adId) => `/admin/ads/${adId}`,
      providesTags: ["Ads"],
    }),

    getSinglePayment: builder.query<any, string>({
      query: (paymentId) => `/admin/payments/${paymentId}`,
      providesTags: ["Payments"],
    }),

    // 🏗️ 4. Seller Operations
    createSeller: builder.mutation<any, FormData>({
      query: (data) => ({
        url: "/admin/create-seller",
        method: "POST",
        body: data, // Multipart/form-data support
      }),
      invalidatesTags: ["Auth", "AdminStats"],
    }),

    updateSeller: builder.mutation<any, { userId: string; data: FormData }>({
      query: ({ userId, data }) => ({
        url: `/admin/update-seller/${userId}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["Auth"],
    }),

    deleteSeller: builder.mutation<any, string>({
      query: (userId) => ({
        url: `/admin/delete-seller/${userId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Auth", "AdminStats"],
    }),

    // 🚫 5. Suspension & Approval Logic
    toggleSuspension: builder.mutation<
      any,
      { userId: string; reason?: string }
    >({
      query: ({ userId, reason }) => ({
        url: `/admin/toggle-suspension/${userId}`,
        method: "PATCH",
        body: { reason },
      }),
      invalidatesTags: ["Auth", "AdminStats"],
    }),

    getRequestedSellers: builder.query<any, any>({
      query: (params) => ({
        url: "/admin/requested-sellers",
        method: "GET",
        params,
      }),
      providesTags: ["Sellers", "Auth", "Reports"],
    }),

    toggleApproval: builder.mutation<any, string>({
      query: (userId) => ({
        url: `/admin/toggle-approval/${userId}`,
        method: "PATCH",
      }),
      invalidatesTags: ["Sellers", "Auth", "AdminStats"],
    }),

    // 📦 6. Payments & Ads Listing
    getPayments: builder.query<any, any>({
      query: (params) => ({
        url: "/admin/payments",
        method: "GET",
        params,
      }),
      providesTags: ["Payments"],
    }),

    getAllAds: builder.query<any, any>({
      query: (params) => ({
        url: "/admin/ads",
        method: "GET",
        params,
      }),
      providesTags: ["Ads"],
    }),
    // redux/features/admin/admin.api.ts
    getRecentUsers: builder.query({
      query: () => ({
        url: "/admin/recent-users",
        method: "GET",
      }),
      providesTags: ["Auth"], // রিফ্রেশ বা ডিলিট হলে যাতে অটো আপডেট হয়
    }),
  }),
});

export const {
  useGetRecentUsersQuery,
  useGetAdminStatsQuery,
  useGetUsersQuery,
  useGetSingleUserQuery,
  useGetSingleAdQuery,
  useGetSinglePaymentQuery,
  useCreateSellerMutation,
  useUpdateSellerMutation,
  useDeleteSellerMutation,
  useToggleSuspensionMutation,
  useGetRequestedSellersQuery,
  useToggleApprovalMutation,
  useGetPaymentsQuery,
  useGetAllAdsQuery,
} = adminApi;
