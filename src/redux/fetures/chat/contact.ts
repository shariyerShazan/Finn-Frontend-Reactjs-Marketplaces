// import { baseApi } from "../api/baseApi";

import { baseApi } from "@/redux/api/baseApi";

export const contactApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({

    sendContactMessage: builder.mutation({
      query: (contactData: {
        name: string;
        email: string;
        subject: string;
        message: string;
      }) => ({
        url: "/mail/contact",
        method: "POST",
        body: contactData,
      }),
    }),
  }),
});

export const { useSendContactMessageMutation } = contactApi;
