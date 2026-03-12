/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { Outlet, Navigate, useLocation } from "react-router-dom"; // Navigate যোগ করা হয়েছে
import { motion, AnimatePresence } from "framer-motion";
import SellerSidebarD from "@/main/seller/_components/SellerSidebarD";
import SellerNavbarD from "@/main/seller/_components/SellerNavbarD";
import { Loader2, Clock, ShieldCheck } from "lucide-react";
import { useGetMeQuery } from "@/redux/fetures/users.api";

const SellerDashboardLayout = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const location = useLocation();

  const { data: userData, isLoading: isUserLoading } = useGetMeQuery();

  const hasProfile = userData?.data?.sellerProfile;
  const isSellerApproved = userData?.data?.isSeller;

  if (isUserLoading) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-white">
        <Loader2 className="animate-spin text-[#0064AE]" size={40} />
      </div>
    );
  }


  if (!hasProfile && location.pathname !== "/create-seller-profile") {
    return <Navigate to="/create-seller-profile" replace />;
  }

  return (
    <div className="min-h-screen bg-[#F4F7FA] flex font-sans text-slate-900 overflow-hidden">
      <SellerSidebarD
        isCollapsed={isCollapsed}
        setIsCollapsed={setIsCollapsed}
        isMobileOpen={isMobileOpen}
        setIsMobileOpen={setIsMobileOpen}
        userData={userData.data}
      />

      <div className="flex-1 flex flex-col min-w-0 h-screen transition-all duration-300 overflow-hidden">
        <SellerNavbarD userData={userData.data} setIsMobileOpen={setIsMobileOpen} />

        <main className="flex-1 overflow-y-auto custom-scrollbar">
          <div
            className={`ml-0 duration-500 transition-all mx-auto ${isCollapsed ? "lg:ml-20" : "lg:ml-65"}`}
          >
            {isSellerApproved ? (
              <Outlet />
            ) : (
              <div className="p-8 flex items-center justify-center min-h-[85vh]">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="max-w-lg w-full"
                >
                  <div className="relative bg-white p-12 rounded-[40px] shadow-[0_20px_50px_rgba(0,100,174,0.05)] border border-slate-100 text-center">
                    {/* Floating Icon */}
                    <div className="relative w-28 h-28 mx-auto mb-10">
                      <div className="absolute inset-0 bg-blue-50 rounded-full animate-pulse"></div>
                      <div className="relative w-full h-full bg-white rounded-full border border-blue-50 flex items-center justify-center shadow-sm">
                        <Clock
                          size={48}
                          className="text-[#0064AE]"
                          strokeWidth={1.5}
                        />
                      </div>
                      <div className="absolute bottom-1 right-1 w-7 h-7 bg-amber-400 rounded-full border-4 border-white flex items-center justify-center">
                        <div className="w-1.5 h-1.5 bg-white rounded-full animate-ping"></div>
                      </div>
                    </div>

                    <h2 className="text-3xl font-black text-slate-900 mb-4 tracking-tight">
                      Pending Approval
                    </h2>

                    <p className="text-slate-500 mb-8 font-medium leading-relaxed px-4">
                      Your profile is submitted! Please wait while our team
                      verifies your seller account.
                    </p>

                    <div className="bg-slate-50 rounded-2xl p-6 flex items-start gap-4 text-left border border-slate-100 mb-8">
                      <div className="p-2 bg-[#0064AE]/10 rounded-lg text-[#0064AE]">
                        <ShieldCheck size={20} />
                      </div>
                      <div>
                        <p className="text-xs font-black text-[#0064AE] uppercase tracking-widest mb-1">
                          Security Check
                        </p>
                        <p className="text-xs text-slate-500 font-semibold">
                          We are reviewing your business details. This usually
                          takes 24-48 hours.
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-col items-center gap-2">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-[4px]">
                        Under Review
                      </p>
                      <div className="flex gap-1.5">
                        {[1, 2, 3].map((i) => (
                          <motion.div
                            key={i}
                            animate={{ opacity: [0.3, 1, 0.3] }}
                            transition={{
                              duration: 1.5,
                              repeat: Infinity,
                              delay: i * 0.2,
                            }}
                            className="w-1.5 h-1.5 rounded-full bg-[#0064AE]"
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>
            )}
          </div>
        </main>

        <footer className="h-10 bg-white border-t border-slate-200 px-8 flex items-center justify-between shrink-0">
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
            Seller Portal v2.0
          </p>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-[#219618] rounded-full" />
            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-tighter">
              Account Status
            </span>
          </div>
        </footer>
      </div>

      <AnimatePresence>
        {isMobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsMobileOpen(false)}
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[55] lg:hidden"
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default SellerDashboardLayout;
