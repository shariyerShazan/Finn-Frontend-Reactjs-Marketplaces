/* eslint-disable @typescript-eslint/no-explicit-any */
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  CreditCard,
  ShieldCheck,
  ChevronLeft,
  Loader2,
  LogOut,
} from "lucide-react";
import { TbCategory2 } from "react-icons/tb";
import { TiFlowChildren } from "react-icons/ti";
import { LuGitPullRequestArrow } from "react-icons/lu";
import { IoPaperPlaneOutline } from "react-icons/io5";
import { useLogoutMutation } from "@/redux/fetures/auth.api";
import { toast } from "react-toastify";
import { RiPlanetLine } from "react-icons/ri";

interface SidebarProps {
  isCollapsed: boolean;
  setIsCollapsed: (val: boolean) => void;
  isMobileOpen: boolean;
  setIsMobileOpen: (val: boolean) => void;
  userData: any
}

const AdminSidebarDashboard = ({
  isCollapsed,
  setIsCollapsed,
  isMobileOpen,
  setIsMobileOpen,
  userData,
}: SidebarProps) => {
      const navigate = useNavigate();
      const { pathname } = useLocation();
      const [logout, { isLoading: isLoggingOut }] = useLogoutMutation();
      const handleLogout = async () => {
        try {
          await logout(undefined).unwrap();
          toast.success("Logged out successfully");
          navigate("/login");
        } catch (err) {
          console.log(err);
          toast.error("Failed to logout");
        }
      };

  const menuItems = [
    { name: "Overview", icon: LayoutDashboard, path: "/admin/dashboard" },
    { name: "User Directory", icon: Users, path: "/admin/dashboard/users" },
    { name: "Seller Directory", icon: Users, path: "/admin/dashboard/sellers" },
    {
      name: "Seller Request",
      icon: LuGitPullRequestArrow,
      path: "/admin/dashboard/requested-seller",
    },
    {
      name: "Reports",
      icon: ShieldCheck,
      path: "/admin/dashboard/reports",
      badge: "12",
    },
    // { name: "Marketplace", icon: ShoppingBag, path: "/admin/ads" },
    {
      name: "Transactions",
      icon: CreditCard,
      path: "/admin/dashboard/Transactions",
    },
    {
      name: "Category",
      icon: TbCategory2,
      path: "/admin/dashboard/category",
    },
    {
      name: "Sub Category",
      icon: TiFlowChildren,
      path: "/admin/dashboard/sub-category",
    },
    {
      name: "Subscription",
      icon: IoPaperPlaneOutline,
      path: "/admin/dashboard/subscription",
    },
    {
      name: "Boost Ads Plan",
      path: "ad-boost",
      icon: RiPlanetLine,
    },
  ];

  const activeClass = "bg-[#0064AE] text-white shadow-lg shadow-[#0064AE]/20";
  const inactiveClass = "text-slate-400 hover:bg-white/5 hover:text-white";

  return (
    <div
      className={`
      fixed inset-y-0 left-0 z-[60] bg-[#001D3D] transition-all duration-300 border-r border-white/5
      ${isMobileOpen ? "translate-x-0 w-64" : "-translate-x-full lg:translate-x-0"}
      ${isCollapsed ? "lg:w-20" : "lg:w-64"}
    `}
    >
      {/* Header & Collapse Toggle */}
      <div className="h-16 flex items-center justify-between px-6 border-b border-white/5 bg-[#00152b]">
        {!isCollapsed && (
          <Link to={"/"}>
            <div className="flex items-center gap-3">
              <div className="w-7 h-7 bg-[#0064AE] rounded flex items-center justify-center">
                <span className="text-white font-bold text-xs uppercase italic">
                  F
                </span>
              </div>
              <h1 className="text-sm font-black text-white uppercase tracking-widest">
                Finn Admin
              </h1>
            </div>
          </Link>
        )}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="hidden lg:flex p-1.5 rounded-md hover:bg-white/10 text-slate-400 cursor-pointer"
        >
          <ChevronLeft
            size={18}
            className={`transition-transform ${isCollapsed ? "rotate-180" : ""}`}
          />
        </button>
      </div>

      {/* Nav Items */}
      <nav className="p-3 space-y-1.5 mt-4">
        {menuItems.map((item) => {
          const isActive = pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setIsMobileOpen(false)}
              className={`flex items-center p-3 rounded-md transition-all group relative ${isActive ? activeClass : inactiveClass}`}
            >
              <item.icon size={20} className="shrink-0" />
              {!isCollapsed && (
                <span className="ml-3 text-[13px] font-semibold whitespace-nowrap">
                  {item.name}
                </span>
              )}
              {!isCollapsed && item.badge && (
                <span className="ml-auto bg-[#D55C5E] text-white text-[9px] px-1.5 py-0.5 rounded font-black">
                  {item.badge}
                </span>
              )}
              {/* Tooltip for Collapsed Mode */}
              {isCollapsed && (
                <div className="absolute left-14 invisible group-hover:visible bg-[#00152b] text-white text-xs px-2 py-1 rounded shadow-xl border border-white/10 z-50 whitespace-nowrap">
                  {item.name}
                </div>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Bottom Profile Area */}
      <div className="mt-auto p-4 border-t border-white/5 bg-[#00152b]">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded bg-slate-700 overflow-hidden shrink-0">
            <img
              src="https://api.dicebear.com/7.x/initials/svg?seed=Admin"
              alt=""
            />
          </div>
          {!isCollapsed && (
            <div className="overflow-hidden">
              <p className="text-xs font-bold text-white truncate">
                {userData.nickName}
              </p>
              <p className="text-[10px] text-slate-500 uppercase tracking-tighter">
                {userData.role}
              </p>
            </div>
          )}
        </div>
      </div>

      <div className="px-3 mt-2 pb-4">
        <button
          onClick={handleLogout}
          disabled={isLoggingOut}
          className={`
        w-full flex items-center gap-3 p-2.5 rounded-lg transition-all
        text-rose-400 hover:bg-rose-500/10 hover:text-rose-300 cursor-pointer
        ${isCollapsed ? "justify-center" : "px-3"}
      `}
        >
          {isLoggingOut ? (
            <Loader2 size={18} className="animate-spin" />
          ) : (
            <LogOut size={18} className="shrink-0" />
          )}

          {!isCollapsed && (
            <span className="text-[13px] font-bold uppercase tracking-wider">
              Logout
            </span>
          )}
        </button>
      </div>
    </div>
  );
};

export default AdminSidebarDashboard;
