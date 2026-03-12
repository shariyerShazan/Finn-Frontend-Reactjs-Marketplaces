/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { Outlet } from "react-router-dom";
// import { AnimatePresence, motion } from "framer-motion";
// import { Loader2 } from "lucide-react";
import { useGetMeQuery } from "@/redux/fetures/users.api";
// import UserSidebarD from "./_components/UserSidebarD";
// import SellerNavbarD from "@/main/seller/_components/SellerNavbarD"; 
import UserSidebarD from "@/main/user/_components/UserSidebarD";
import UserNavbarD from "@/main/user/_components/UserNavbarD";

const UserDashboardLayout = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const { data: userData } = useGetMeQuery();

  return (
    <div className="min-h-screen bg-[#F4F7FA] flex font-sans text-slate-900 overflow-hidden">
      <UserSidebarD
        isCollapsed={isCollapsed}
        setIsCollapsed={setIsCollapsed}
        isMobileOpen={isMobileOpen}
        setIsMobileOpen={setIsMobileOpen}
        userData={userData.data}
      />

      <div className="flex-1 flex flex-col min-w-0 h-screen transition-all duration-300 overflow-hidden">
        <UserNavbarD
          setIsMobileOpen={setIsMobileOpen}
          userData={userData?.data}
        />

        <main className="flex-1 overflow-y-auto custom-scrollbar">
          <div
            className={`ml-0 duration-500 transition-all mx-auto ${isCollapsed ? "lg:ml-20" : "lg:ml-65"}`}
          >
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default UserDashboardLayout;
