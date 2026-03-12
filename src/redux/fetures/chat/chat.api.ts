/* eslint-disable @typescript-eslint/no-explicit-any */

import { baseApi } from "@/redux/api/baseApi";
import { socketService } from "@/lib/socketService";

export interface UserBasicInfo {
  firstName: string;
  lastName: string;
  profilePicture: string | null;
  role: string;
}

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  text: string | null;
  fileUrl: string | null;
  fileType: string | null;
  isRead: boolean;
  createdAt: string;
  sender: UserBasicInfo;
}

export interface Participant {
  userId: string;
  user: UserBasicInfo;
  isOnline?: boolean;
}

export interface Conversation {
  id: string;
  isBlocked: boolean;
  blockedById: string | null;
  updatedAt: string;
  participants: Participant[];
  messages?: Message[];
}

export interface ChatResponse<T> {
  success: boolean;
  message?: string;
  conversation?: T;
  conversations?: T[];
  messages?: T[];
}

export const chatApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getMyConversations: builder.query<ChatResponse<Conversation>, void>({
      query: () => "/chat/conversations",
      providesTags: ["Chat"],

      async onCacheEntryAdded(
        arg,
        { updateCachedData, cacheDataLoaded, cacheEntryRemoved },
      ): Promise<any> {
        const socket = socketService.connect();
        console.log(arg)
        try {
          await cacheDataLoaded;

          // Listen for online users list updates
          const handleOnlineUsers = (onlineUserIds: string[]) => {
            updateCachedData((draft) => {
              if (draft.conversations) {
                draft.conversations.forEach((conversation) => {
                  // Mark participants as online if they're in the online list
                  conversation.participants.forEach((participant) => {
                    participant.isOnline = onlineUserIds.includes(
                      participant.userId,
                    );
                  });
                });
              }
            });
          };

          socket.on("onlineUsers.list", handleOnlineUsers);

          return () => {
            socket.off("onlineUsers.list", handleOnlineUsers);
          };
        } catch (err) {
          console.error("Socket Error in getMyConversations:", err);
        }

        await cacheEntryRemoved;
      },
    }),

    getMessages: builder.query<ChatResponse<Message>, string>({
      query: (conversationId) => `/chat/messages/${conversationId}`,
      providesTags: (id) => [{ type: "Messages", id }] as any,

      async onCacheEntryAdded(
        arg,
        { updateCachedData, cacheDataLoaded, cacheEntryRemoved },
      ): Promise<any> {
        const socket = socketService.connect();

        try {
          await cacheDataLoaded;

          // Join the conversation room
          socket.emit("join_room", { conversationId: arg });

          // Listen for new messages in this conversation
          const handleNewMessage = (newMessage: Message) => {
            updateCachedData((draft) => {
              if (draft.success) {
                // Avoid duplicate messages
                const exists = draft.messages?.some(
                  (m) => m.id === newMessage.id,
                );
                if (!exists) {
                  draft.messages?.push(newMessage);
                }
              }
            });
          };

          // Listen for conversation block status
          const handleConversationBlocked = (payload: {
            conversationId: string;
            blockedBy: string;
          }) => {
            console.log("Conversation blocked:", payload);
            // Update blocked status if needed
          };

          socket.on("message.send", handleNewMessage);
          socket.on("conversation.blocked", handleConversationBlocked);

          return () => {
            socket.off("message.send", handleNewMessage);
            socket.off("conversation.blocked", handleConversationBlocked);
          };
        } catch (err) {
          console.error("Socket Error in getMessages:", err);
        }

        await cacheEntryRemoved;
      },
    }),

    sendMessage: builder.mutation<ChatResponse<Message>, FormData>({
      query: (formData) => ({
        url: "/chat/message",
        method: "POST",
        body: formData,
      }),
    }),

    startChat: builder.mutation<
      ChatResponse<Conversation>,
      { targetUserId: string }
    >({
      query: (data) => ({
        url: "/chat/start",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Chat"],
    }),

    blockChat: builder.mutation<any, string>({
      query: (conversationId: any) => ({
        url: `/chat/block/${conversationId}`,
        method: "PATCH",
      }),
      invalidatesTags: (id: any) => [
        "Chat",
        { type: "Messages", id },
      ],
    } as any),

    // ৬. চ্যাট আনব্লক করা
    unblockChat: builder.mutation<any, string>({
      query: (conversationId: any) => ({
        url: `/chat/unblock/${conversationId}`,
        method: "PATCH",
      }),
      invalidatesTags: ( id: any) => [
        "Chat",
        { type: "Messages", id },
      ],
    } as any),

    deleteConversation: builder.mutation<ChatResponse<null>, string>({
      query: (conversationId) => ({
        url: `/chat/${conversationId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Chat"],
    }),

    getOnlineUsers: builder.query<{ success: boolean; users: string[] }, void>({
      query: () => "/chat/online-users",
      providesTags: ["OnlineUsers"],

      async onCacheEntryAdded(
        arg,
        { updateCachedData, cacheDataLoaded, cacheEntryRemoved },
      ) : Promise<any>{
        const socket = socketService.connect();
console.log(arg)
        try {
          await cacheDataLoaded;

          // Listen for real-time online users updates
          const handleOnlineUsers = (onlineUserIds: string[]) => {
            updateCachedData((draft) => {
              draft.users = onlineUserIds;
            });
          };

          socket.on("onlineUsers.list", handleOnlineUsers);

          return () => {
            socket.off("onlineUsers.list", handleOnlineUsers);
          };
        } catch (err) {
          console.error("Socket Error in getOnlineUsers:", err);
        }

        await cacheEntryRemoved;
      },
    }),
  }),
});

export const {
  useGetMyConversationsQuery,
  useGetMessagesQuery,
  useSendMessageMutation,
  useStartChatMutation,
  useBlockChatMutation,
  useUnblockChatMutation,
  useDeleteConversationMutation,
  useGetOnlineUsersQuery,
} = chatApi;
