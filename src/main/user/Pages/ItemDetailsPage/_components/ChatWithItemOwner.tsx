/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
// import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { MessageCircle, Loader2 } from "lucide-react";
import { toast } from "react-toastify";
import { useStartChatMutation } from "@/redux/fetures/chat/chat.api";

const ChatWithItemOwner = ({ sellerId, sellerName }: any) => {
  const navigate = useNavigate();
  const [startChat, { isLoading }] = useStartChatMutation();

  const handleStartChat = async () => {
    try {
      // ১. চ্যাট শুরু করার API কল
      const res = await startChat({ targetUserId: sellerId }).unwrap();

      // ২. যদি সফল হয় এবং কনভারসেশন আইডি পাওয়া যায়
      if (res?.conversation?.id) {
        // localStorage-এ আইডি সেট করা যাতে UserChat পেজ এটা রিড করতে পারে
        localStorage.setItem("activeChatId", res.conversation.id);

        toast.success(`Opening chat with ${sellerName || "Seller"}`);

        // ৩. চ্যাট পেজে রিডাইরেক্ট
        navigate("/user/dashboard/chat");
      }
    } catch (err : any) {
      toast.error(
        err?.data?.message || "Failed to start chat. Are you logged in?",
      );
    }
  };

  return (
    <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm space-y-4 hover:shadow-md transition-shadow">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 bg-[#0064AE]/10 rounded-full flex items-center justify-center">
          <MessageCircle className="text-[#0064AE]" size={24} />
        </div>
        <div>
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
            Interested in this item?
          </p>
          <p className="font-bold text-slate-800">
            Chat with {sellerName || "Seller"}
          </p>
        </div>
      </div>
      <Button
        onClick={handleStartChat}
        disabled={isLoading}
        className="w-full bg-[#0064AE] hover:bg-[#004f8b] py-6 rounded-2xl font-bold gap-2 shadow-lg shadow-[#0064AE]/20 transition-all active:scale-95"
      >
        {isLoading ? (
          <Loader2 className="animate-spin" size={18} />
        ) : (
          <>
            Send Message <MessageCircle size={18} />
          </>
        )}
      </Button>
    </div>
  );
};

export default ChatWithItemOwner;
