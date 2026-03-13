// // src/redux/api/baseApi.ts
// import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// // src/redux/api/baseApi.ts
// export const baseApi = createApi({
//   reducerPath: "baseApi",
//   baseQuery: fetchBaseQuery({
//     // baseUrl: "http://localhost:3002",
//     baseUrl:'https://www.zen-buy.com/api',
//     credentials: "include",
//     prepareHeaders: (headers) => {
//       // Jodi auth token cookie charao header e thake, ekhane add koren
//       // Kintu vul-eo headers.set('Content-Type', 'multipart/form-data') likhben na.
//       return headers;
//     },
//   }),
//   tagTypes: [
//     "User",
//     "Category",
//     "SubCategory",
//     "Ad",
//     "Ads",
//     "Chat",
//     "OnlineUsers",
//     "Comments",
//     "Reports",
//     "AdminStats",
//     "Auth",
//     "Sellers",
//     "Payments",
//     "SubscriptionPlan",
//   ],
//   endpoints: () => ({}),
// });

import { createApi } from "@reduxjs/toolkit/query/react";
import { customBaseQuery } from "./customBaseQuery";

export const baseApi = createApi({
  reducerPath: "baseApi",
  baseQuery: customBaseQuery,
  tagTypes: [
    "User",
    "Category",
    "SubCategory",
    "Ad",
    "Ads",
    "Chat",
    "OnlineUsers",
    "Comments",
    "Reports",
    "AdminStats",
    "Auth",
    "Sellers",
    "Payments",
    "SubscriptionPlan",
    "Notification",
    "UnreadCount"
    
  ],
  endpoints: () => ({}),
});