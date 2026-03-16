/* eslint-disable @typescript-eslint/no-explicit-any */
import { fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const rawBaseQuery = fetchBaseQuery({
  // baseUrl: "https://api.zen-buy.com",
  baseUrl:"http://localhost:3002",
  credentials: "include",
});

export const customBaseQuery = async (args: any, api: any, extraOptions: any) => {
  // get language from localStorage
  const lang = localStorage.getItem("lang");

  if (typeof args === "object" && lang) {
    args.params = {
      ...(args.params || {}),
      lang,
    };
  }

  return rawBaseQuery(args, api, extraOptions);
};