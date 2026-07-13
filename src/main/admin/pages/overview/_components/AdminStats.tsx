import {
  Users,
  UserCheck,
  DollarSign,
  ShoppingBag,
  Loader2,
  Zap,
  CreditCard,
  TrendingUp,
} from "lucide-react";
import { useGetAdminStatsQuery } from "@/redux/fetures/admin/admin.api";

const AdminStat = () => {
  const { data: response, isLoading } = useGetAdminStatsQuery(undefined);
  const statsData = response?.data;

  if (isLoading)
    return (
      <div className="h-40 flex items-center justify-center bg-slate-50/50 rounded-[32px] border-2 border-dashed border-slate-200">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="animate-spin text-[#0064AE]" size={32} />
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
            Loading Analytics...
          </p>
        </div>
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
      label: "Subscription Rev.",
      val: `${(statsData?.financials?.subscriptionRevenue || 0).toLocaleString()} PLN`,
      gradient: "from-orange-50 to-white",
      iconBg: "bg-orange-600",
      icon: CreditCard,
    },
    {
      label: "Boost Revenue",
      val: `${(statsData?.financials?.boostRevenue || 0).toLocaleString()} PLN`,
      gradient: "from-amber-50 to-white",
      iconBg: "bg-amber-500",
      icon: Zap,
    },
    {
      label: "Net Profit",
      val: `${(statsData?.financials?.netProfit || 0).toLocaleString()} PLN`,
      gradient: "from-emerald-50 to-white",
      iconBg: "bg-emerald-600",
      icon: DollarSign,
    },
    {
      label: "Conversion Rate",
      val: `${statsData?.overview?.conversionRate || 0}%`,
      gradient: "from-pink-50 to-white",
      iconBg: "bg-pink-600",
      icon: TrendingUp,
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {stats.map((stat, i) => (
        <div
          key={i}
          className={`bg-gradient-to-br ${stat.gradient} p-6 rounded-[28px] border border-slate-200 shadow-sm transition-all hover:shadow-xl hover:-translate-y-1 group relative overflow-hidden`}
        >
          {/* Background Decorative Icon */}
          <stat.icon
            className="absolute -right-4 -bottom-4 text-slate-200/40 rotate-12 group-hover:rotate-0 transition-transform duration-500"
            size={100}
          />

          <div className="flex items-center gap-5 relative z-10">
            <div
              className={`${stat.iconBg} text-white w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg transition-all duration-300 group-hover:scale-110 group-hover:rotate-3`}
            >
              <stat.icon size={26} />
            </div>
            <div>
              <h3 className="text-2xl font-black text-slate-900 tracking-tight leading-none mb-1.5">
                {stat.val}
              </h3>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.1em]">
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
