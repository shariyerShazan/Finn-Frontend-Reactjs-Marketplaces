/* eslint-disable @typescript-eslint/no-explicit-any */
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  ChevronLeft,
  Loader2,
  LogOut,
  Settings,
  UserCircle,
} from "lucide-react";
import { IoChatboxOutline } from "react-icons/io5";
import { useLogoutMutation } from "@/redux/fetures/auth.api";
import { toast } from "react-toastify";
// import { useGetUnreadCountQuery } from "@/redux/fetures/chat/notification";
import { useEffect } from "react";
import { socketService } from "@/lib/socketService";
import { useGetUnreadCountQuery } from "@/redux/fetures/chat/notification";

interface SidebarProps {
  isCollapsed: boolean;
  setIsCollapsed: (val: boolean) => void;
  isMobileOpen: boolean;
  setIsMobileOpen: (val: boolean) => void;
  userData: any;
}

const UserSidebarD = ({
  isCollapsed,
  setIsCollapsed,
  isMobileOpen,
  setIsMobileOpen,
  userData,
}: SidebarProps) => {
  useEffect(() => {
    if (userData?.id || localStorage.getItem("userId")) {
      socketService.connect();
    }
  }, [userData]);

  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [logout, { isLoading: isLoggingOut }] = useLogoutMutation();

  const { data: countData } = useGetUnreadCountQuery("en");
  const unreadCount = countData?.data?.count || 0;

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
    { name: "Profile", icon: Settings, path: "/user/dashboard" },
    {
      name: "Messages",
      icon: IoChatboxOutline,
      path: "/user/dashboard/chat",
      badge: unreadCount > 0 ? unreadCount.toString() : null,
    },
  ];

  const activeClass = "bg-[#0064AE] text-white shadow-lg shadow-[#0064AE]/20";
  const inactiveClass = "text-slate-400 hover:bg-white/5 hover:text-white";

  return (
    <div
      className={`fixed inset-y-0 left-0 z-[60] bg-[#001D3D] transition-all duration-300 border-r border-white/5 ${isMobileOpen ? "translate-x-0 w-64" : "-translate-x-full lg:translate-x-0"} ${isCollapsed ? "lg:w-20" : "lg:w-64"}`}
    >
      <div className="h-16 flex items-center justify-between px-6 border-b border-white/5 bg-[#00152b]">
        {!isCollapsed && (
          <Link to="/">
            <div className="flex items-center gap-3">
              <div className="w-7 h-7 bg-[#0064AE] rounded flex items-center justify-center text-white font-bold text-xs">
                F
              </div>
              <h1 className="text-sm font-black text-white uppercase tracking-widest">
                Finn User
              </h1>
            </div>
          </Link>
        )}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="hidden lg:flex p-1.5 rounded-md hover:bg-white/10 text-slate-400"
        >
          <ChevronLeft
            size={18}
            className={`transition-transform ${isCollapsed ? "rotate-180" : ""}`}
          />
        </button>
      </div>

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
              <div className="relative">
                <item.icon size={20} className="shrink-0" />
                {isCollapsed && item.badge && (
                  <span className="absolute -top-1 -right-1 w-2 h-2 bg-[#D55C5E] rounded-full border border-[#001D3D]" />
                )}
              </div>
              {!isCollapsed && (
                <span className="ml-3 text-[13px] font-semibold">
                  {item.name}
                </span>
              )}
              {!isCollapsed && item.badge && (
                <span className="ml-auto bg-[#D55C5E] text-white text-[9px] px-1.5 py-0.5 rounded font-black">
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Profile area & Logout code remains same... */}
      <div className="mt-auto p-4 border-t border-white/5 bg-[#00152b]">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center overflow-hidden shrink-0">
            {userData?.profilePicture ? (
              <img
                src={userData.profilePicture}
                alt="p"
                className="w-full h-full object-cover"
              />
            ) : (
              <UserCircle size={24} className="text-slate-400" />
            )}
          </div>
          {!isCollapsed && (
            <div className="overflow-hidden">
              <p className="text-xs font-bold text-white truncate">
                {userData.nickName}
              </p>
              <p className="text-[10px] text-slate-500 uppercase">
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
          className={`w-full flex items-center gap-3 p-2.5 rounded-lg transition-all text-rose-400 hover:bg-rose-500/10 ${isCollapsed ? "justify-center" : "px-3"}`}
        >
          {isLoggingOut ? (
            <Loader2 size={18} className="animate-spin" />
          ) : (
            <LogOut size={18} />
          )}
          {!isCollapsed && (
            <span className="text-[13px] font-bold uppercase">Logout</span>
          )}
        </button>
      </div>
    </div>
  );
};
export default UserSidebarD;