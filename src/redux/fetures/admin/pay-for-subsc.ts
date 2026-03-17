import { baseApi } from "@/redux/api/baseApi";

export const paymentApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // --- Existing Subscription Endpoints (Updated Paths) ---
    createCheckoutSession: builder.mutation({
      query: (planId: string) => ({
        url: "/payments/create-checkout-session",
        method: "POST",
        body: { planId },
      }),
      invalidatesTags: ["Payments"],
    }),

    getMyPaymentHistory: builder.query({
      query: () => ({
        url: "user/subscription/my-history", // Match your personal history route
        method: "GET",
      }),
      providesTags: ["Payments"],
    }),

    getAllPaymentHistory: builder.query({
      query: () => ({
        url: "/payments/all-sub-history",
        method: "GET",
      }),
      providesTags: ["Payments"],
    }),

    getSinglePaymentDetail: builder.query({
      query: (id: string) => ({
        url: `/payments/sub-history/${id}`,
        method: "GET",
      }),
      providesTags: (id) => [{ type: "Payments", id }],
    }),

    // --- New Ad Boost Endpoints ---
    createBoostCheckoutSession: builder.mutation({
      query: (data: { adId: string; packageId: string }) => ({
        url: "/payments/create-boost-session",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Boosts"],
    }),

    getMyBoostHistory: builder.query({
      query: () => ({
        url: "/payments/boost-history",
        method: "GET",
      }),
      providesTags: ["Boosts"],
    }),

    getAllBoostHistory: builder.query({
      query: () => ({
        url: "/payments/all-boost-history",
        method: "GET",
      }),
      providesTags: ["Boosts"],
    }),
  }),
});

export const {
  // Original Hooks
  useCreateCheckoutSessionMutation,
  useGetAllPaymentHistoryQuery,
  useGetSinglePaymentDetailQuery,
  useGetMyPaymentHistoryQuery,

  // New Hooks
  useCreateBoostCheckoutSessionMutation,
  useGetMyBoostHistoryQuery,
  useGetAllBoostHistoryQuery,
} = paymentApi;
