/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useRef, useEffect } from "react";
import {
  Image as ImageIcon,
  Send,
  MoreVertical,
  X,
  Trash2,
  ShieldBan,
  Loader2,
  Circle,
} from "lucide-react";
import Swal from "sweetalert2";
import { useSelector } from "react-redux"; // আপনার Auth state থেকে userId পাওয়ার জন্য
import {
  useBlockChatMutation,
  useDeleteConversationMutation,
  useGetMessagesQuery,
  // useGetOnlineUsersQuery,
  useSendMessageMutation,
  useUnblockChatMutation,
} from "@/redux/fetures/chat/chat.api";
import { toast } from "react-toastify";

const Chats = ({ conversationId, activePartner, isBlocked, isOnline }: any) => {
  // Get user ID from Redux, JWT token (cookie/localStorage) or localStorage
  const user = useSelector((state: any) => state.auth?.user);
  const getIdFromToken = (token?: string | null) => {
    try {
      if (!token) return null;
      const parts = token.split(".");
      if (parts.length < 2) return null;
      const payload = JSON.parse(atob(parts[1]));
      return payload.userId || payload.id || payload.sub || null;
    } catch (e) {
      console.log(e);
      return null;
    }
  };

  const tokenFromLocal = localStorage.getItem("token");
  const cookieToken = document.cookie
    .split("; ")
    .find((row) => row.startsWith("token="))
    ?.split("=")[1];
  const token = tokenFromLocal || cookieToken || null;
  const tokenUserId = getIdFromToken(token);

  const currentUserId =
    user?.id || tokenUserId || localStorage.getItem("userId") || null;

  const [inputText, setInputText] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [showMenu, setShowMenu] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // ২. API Hooks
  const { data, isLoading } = useGetMessagesQuery(conversationId);
  const [sendMessage, { isLoading: isSending }] = useSendMessageMutation();
  const [blockChat] = useBlockChatMutation();
  const [unblockChat] = useUnblockChatMutation();
  const [deleteChat] = useDeleteConversationMutation();

  // Online Status Check

  // Auto-scroll to bottom when new messages arrive
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [data?.messages]);

  // ৪. ইমেজ হ্যান্ডলিং
  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  // ৫. মেসেজ পাঠানো
  const handleSend = async () => {
    if (!inputText.trim() && !imageFile) return;
    if (isBlocked) return toast.error("This conversation is blocked");

    const formData = new FormData();
    formData.append("conversationId", conversationId);
    if (inputText) formData.append("text", inputText);
    if (imageFile) formData.append("images", imageFile);

    try {
      await sendMessage(formData).unwrap();
      setInputText("");
      setImageFile(null);
      setImagePreview(null);
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to send message");
    }
  };

  if (isLoading)
    return (
      <div className="flex-1 flex items-center justify-center bg-gray-50">
        <Loader2 className="animate-spin text-blue-500" size={32} />
      </div>
    );

  return (
    <div className="flex-1 flex flex-col h-full bg-white relative">
      {/* Header (Messenger Style) */}
      <div className="p-4 border-b flex items-center justify-between shadow-sm bg-white z-10">
        <div className="flex items-center gap-3">
          <div className="relative">
            <img
              src={
                activePartner?.profilePicture ||
                `https://api.dicebear.com/7.x/avataaars/svg?seed=${activePartner?.firstName}`
              }
              className="w-10 h-10 rounded-full border object-cover"
              alt="partner"
            />
            {isOnline && (
              <Circle className="absolute bottom-0 right-0 w-3 h-3 text-green-500 fill-green-500 border-2 border-white rounded-full" />
            )}
          </div>
          <div>
            <h3 className="text-sm font-bold text-gray-800">
              {activePartner?.firstName} {activePartner?.lastName}
            </h3>
            <p
              className={`text-[11px] ${isOnline ? "text-green-500 font-medium" : "text-gray-400"}`}
            >
              {isOnline ? "Active now" : "Offline"}
            </p>
          </div>
        </div>

        <div className="relative">
          <MoreVertical
            className="text-gray-500 cursor-pointer hover:bg-gray-100 rounded-full p-1"
            size={28}
            onClick={() => setShowMenu(!showMenu)}
          />
          {showMenu && (
            <div className="absolute right-0 mt-2 w-48 bg-white border rounded-xl shadow-xl z-50 py-2">
              {/* Block/Unblock Button */}
              <button
                onClick={() => {
                  setShowMenu(false);

                  const actionText = isBlocked ? "unblock" : "block";

                  Swal.fire({
                    title: `Are you sure you want to ${actionText}?`,
                    text: isBlocked
                      ? "You will be able to send messages again."
                      : "You won't be able to send messages to each other.",
                    icon: "question",
                    showCancelButton: true,
                    confirmButtonColor: isBlocked ? "#3085d6" : "#d33",
                    cancelButtonColor: "#aaa",
                    confirmButtonText: `Yes, ${actionText} it!`,
                  }).then(async (result) => {
                    if (result.isConfirmed) {
                      try {
                        if (isBlocked) {
                          // যদি অলরেডি ব্লক থাকে তবে Unblock কল হবে
                          await unblockChat(conversationId).unwrap();
                          toast.success("Chat unblocked successfully");
                        } else {
                          // যদি ব্লক না থাকে তবে Block কল হবে
                          await blockChat(conversationId).unwrap();
                          toast.success("Chat blocked successfully");
                        }
                      } catch (err: any) {
                        toast.error(
                          err?.data?.message || `Failed to ${actionText} chat`,
                        );
                      }
                    }
                  });
                }}
                className="flex items-center gap-3 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
              >
                <ShieldBan size={16} />{" "}
                {isBlocked ? "Unblock Chat" : "Block Chat"}
              </button>

              {/* Delete Button with SweetAlert2 */}
              <button
                onClick={() => {
                  setShowMenu(false); // মেনু আগে বন্ধ করে দিন

                  Swal.fire({
                    title: "Are you sure?",
                    text: "You won't be able to revert this! All messages will be deleted.",
                    icon: "warning",
                    showCancelButton: true,
                    confirmButtonColor: "#d33",
                    cancelButtonColor: "#3085d6",
                    confirmButtonText: "Yes, delete it!",
                    background: "#fff",
                    customClass: {
                      popup: "rounded-3xl", // আপনার UI এর সাথে ম্যাচ করতে
                    },
                  }).then(async (result) => {
                    if (result.isConfirmed) {
                      try {
                        await deleteChat(conversationId).unwrap();
                        Swal.fire({
                          title: "Deleted!",
                          text: "Your conversation has been deleted.",
                          icon: "success",
                          timer: 1500,
                          showConfirmButton: false,
                        });
                      } catch (err: any) {
                        toast.error(err?.data?.message || "Failed to delete");
                      }
                    }
                  });
                }}
                className="flex items-center gap-3 w-full px-4 py-2 text-sm text-gray-600 hover:bg-gray-50"
              >
                <Trash2 size={16} /> Delete
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Message List */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#F0F2F5]"
      >
        {data?.messages?.map((m: any) => {
          const isMe = m.senderId === currentUserId;

          return (
            <div
              key={m.id}
              className={`flex ${isMe ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`flex flex-col ${isMe ? "items-end" : "items-start"} max-w-[70%]`}
              >
                <div
                  className={`p-3 rounded-2xl text-[14px] shadow-sm break-words ${
                    isMe
                      ? "bg-[#0084FF] text-white rounded-br-none"
                      : "bg-white text-gray-800 border rounded-bl-none"
                  }`}
                >
                  {m.fileUrl && (
                    <img
                      src={m.fileUrl}
                      className="rounded-lg mb-2 max-h-60 w-full object-cover cursor-pointer hover:opacity-95"
                      alt="attachment"
                      onClick={() => window.open(m.fileUrl, "_blank")}
                    />
                  )}
                  {m.text && (
                    <p className="whitespace-pre-wrap break-words">{m.text}</p>
                  )}
                </div>
                <span className="text-[10px] text-gray-400 mt-1">
                  {new Date(m.createdAt).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area (Floating Style) */}
      <div className="p-4 bg-white border-t">
        {imagePreview && (
          <div className="relative inline-block mb-3 p-1 border rounded-lg bg-gray-50">
            <img
              src={imagePreview}
              className="w-24 h-24 object-cover rounded-lg"
              alt="Preview"
            />
            <button
              onClick={() => {
                setImagePreview(null);
                setImageFile(null);
              }}
              className="absolute -top-2 -right-2 bg-gray-800 text-white rounded-full p-1 shadow-lg"
            >
              <X size={12} />
            </button>
          </div>
        )}

        <div
          className={`flex items-center gap-2 ${isBlocked ? "opacity-50 cursor-not-allowed" : ""}`}
        >
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            onChange={handleImageSelect}
            accept="image/*"
          />

          <button
            type="button"
            onClick={() => !isBlocked && fileInputRef.current?.click()}
            className="text-[#0084FF] hover:bg-blue-50 p-2 rounded-full transition-colors"
          >
            <ImageIcon size={24} />
          </button>

          <div className="flex-1 flex items-center bg-[#F0F2F5] rounded-full px-4 py-1">
            <input
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) =>
                e.key === "Enter" && !e.shiftKey && handleSend()
              }
              placeholder={
                isBlocked ? "You cannot reply to this conversation" : "Aa"
              }
              className="w-full bg-transparent py-2 text-sm outline-none text-gray-800"
              disabled={isBlocked}
            />
          </div>

          <button
            onClick={handleSend}
            disabled={
              isSending || isBlocked || (!inputText.trim() && !imageFile)
            }
            className="text-[#0084FF] disabled:text-gray-300 p-2 rounded-full transition-all active:scale-90"
          >
            {isSending ? (
              <Loader2 className="animate-spin" size={24} />
            ) : (
              <Send size={24} className="fill-current" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chats;
