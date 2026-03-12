import { baseApi } from "../../api/baseApi";

export const reportApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    reportAd: builder.mutation({
      query: ({ adId, data }) => ({
        url: `/report/${adId}`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Reports"],
    }),

    getAllReports: builder.query({
      query: (params) => ({
        url: "/report/admin",
        method: "GET",
        params,
      }),
      providesTags: ["Reports"],
    }),

    deleteReport: builder.mutation({
      query: (reportId) => ({
        url: `/report/admin/${reportId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Reports"],
    }),

    getReportById: builder.query({
      query: (id) => ({
        url: `/report/${id}`,
        method: "GET",
      }),
      providesTags: ( id) => [{ type: "Reports", id }],
    }),

    suspendAuth: builder.mutation({
      query: ({ adId, reason }) => ({
        url: `/report/suspend-auth/${adId}`,
        method: "POST",
        body: { reason }, // NestJS @Body('reason') এর জন্য object আকারে পাঠানো জরুরি
      }),
      invalidatesTags: ["Reports" ],
    }),

    resolveReport: builder.mutation({
      query: (id) => ({
        url: `/report/${id}/resolve`,
        method: "PATCH",
      }),
      invalidatesTags: ["Reports"],
    }),
  }),
});

export const {
  useReportAdMutation,
  useGetAllReportsQuery,
  useDeleteReportMutation,
  useGetReportByIdQuery,
  useResolveReportMutation,
  useSuspendAuthMutation,
} = reportApi;
