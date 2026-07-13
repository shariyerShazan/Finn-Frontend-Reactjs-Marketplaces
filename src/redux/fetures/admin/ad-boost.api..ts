import { baseApi } from "@/redux/api/baseApi";

export const adBoostApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Get all boost packages (Admin/Seller)
    getAllBoostPackages: builder.query({
      query: () => ({
        url: "/ad-boost/packages/all",
        method: "GET",
      }),
      providesTags: ["AdBoost"],
    }),

    // Get a single boost package details
    getSingleBoostPackage: builder.query({
      query: (id: string) => ({
        url: `/ad-boost/${id}`,
        method: "GET",
      }),
      providesTags: (id) => [{ type: "AdBoost", id }],
    }),

    // Admin creates a boost package
    createBoostPackage: builder.mutation({
      query: (data) => ({
        url: "/ad-boost/package/create",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["AdBoost"],
    }),

    // Admin updates a boost package
    updateBoostPackage: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/ad-boost/package/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ({ id }) => [
        "AdBoost",
        { type: "AdBoost", id },
      ],
    }),

    // Admin deletes a boost package
    deleteBoostPackage: builder.mutation({
      query: (id: string) => ({
        url: `/ad-boost/delete/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["AdBoost"],
    }),

    // Seller applies a boost to an ad
    applyBoostToAd: builder.mutation({
      query: (data) => ({
        url: "/ad-boost/apply",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["AdBoost"], // Or specific Ad tags if you have them
    }),
  }),
});

export const {
  useGetAllBoostPackagesQuery,
  useGetSingleBoostPackageQuery,
  useCreateBoostPackageMutation,
  useUpdateBoostPackageMutation,
  useDeleteBoostPackageMutation,
  useApplyBoostToAdMutation,
} = adBoostApi;
