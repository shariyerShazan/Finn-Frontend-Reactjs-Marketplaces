/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { Menu, User } from "lucide-react";

interface UserNavbarProps {
  setIsMobileOpen: (val: boolean) => void;
  userData?: any; 
}

const UserNavbarD = ({ setIsMobileOpen, userData }: UserNavbarProps) => {
  const userName = userData?.nickName || "User Account";

  return (
    <nav className="h-16 bg-white border-b border-slate-200 sticky top-0 z-[40] px-4 md:px-8 flex items-center justify-between shrink-0">
      <div className="flex items-center gap-4">
        <button
          onClick={() => setIsMobileOpen(true)}
          className="lg:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-md transition-colors"
        >
          <Menu size={24} />
        </button>

        <h2 className="hidden md:block text-[13px] font-black text-slate-400 uppercase tracking-[3px]">
          User Panel
        </h2>
      </div>

      <div className="flex items-center gap-2 md:gap-5">
        {/* Notifications */}
        {/* <button className="relative p-2 text-slate-500 hover:bg-slate-100 rounded-full transition-all">
          <Bell size={20} />
          <span className="absolute top-2 right-2 w-2 h-2 bg-[#0064AE] rounded-full border-2 border-white" />
        </button> */}
        <p className="text-xs font-black text-slate-900 leading-none tracking-tight group-hover:text-[#0064AE] transition-colors">
          {`Email: ${userData.email}`}
        </p>

        <div className="h-6 w-[1px] bg-slate-200 hidden md:block" />

        {/* Profile Section */}
        <div className="flex items-center gap-3 cursor-pointer pl-2 group">
          <div className="text-right hidden sm:block">
            <p className="text-xs font-black text-slate-900 leading-none tracking-tight group-hover:text-[#0064AE] transition-colors">
              {userName}
            </p>
            <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-tighter">
              {userData.isVerified ? "Verified Buyer" : "Not verified"}
            </p>
          </div>
          <div className="w-9 h-9 rounded-full bg-slate-50 border border-slate-200 flex items-center justify-center group-hover:border-[#0064AE]/30 transition-all shadow-sm">
            {userData?.profilePicture ? (
              <img
                src={userData?.profilePicture}
                alt="profile"
                className="w-full h-full rounded-full object-cover"
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
