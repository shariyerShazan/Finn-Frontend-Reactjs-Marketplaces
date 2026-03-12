/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useMemo } from "react";
import { useGetOnlineUsersQuery } from "@/redux/fetures/chat/chat.api";
import { Search, MoreHorizontal } from "lucide-react";

const SearchChatSection = ({ conversations, activeId, onSelect }: any) => {
  const [searchQuery, setSearchQuery] = useState("");
  const { data: onlineData } = useGetOnlineUsersQuery(undefined, {
    pollingInterval: 3000,
  });

  const onlineUsers = useMemo(() => onlineData?.users || [], [onlineData]);

  // Filter conversations with online partners
  const onlinePartners = useMemo(() => {
    return conversations
      .map((c: any) => ({
        id: c.id,
        userId: c.participants[0]?.userId,
        user: c.participants[0]?.user,
        isOnline: onlineUsers.includes(c.participants[0]?.userId),
      }))
      .filter((partner: any) => partner.isOnline);
  }, [conversations, onlineUsers]);

  // Filter conversations based on search query
  const filteredConversations = useMemo(() => {
    return conversations.filter((c: any) => {
      const partner = c.participants[0]?.user;
      const partnerId = c.participants[0]?.userId;
      const isOnline : boolean = onlineUsers.includes(partnerId);
console.log(isOnline)
      const fullName =
        `${partner?.firstName || ""} ${partner?.lastName || ""}`.toLowerCase();
      return fullName.includes(searchQuery.toLowerCase());
    });
  }, [conversations, searchQuery, onlineUsers]);

  return (
    <div className="w-full md:w-80 flex flex-col h-full bg-white border-r">
      {/* Header */}
      <div className="p-4 flex items-center justify-between border-b">
        <h3 className="text-lg font-bold">Chats</h3>
        <MoreHorizontal size={20} className="text-gray-400 cursor-pointer" />
      </div>

      {/* Search */}
      <div className="p-3">
        <div className="relative">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            size={16}
          />
          <input
            type="text"
            placeholder="Search Messenger"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-gray-100 border-none rounded-full py-2 pl-10 pr-4 text-sm outline-none focus:ring-2 focus:ring-blue-300"
          />
        </div>
      </div>

      {/* --- Online Partners Horizontal Section (Active Now) --- */}
      {onlinePartners.length > 0 && (
        <div className="px-4 py-2">
          <p className="text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wider">
            Active Now
          </p>
          <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
            {onlinePartners.map((partner: any) => (
              <div
                key={partner.id}
                onClick={() => onSelect(partner.id)}
                className="flex flex-col items-center gap-1 cursor-pointer min-w-[60px]"
              >
                <div className="relative">
                  <img
                    src={
                      partner.user?.profilePicture ||
                      `https://api.dicebear.com/7.x/avataaars/svg?seed=${partner.user?.firstName}`
                    }
                    className="w-12 h-12 rounded-full border-2 border-blue-500 p-0.5"
                    alt={partner.user?.firstName}
                  />
                  <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 border-2 border-white rounded-full"></span>
                </div>
                <span className="text-[10px] text-gray-600 font-medium truncate w-14 text-center">
                  {partner.user?.firstName}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Conversations List */}
      <div className="flex-1 overflow-y-auto">
        <p className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
          Recent Messages
        </p>
        {filteredConversations.length === 0 ? (
          <div className="p-4 text-center text-gray-400 text-sm">
            {searchQuery ? "No conversations found" : "No conversations yet"}
          </div>
        ) : (
          filteredConversations.map((c: any) => {
            const partner = c.participants[0]?.user;
            const partnerId = c.participants[0]?.userId;
            const isOnline = onlineUsers.includes(partnerId);

            return (
              <div
                key={c.id}
                onClick={() => onSelect(c.id)}
                className={`flex items-center gap-3 p-3 mx-2 rounded-xl cursor-pointer transition-all ${
                  activeId === c.id
                    ? "bg-blue-50 border-l-4 border-blue-500"
                    : "hover:bg-gray-50"
                }`}
              >
                <div className="relative flex-shrink-0">
                  <img
                    src={
                      partner?.profilePicture ||
                      `https://api.dicebear.com/7.x/avataaars/svg?seed=${partner?.firstName}`
                    }
                    className="w-12 h-12 rounded-full border object-cover"
                    alt=""
                  />
                  {isOnline && (
                    <span className="absolute bottom-0.5 right-0.5 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></span>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-baseline">
                    <h4 className="text-sm font-semibold text-gray-900 truncate">
                      {partner?.firstName} {partner?.lastName}
                    </h4>
                    {isOnline && (
                      <span className="text-[10px] text-green-500 font-medium ml-2">
                        Active
                      </span>
                    )}
                  </div>
                  <p
                    className={`text-xs truncate ${
                      c.isUnread ? "font-bold text-black" : "text-gray-500"
                    }`}
                  >
                    {c.messages?.[0]?.text || "Sent a photo"}
                  </p>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default SearchChatSection;
