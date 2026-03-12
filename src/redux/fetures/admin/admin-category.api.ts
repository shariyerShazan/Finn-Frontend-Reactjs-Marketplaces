/* eslint-disable @typescript-eslint/no-explicit-any */
import { baseApi } from "@/redux/api/baseApi";

export const adminCategoryApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // --- Category Endpoints ---
    // --- Category Endpoints ---
    getAllCategories: builder.query<
      any,
      { page?: number; limit?: number; search?: string } | void
    >({
      query: (params) => {
        const queryParams = new URLSearchParams();
        if (params?.page) queryParams.append("page", params.page.toString());
        if (params?.limit) queryParams.append("limit", params.limit.toString());
        if (params?.search) queryParams.append("search", params.search);

        return {
          url: `/categories?${queryParams.toString()}`,
          method: "GET",
        };
      },
      providesTags: ["Category"],
    }),

    getSingleCategory: builder.query<any, string>({
      query: (id) => `/categories/${id}`,
      providesTags: ["Category"],
    }),

    createCategory: builder.mutation({
      query: (formData) => ({
        url: "/categories",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["Category"],
    }),

    updateCategory: builder.mutation({
      query: ({ id, data }) => ({
        url: `/categories/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["Category"],
    }),

    deleteCategory: builder.mutation({
      query: (id) => ({
        url: `/categories/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Category"],
    }),

    // --- Sub-Category Endpoints (WITH PAGINATION) ---
    getAllSubCategories: builder.query<
      any,
      { page?: number; limit?: number } | void
    >({
      query: (params) => ({
        url: "/categories/sub-categories",
        params: params || { page: 1, limit: 10 },
      }),
      providesTags: ["SubCategory"],
    }),

    getSingleSubCategory: builder.query<any, string>({
      query: (id) => `/categories/sub-categories/${id}`,
      providesTags: ["SubCategory"],
    }),

    createSubCategory: builder.mutation<any, any>({
      query: (data) => ({
        url: "/categories/sub",
        method: "POST",
        body: data, // সরাসরি ডাটা যাবে
      }),
      invalidatesTags: ["SubCategory"],
    }),

    updateSubCategory: builder.mutation<
      any,
      { subCategoryId: string; data: any }
    >({
      query: ({ subCategoryId, data }) => ({
        url: `/categories/sub/${subCategoryId}`,
        method: "PATCH",
        body: data, // ডাটা এখানে বডি হিসেবে যাবে
      }),
      invalidatesTags: ["SubCategory"],
    }),

    deleteSubCategory: builder.mutation({
      query: (id) => ({
        url: `/categories/sub/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["SubCategory"],
    }),
  }),
});

export const {
  useGetAllCategoriesQuery,
  useGetSingleCategoryQuery,
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
  useGetAllSubCategoriesQuery,
  useGetSingleSubCategoryQuery,
  useCreateSubCategoryMutation,
  useUpdateSubCategoryMutation,
  useDeleteSubCategoryMutation,
} = adminCategoryApi;
