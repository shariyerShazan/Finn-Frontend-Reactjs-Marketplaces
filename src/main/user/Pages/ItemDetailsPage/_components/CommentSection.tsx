/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useState, useRef } from "react";
import {
  useCreateCommentMutation,
  useGetCommentsByAdQuery,
} from "@/redux/fetures/all/commentApi";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MessageSquare, Send, Loader2 } from "lucide-react";
import { toast } from "react-toastify";

const CommentSection = ({ adId }: any) => {
  const [message, setMessage] = useState("");
  const [replyTo, setReplyTo] = useState(null);
  const textareaRef = useRef(null); // ফোকাস করার জন্য

  const { data: response, isLoading: isFetching } =
    useGetCommentsByAdQuery(adId);
  const [createComment, { isLoading: isPosting }] = useCreateCommentMutation();

  const comments = response?.data || [];

  const sortedComments = [...comments].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );

  const handleSubmit = async (e : any) => {
    if (e) e.preventDefault();
    if (!message.trim() || isPosting) return;

    try {
      await createComment({
        adId,
        message,
        parentId: (replyTo as any)?.id || null,
      }).unwrap();

      toast.success(replyTo ? "Reply posted!" : "Comment posted!");
      setMessage("");
      setReplyTo(null);
    } catch (err: any) {
        console.log(err)
      toast.error("Failed to post. Check your connection or login status.");
    }
  };

  // --- Enter key handle করার ফাংশন ---
  const handleKeyDown = (e: any) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault(); // নতুন লাইন তৈরি হওয়া বন্ধ করবে
      handleSubmit(e) ; // সাবমিট ফাংশন কল করবে
    }
  };

  return (
    <div className="flex flex-col h-full max-h-[800px] bg-white rounded-[2rem] border shadow-sm overflow-hidden">
      {/* --- Header --- */}
      <div className="p-6 border-b bg-slate-50/50 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-[#0064AE]/10 rounded-lg">
            <MessageSquare className="text-[#0064AE]" size={20} />
          </div>
          <h3 className="text-lg font-bold text-slate-800">
            Discussion{" "}
            <span className="text-slate-400 font-medium ml-1">
              ({comments.length})
            </span>
          </h3>
        </div>
        <div className="text-[11px] font-bold text-[#0064AE] uppercase tracking-wider">
          Recent Activity
        </div>
      </div>

      {/* --- Comments Scroll Area --- */}
      <div className="flex-1 overflow-y-auto p-6 space-y-8 no-scrollbar bg-white">
        {isFetching ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <Loader2 className="animate-spin text-[#0064AE]" />
            <p className="text-sm text-slate-400 font-medium">
              Loading conversation...
            </p>
          </div>
        ) : sortedComments.length === 0 ? (
          <div className="text-center py-20">
            <div className="bg-slate-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <MessageSquare className="text-slate-300" size={30} />
            </div>
            <p className="text-slate-500 font-semibold">No comments yet</p>
            <p className="text-slate-400 text-xs">
              Be the first to start the discussion!
            </p>
          </div>
        ) : (
          sortedComments.map((comment) => (
            <div
              key={comment.id}
              className="animate-in fade-in slide-in-from-top-2 duration-300"
            >
              <div className="flex gap-3">
                <Avatar className="h-9 w-9 ring-2 ring-white shadow-sm">
                  <AvatarImage src={comment.user?.profilePicture} />
                  <AvatarFallback className="bg-slate-200 text-xs uppercase">
                    {comment.user?.firstName?.[0]}
                  </AvatarFallback>
                </Avatar>

                <div className="flex-1 space-y-1">
                  <div className="bg-[#F0F2F5] px-4 py-3 rounded-[1.25rem] inline-block max-w-[90%] group relative border border-transparent hover:border-slate-100 transition-all">
                    <p className="text-[13px] font-bold text-slate-900 leading-tight">
                      {comment.user?.firstName} {comment.user?.lastName}
                    </p>
                    <p className="text-[14px] text-slate-700 mt-1 leading-snug">
                      {comment.message}
                    </p>
                  </div>

                  <div className="flex items-center gap-4 ml-2 mt-1">
                    <span className="text-[11px] text-slate-400">
                      {new Date(comment.createdAt).toLocaleDateString()}
                    </span>
                    <button
                      onClick={() => {
                        setReplyTo({
                          id: comment.id,
                          name: comment.user?.firstName,
                        } as any);
                        (textareaRef as any).current?.focus(); // রিপ্লাইতে ক্লিক করলে ইনপুটে ফোকাস হবে
                      }}
                      className="text-[12px] font-bold text-slate-500 hover:text-[#0064AE] transition-colors"
                    >
                      Reply
                    </button>
                  </div>
                </div>
              </div>

              {comment.replies && comment.replies.length > 0 && (
                <div className="ml-12 mt-4 space-y-4 border-l-2 border-slate-100 pl-4">
                  {comment.replies.map((reply : any) => (
                    <div key={reply.id} className="flex gap-2">
                      <Avatar className="h-7 w-7">
                        <AvatarImage src={reply.user?.profilePicture} />
                        <AvatarFallback className="text-[10px]">
                          {reply.user?.firstName?.[0]}
                        </AvatarFallback>
                      </Avatar>
                      <div className="bg-[#F0F2F5] px-3 py-2 rounded-[1rem] inline-block border border-transparent">
                        <p className="text-[12px] font-bold text-slate-900">
                          {reply.user?.firstName} {reply.user?.lastName}
                        </p>
                        <p className="text-[13px] text-slate-700">
                          {reply.message}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* --- Sticky Input Area --- */}
      <div className="p-4 border-t bg-slate-50/80 backdrop-blur-sm">
        <form onSubmit={handleSubmit} className="relative max-w-4xl mx-auto">
          {replyTo && (
            <div className="absolute -top-10 left-0 right-0 flex items-center justify-between bg-[#0064AE] text-white px-4 py-1.5 rounded-t-xl animate-in slide-in-from-bottom-2">
              <span className="text-[11px] font-medium">
                Replying to {(replyTo as any).name}
              </span>
              <button
                type="button"
                onClick={() => setReplyTo(null)}
                className="text-[10px] font-bold hover:underline"
              >
                Cancel
              </button>
            </div>
          )}

          <div className="flex items-end gap-2 bg-white border border-slate-200 rounded-[1.5rem] p-2 shadow-inner focus-within:ring-2 focus-within:ring-[#0064AE]/20 transition-all">
            <Textarea
              ref={textareaRef}
              placeholder="Write a public comment..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyDown} // এখানে হ্যান্ডলারটি যোগ করা হয়েছে
              className="min-h-[44px] max-h-[120px] border-none bg-transparent focus-visible:ring-0 resize-none py-2 px-3 text-sm"
            />
            <Button
              type="submit"
              disabled={isPosting || !message.trim()}
              className="h-10 w-10 rounded-full bg-[#0064AE] hover:bg-[#004f8b] shrink-0 p-0 shadow-lg shadow-[#0064AE]/20 transition-all active:scale-90"
            >
              {isPosting ? (
                <Loader2 className="animate-spin" size={16} />
              ) : (
                <Send size={18} />
              )}
            </Button>
          </div>
          <p className="text-[9px] text-center text-slate-400 mt-2 font-medium">
            Press <span className="font-bold">Enter</span> to post,{" "}
            <span className="font-bold">Shift + Enter</span> for new line
          </p>
        </form>
      </div>
    </div>
  );
};

export default CommentSection;
