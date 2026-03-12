import { socketService } from "@/lib/socketService";
import { baseApi } from "@/redux/api/baseApi";
// import { socketService } from "@/services/socketService";

export const notificationApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getNotifications: builder.query({
      query: (lang = "en") => `/notifications?lang=${lang}`,
      providesTags: ["Notification"],
      async onCacheEntryAdded(
        arg,
        { updateCachedData, cacheDataLoaded, cacheEntryRemoved },
      ) {
        console.log(arg);
        try {
          await cacheDataLoaded;
          const socket = socketService.connect();

          socket.on("notification", (newNotification) => {
            updateCachedData((draft) => {
              if (draft && draft.data) {
                draft.data.unshift(newNotification);
              }
            });
          });
        } catch (error) {
          console.log(error);
        }
        await cacheEntryRemoved;
        socketService.getSocket()?.off("notification");
      },
    }),

    getUnreadCount: builder.query({
      query: (lang = "en") => `/notifications/unread-count?lang=${lang}`,
      providesTags: ["UnreadCount"],
      async onCacheEntryAdded(
        arg,
        { updateCachedData, cacheDataLoaded, cacheEntryRemoved },
      ) {
        try {
          console.log(arg);
          await cacheDataLoaded;
          const socket = socketService.connect();

          socket.on("notification", () => {
            updateCachedData((draft) => {
              if (draft && draft.data) {
                draft.data.count += 1; // কাউন্ট ১ বাড়িয়ে দেওয়া
              }
            });
          });
        } catch (error) {
          console.log(error);
        }
        await cacheEntryRemoved;
        socketService.getSocket()?.off("notification");
      },
    }),

    markAsRead: builder.mutation({
      query: ({ id, lang = "en" }) => ({
        url: `/notifications/${id}/read?lang=${lang}`,
        method: "PATCH",
      }),
      invalidatesTags: ["Notification", "UnreadCount"],
    }),

    markAllAsRead: builder.mutation({
      query: (lang = "en") => ({
        url: `/notifications/read-all?lang=${lang}`,
        method: "PATCH",
      }),
      invalidatesTags: ["Notification", "UnreadCount"],
    }),
  }),
});

export const {
  useGetNotificationsQuery,
  useGetUnreadCountQuery,
  useMarkAsReadMutation,
  useMarkAllAsReadMutation,
} = notificationApi;