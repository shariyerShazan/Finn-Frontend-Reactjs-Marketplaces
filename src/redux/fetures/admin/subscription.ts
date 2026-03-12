import { baseApi } from "@/redux/api/baseApi";


export const subscriptionApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
 
    getAllPlans: builder.query({
      query: () => ({
        url: "/subscription-plans/all",
        method: "GET",
      }),
      providesTags: ["SubscriptionPlan"],
    }),

    getSinglePlan: builder.query({
      query: (id: string) => ({
        url: `/subscription-plans/${id}`,
        method: "GET",
      }),
      providesTags: (id) => [{ type: "SubscriptionPlan", id }],
    }),

    createPlan: builder.mutation({
      query: (data) => ({
        url: "/subscription-plans/create",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["SubscriptionPlan"],
    }),

    updatePlan: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/subscription-plans/update/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ({ id }) => [
        "SubscriptionPlan",
        { type: "SubscriptionPlan", id },
      ],
    }),

    deletePlan: builder.mutation({
      query: (id: string) => ({
        url: `/subscription-plans/delete/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["SubscriptionPlan"],
    }),
  }),
});

export const {
  useGetAllPlansQuery,
  useGetSinglePlanQuery,
  useCreatePlanMutation,
  useUpdatePlanMutation,
  useDeletePlanMutation,
} = subscriptionApi;
