/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useEffect, useState } from "react";
import { Bell, Menu, User, MessageCircle, Info } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { socketService } from "@/lib/socketService";
import { useGetNotificationsQuery, useGetUnreadCountQuery, useMarkAsReadMutation } from "@/redux/fetures/chat/notification";

interface UserNavbarProps {
  setIsMobileOpen: (val: boolean) => void;
  userData?: any;
}

const UserNavbarD = ({ setIsMobileOpen, userData }: UserNavbarProps) => {
  useEffect(() => {
    if (userData?.id || localStorage.getItem("userId")) {
      socketService.connect();
    }
  }, [userData]);

  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const { data: countData } = useGetUnreadCountQuery("en");
  const { data: listData } = useGetNotificationsQuery("en");
  const [markAsRead] = useMarkAsReadMutation();

  const unreadCount = countData?.data?.count || 0;
  const notifications = listData?.data || [];

  const handleNotificationClick = async (notif: any) => {
    if (!notif.isRead) {
      await markAsRead({ id: notif.id, lang: "en" }).unwrap();
    }

    if (notif.type === "NEW_MESSAGE") {
      if (notif.conversationId) {
        localStorage.setItem("activeChatId", notif.conversationId);
      }
      navigate("/user/dashboard/chat");
    } else if (notif.adId) {
      navigate(`/item-details/${notif.adId}`);
    }
    setIsOpen(false);
  };

  return (
    <nav className="h-16 bg-white border-b border-slate-200 sticky top-0 z-[40] px-4 md:px-8 flex items-center justify-between shrink-0">
      <div className="flex items-center gap-4">
        <button
          onClick={() => setIsMobileOpen(true)}
          className="lg:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-md"
        >
          <Menu size={24} />
        </button>
        <h2 className="hidden md:block text-[11px] font-black text-slate-400 uppercase tracking-[3px]">
          User Panel
        </h2>
      </div>

      <div className="flex items-center gap-2 md:gap-5 relative">
        {/* Bell Icon */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="relative cursor-pointer p-2 text-slate-500 hover:bg-slate-100 rounded-full transition-all"
        >
          <Bell size={20} className={unreadCount > 0 ? "text-[#0064AE]" : ""} />
          {unreadCount > 0 && (
            <span className="absolute top-1.5 right-1.5 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-[#0064AE] px-1 text-[10px] font-bold text-white border-2 border-white">
              {unreadCount}
            </span>
          )}
        </button>

        {/* Notification PopUp */}
        {isOpen && (
          <>
            <div
              className="fixed inset-0 z-10"
              onClick={() => setIsOpen(false)}
            />

            <div className="absolute top-12 right-0 w-80 bg-white border border-slate-200 rounded-lg shadow-xl z-50 overflow-hidden animate-in fade-in zoom-in duration-200">
              <div className="p-3 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
                <span className="text-sm font-bold text-slate-800">
                  Notification
                </span>
                {unreadCount > 0 && (
                  <span className="text-[10px] bg-red-100 text-red-600 px-2 py-0.5 rounded-full">
                    {unreadCount} New
                  </span>
                )}
              </div>

              <div className="max-h-[350px] overflow-y-auto">
                {notifications.length === 0 ? (
                  <div className="p-8 text-center text-slate-400 text-sm italic">
                    এখনো কোনো নোটিফিকেশন নেই
                  </div>
                ) : (
                  notifications.map((notif: any) => (
                    <div
                      key={notif.id}
                      onClick={() => handleNotificationClick(notif)}
                      className={`p-4 border-b border-slate-50 cursor-pointer hover:bg-slate-50 transition-colors flex gap-3 ${!notif.isRead ? "bg-blue-50/60" : ""}`}
                    >
                      <div
                        className={`w-9 h-9 rounded-full flex shrink-0 items-center justify-center ${notif.type === "NEW_MESSAGE" ? "bg-green-100 text-green-600" : "bg-blue-100 text-blue-600"}`}
                      >
                        {notif.type === "NEW_MESSAGE" ? (
                          <MessageCircle size={18} />
                        ) : (
                          <Info size={18} />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p
                          className={`text-xs truncate ${!notif.isRead ? "font-bold text-slate-900" : "text-slate-600"}`}
                        >
                          {notif.title}
                        </p>
                        <p className="text-[11px] text-slate-500 line-clamp-2 mt-0.5">
                          {notif.message}
                        </p>
                        <p className="text-[9px] text-slate-400 mt-1 font-medium">
                          {new Date(notif.createdAt).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                      </div>
                      {!notif.isRead && (
                        <div className="w-2 h-2 bg-blue-500 rounded-full self-center shrink-0" />
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          </>
        )}

        <div className="h-6 w-[1px] bg-slate-200 hidden md:block" />

        <div className="flex items-center gap-3 cursor-pointer pl-2 group">
          <div className="text-right hidden sm:block">
            <p className="text-xs font-black text-slate-900 leading-none">
              {userData?.nickName}
            </p>
            <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase">
              {userData.isVerified ? "Verified Buyer" : "Guest"}
            </p>
          </div>
          <div className="w-9 h-9 rounded-full bg-slate-50 border border-slate-200 flex items-center justify-center overflow-hidden">
            {userData?.profilePicture ? (
              <img
                src={userData.profilePicture}
                alt="p"
                className="w-full h-full object-cover"
              />
            ) : (
              <User size={18} className="text-slate-400" />
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default UserNavbarD;