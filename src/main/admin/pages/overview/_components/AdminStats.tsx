import {
  Users,
  UserCheck,
  DollarSign,
  ShoppingBag,
  Loader2,
} from "lucide-react";
import { useGetAdminStatsQuery } from "@/redux/fetures/admin/admin.api";

const AdminStat = () => {
  const { data: response, isLoading } = useGetAdminStatsQuery(undefined);
  const statsData = response?.data;

  if (isLoading)
    return (
      <div className="h-32 flex items-center justify-center bg-slate-50 rounded-2xl border border-dashed border-slate-300">
        <Loader2 className="animate-spin text-slate-400" size={30} />
      </div>
    );

  const stats = [
    {
      label: "Total Users",
      val: statsData?.overview?.totalUsers || 0,
      gradient: "from-blue-50 to-white",
      iconBg: "bg-blue-600",
      icon: Users,
    },
    {
      label: "Total Sellers",
      val: statsData?.overview?.totalSellers || 0,
      gradient: "from-indigo-50 to-white",
      iconBg: "bg-indigo-600",
      icon: UserCheck,
    },
    {
      label: "Total Ads",
      val: statsData?.overview?.totalAds || 0,
      gradient: "from-purple-50 to-white",
      iconBg: "bg-purple-600",
      icon: ShoppingBag,
    },
    {
      label: "Net Profit",
      val: `$${(statsData?.financials?.subscriptionRevenue || 0).toLocaleString()}`,
      gradient: "from-emerald-50 to-white",
      iconBg: "bg-emerald-600",
      icon: DollarSign,
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, i) => (
        <div
          key={i}
          className={`bg-gradient-to-br ${stat.gradient} p-6 rounded-[24px] border border-slate-200 shadow-sm transition-all hover:shadow-md group`}
        >
          <div className="flex items-center gap-5">
            <div
              className={`${stat.iconBg} text-white w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg transition-transform group-hover:scale-110`}
            >
              <stat.icon size={22} />
            </div>
            <div>
              <h3 className="text-2xl font-black text-slate-800 tracking-tight leading-none mb-1">
                {stat.val}
              </h3>
              <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest">
                {stat.label}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default AdminStat;
