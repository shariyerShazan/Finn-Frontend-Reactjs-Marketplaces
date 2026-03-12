import { baseApi } from "@/redux/api/baseApi";


export const paymentApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createCheckoutSession: builder.mutation({
      query: (planId: string) => ({
        url: "/payments/create-checkout-session",
        method: "POST",
        body: { planId },
      }),
    }),

    getMyPaymentHistory: builder.query({
      query: () => ({
        url: "/user/subscription/my-history",
        method: "GET",
      }),
      providesTags: ["Payments"],
    }),

    getAllPaymentHistory: builder.query({
      query: () => ({
        url: "/payments/all-history",
        method: "GET",
      }),
      providesTags: ["Payments"],
    }),

    getSinglePaymentDetail: builder.query({
      query: (id: string) => ({
        url: `/payments/history/${id}`,
        method: "GET",
      }),
      providesTags: (id) => [{ type: "Payments", id }],
    }),
  }),
});

export const {
  useCreateCheckoutSessionMutation,
  useGetAllPaymentHistoryQuery,
  useGetSinglePaymentDetailQuery,
  useGetMyPaymentHistoryQuery,
} = paymentApi;
