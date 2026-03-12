import { baseApi } from "../../api/baseApi"; 

export const commentApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({

    createComment: builder.mutation({
      query: (commentData) => {
        const formData = new FormData();
        formData.append("adId", commentData.adId);
        formData.append("message", commentData.message);
        if (commentData.parentId) {
          formData.append("parentId", commentData.parentId);
        }

        return {
          url: "/comments",
          method: "POST",
          body: formData, 
        };
      },
      invalidatesTags: ["Comments", "Ads"], 
    }),

    getCommentsByAd: builder.query({
      query: (adId: string) => ({
        url: `/comments/ad/${adId}`,
        method: "GET",
      }),
      providesTags: ( adId) => [{ type: "Comments", id: adId }],
    }),

    // ৩. কমেন্ট আপডেট করা
    updateComment: builder.mutation({
      query: ({ commentId, message }) => {
        const formData = new FormData();
        formData.append("message", message);

        return {
          url: `/comments/${commentId}`,
          method: "PATCH",
          body: formData,
        };
      },
      invalidatesTags: ["Comments"],
    }),

    // ৪. কমেন্ট ডিলিট করা
    deleteComment: builder.mutation({
      query: (commentId: string) => ({
        url: `/comments/${commentId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Comments"],
    }),
  }),
});

export const {
  useCreateCommentMutation,
  useGetCommentsByAdQuery,
  useUpdateCommentMutation,
  useDeleteCommentMutation,
} = commentApi;