/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useMemo, useState } from "react";
import SearchChatSection from "./_components/SearchChatSection";
// import Chats from "./_components/Chats";
import {
  useGetMyConversationsQuery,
  useGetOnlineUsersQuery,
} from "@/redux/fetures/chat/chat.api";
import Chats from "./_components/Chats";
import { useMarkAllAsReadMutation } from "@/redux/fetures/chat/notification";
// import { useMarkAllAsReadMutation } from "@/redux/fetures/chat/notification";
// import { Chats } from "./_components/Chats";

const SellerChat = () => {

  const { data, isLoading } = useGetMyConversationsQuery();
  const [activeChatId, setActiveChatId] = useState<string | null>(() => {
    return localStorage.getItem("activeChatId");
  });

  const { data: onlineData } = useGetOnlineUsersQuery(undefined, {
    pollingInterval: 3000,
  });
  const [markAllRead] = useMarkAllAsReadMutation();
  useEffect(() => {
    const clearNotifications = async () => {
      try {
        await markAllRead("en").unwrap();
      } catch (err) {
        console.error("Failed to clear notifications:", err);
      }
    };

    clearNotifications();
  }, [markAllRead]);

  useEffect(() => {
    if (activeChatId) {
      localStorage.setItem("activeChatId", activeChatId);
    } else {
      localStorage.removeItem("activeChatId");
    }
  }, [activeChatId]);

  const conversations = data?.conversations || [];
  const onlineUsers = onlineData?.users || [];

  const activeConversation = conversations.find(
    (c: any) => c.id === activeChatId,
  );

  const isPartnerOnline = useMemo(() => {
    const partnerId = activeConversation?.participants[0]?.userId;
    return onlineUsers.includes(partnerId as any);
  }, [activeConversation, onlineUsers]);

  if (isLoading)
    return <div className="p-10 text-center">Loading Chats...</div>;

  return (
    <div translate="no" className="p-4 notranslate">
      <div className="flex h-[80vh] mx-auto border rounded-2xl overflow-hidden shadow-xl bg-white m-4">
        <SearchChatSection
          conversations={conversations}
          activeId={activeChatId}
          onSelect={setActiveChatId}
        />
        {activeChatId ? (
          <Chats
            conversationId={activeChatId}
            activePartner={activeConversation?.participants[0]?.user}
            isBlocked={activeConversation?.isBlocked}
            isOnline={isPartnerOnline}
          />
        ) : (
          <div className="flex-1 flex items-center justify-center bg-gray-50 text-gray-400">
            Select a chat to start messaging
          </div>
        )}
      </div>
    </div>
  );
};

export default SellerChat;