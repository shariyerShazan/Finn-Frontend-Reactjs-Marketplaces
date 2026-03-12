/* eslint-disable react-hooks/immutability */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import {
  useCreateCheckoutSessionMutation,
  useGetMyPaymentHistoryQuery,
} from "@/redux/fetures/admin/pay-for-subsc";
import { useGetAllPlansQuery } from "@/redux/fetures/admin/subscription";
import { Loader2, Check, CreditCard, History, Zap } from "lucide-react";
import { toast } from "react-toastify";

const SellerSubscriptionPage = () => {
  const [searchParams] = useSearchParams();

  const { data: plansData, isLoading: isPlansLoading } =
    useGetAllPlansQuery(undefined);
  const { data: historyData, isLoading: isHistoryLoading } =
    useGetMyPaymentHistoryQuery(undefined);
  const [createCheckout, { isLoading: isRedirecting }] =
    useCreateCheckoutSessionMutation();
  // console.log(plansData, historyData)
  const plans = plansData?.data || [];
  const history = historyData?.data || [];
console.log(historyData);
  useEffect(() => {
    const status = searchParams.get("status");
    if (status === "success") {
      toast.success("Payment Successful! Your plan has been activated.");
    } else if (status === "cancel") {
      toast.error("Payment was cancelled.");
    }
  }, [searchParams]);

  const handlePurchase = async (planId: string) => {
    try {
      const res = await createCheckout(planId).unwrap();
      if (res?.url) {
        window.location.href = res.url;
      }
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to initiate payment");
    }
  };

  if (isPlansLoading || isHistoryLoading) {
    return (
      <div className="flex justify-center p-20">
        <Loader2 className="animate-spin text-[#0064AE]" />
      </div>
    );
  }

  const RemainingTime = ({ endDate }: { endDate: string }) => {
    const [timeLeft, setTimeLeft] = useState("");

    useEffect(() => {
      const calculateTime = () => {
        const now = new Date().getTime();
        const expiry = new Date(endDate).getTime();
        const diff = expiry - now;

        if (diff <= 0) {
          setTimeLeft("Expired");
          return;
        }

        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor(
          (diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
        );
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

        setTimeLeft(`${days}d ${hours}h ${minutes}m remaining`);
      };

      calculateTime();
      const timer = setInterval(calculateTime, 60000);

      return () => clearInterval(timer);
    }, [endDate]);

    return (
      <span
        className={`text-[11px] font-bold ${timeLeft === "Expired" ? "text-red-500" : "text-orange-500"}`}
      >
        {timeLeft}
      </span>
    );
  };

  return (
    <div className="p-4 space-y-10  mx-auto">
      {/* --- Section 1: Available Plans --- */}
      <div>
        <div className="mb-6">
          <h2 className="text-2xl font-black text-slate-900">
            Upgrade Your Plan
          </h2>
          <p className="text-sm text-slate-500">
            Choose a plan to start posting more ads.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {plans.map((plan: any) => (
            <div
              key={plan.id}
              className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm hover:shadow-md transition-all relative overflow-hidden group"
            >
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <Zap size={60} className="text-[#0064AE]" />
              </div>

              <h3 className="text-xl font-black text-slate-900 mb-2">
                {plan.name}
              </h3>
              <div className="flex items-baseline gap-1 mb-6">
                <span className="text-3xl font-black text-[#0064AE]">
                  {plan.price}
                </span>
                <span className="text-slate-400 font-bold uppercase text-xs">
                  PLN / {plan.durationDays} Days
                </span>
              </div>

              <ul className="space-y-3 mb-8">
                <li className="flex items-center gap-2 text-sm text-slate-600 font-medium">
                  <Check size={16} className="text-emerald-500" />{" "}
                  {plan.postLimit} Ads Posting
                </li>
                <li className="flex items-center gap-2 text-sm text-slate-600 font-medium">
                  <Check size={16} className="text-emerald-500" /> Valid for{" "}
                  {plan.durationDays} Days
                </li>

                {/* আপনার Prisma Schema থেকে আসা features ম্যাপ করুন */}
                {plan.features?.map((feature: string, index: number) => (
                  <li
                    key={index}
                    className="flex items-center gap-2 text-sm text-slate-600 font-medium"
                  >
                    <Check size={16} className="text-emerald-500" /> {feature}
                  </li>
                ))}
              </ul>

              <button
                onClick={() => handlePurchase(plan.id)}
                disabled={isRedirecting}
                className="w-full cursor-pointer py-3 bg-[#0064AE] text-white font-bold rounded-xl hover:bg-[#004e8a] transition-all flex items-center justify-center gap-2"
              >
                {isRedirecting ? (
                  <Loader2 className="animate-spin" size={18} />
                ) : (
                  <>
                    {" "}
                    <CreditCard size={18} /> Buy Now{" "}
                  </>
                )}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* --- Section 2: My Purchase History --- */}
      <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
        <div className="p-6 border-b border-slate-50 flex items-center gap-2">
          <History size={20} className="text-[#0064AE]" />
          <h2 className="text-xl font-black text-slate-900">
            My Purchase History
          </h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 text-[13px] uppercase font-black text-slate-500 tracking-widest">
              <tr>
                <th className="px-6 py-4">Plan Name</th>
                <th className="px-6 py-4">Amount</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Remaining Ads</th>
                <th className="px-6 py-4">Purchase Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {history.map((sub: any) => {
                const adsUsed = sub.usedAdIds?.length || 0;
                const totalLimit = sub.totalLimit || 0;
                const adsRemaining = totalLimit - adsUsed;
                const isExpired = new Date(sub.endDate) < new Date();
                return (
                  <tr
                    key={sub.id}
                    className="hover:bg-slate-50/50 transition-all text-sm"
                  >
                    <td className="px-6 py-4 font-bold text-slate-800">
                      {sub.plan?.name || "N/A"}
                    </td>

                    <td className="px-6 py-4 font-black text-[#0064AE]">
                      {sub.plan?.price || 0} PLN
                    </td>

                    <td className="px-6 py-4">
                      <span
                        className={`px-2 py-1 rounded text-[10px] font-black uppercase border ${
                          sub.status === "ACTIVE" && !isExpired
                            ? "bg-emerald-50 text-emerald-600 border-emerald-100"
                            : "bg-red-50 text-red-600 border-red-100"
                        }`}
                      >
                        {isExpired ? "EXPIRED" : sub.status}
                      </span>
                    </td>

                    {/* --- Updated Section: Ads Balance & Countdown --- */}
                    <td className="px-6 py-4">
                      <div className="flex flex-col space-y-1">
                        {/* Ads Left Counter */}
                        <div className="flex items-center gap-1.5">
                          <Zap
                            size={14}
                            className={
                              adsRemaining <= 0
                                ? "text-red-400"
                                : "text-orange-400"
                            }
                          />
                          <span className="font-bold text-slate-700">
                            {adsRemaining > 0 ? adsRemaining : 0} / {totalLimit}{" "}
                            Ads Left
                          </span>
                        </div>

                        {/* Live Countdown Timer Component */}
                        <div className="flex items-center gap-1.5">
                          <History size={12} className="text-slate-400" />
                          <RemainingTime endDate={sub.endDate} />
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4 text-slate-400 font-medium">
                      {new Date(sub.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {history.length === 0 && (
            <div className="p-10 text-center text-slate-400 font-medium">
              No purchase history found.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SellerSubscriptionPage;
