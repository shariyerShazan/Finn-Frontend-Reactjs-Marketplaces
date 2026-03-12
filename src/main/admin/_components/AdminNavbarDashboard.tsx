/* eslint-disable @typescript-eslint/no-explicit-any */
import {
    //  Search, 
    // Bell,
     Menu, User } from "lucide-react";

const AdminNavbarDashboard = ({
  setIsMobileOpen,
  userData,
}: {
  setIsMobileOpen: (val: boolean) => void;
  userData: any
}) => {
  return (
    <nav className="h-16 bg-white border-b border-slate-200 sticky top-0 z-[40] px-4 md:px-8 flex items-center justify-between shrink-0">
      <div className="flex items-center gap-4">
        {/* Mobile Toggle Button */}
        <button
          onClick={() => setIsMobileOpen(true)}
          className="lg:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-md"
        >
          <Menu size={24} />
        </button>

        {/* <div className="hidden md:flex items-center gap-3 bg-slate-50 border border-slate-200 px-3  py-1.5 rounded-md w-80">
          <Search size={16} className="text-slate-400" />
          <input
            type="text"
            placeholder="Search system..."
            className="bg-transparent border-none outline-none text-[13px] w-full"
          />
        </div> */}
      </div>

      <div className="flex items-center gap-2 md:gap-5">
        {/* <button className="relative p-2 text-slate-500 hover:bg-slate-100 rounded-full">
          <Bell size={20} />
          <span className="absolute top-2 right-2 w-2 h-2 bg-[#D55C5E] rounded-full border-2 border-white" />
        </button> */}

        <div className="h-6 w-[1px] bg-slate-200 hidden md:block" />

        <div className="flex items-center gap-3 cursor-pointer pl-2">
          <div className="text-right hidden sm:block">
            <p className="text-xs font-black text-slate-900 leading-none tracking-tight">
              {userData.email}
            </p>
            <p className="text-[10px] font-bold text-[#0064AE] mt-1 uppercase tracking-tighter">
              {userData.role}
            </p>
          </div>
          <div className="w-9 h-9 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center">
            <User size={18} className="text-slate-500" />
          </div>
        </div>
      </div>
    </nav>
  );
};

export default AdminNavbarDashboard;
