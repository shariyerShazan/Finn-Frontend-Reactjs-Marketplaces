/* eslint-disable @typescript-eslint/no-explicit-any */
import { baseApi } from "../api/baseApi";

export const paymentsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getOnboardingLink: builder.query<{ url: string }, void>({
      query: () => ({
        url: "/payments/onboarding-link",
        method: "GET",
      }),
    }),

    createPaymentIntent: builder.mutation<any, { token: string; adId: string }>(
      {
        query: (paymentData) => ({
          url: "/payments/create-intent",
          method: "POST",
          body: paymentData,
        }),
        invalidatesTags: ["User", "Ads"],
      },
    ),
  }),
});

export const {
  useGetOnboardingLinkQuery,
  useLazyGetOnboardingLinkQuery,
  useCreatePaymentIntentMutation,
} = paymentsApi;
