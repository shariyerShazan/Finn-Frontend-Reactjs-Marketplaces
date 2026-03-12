import { Card, CardContent } from "@/components/ui/card";
import { LayoutGrid, CheckCircle2, Eye, Loader2 } from "lucide-react";
// import { MdPayments } from "react-icons/md";
import { useGetSellerStatsQuery } from "@/redux/fetures/users.api";

const SellerStats = () => {
  const { data, isLoading } = useGetSellerStatsQuery();

  if (isLoading) {
    return (
      <div className="flex justify-center py-10">
        <Loader2 className="animate-spin text-blue-600" size={32} />
      </div>
    );
  }

  const statsData = data?.data || {};

  const stats = [
    {
      label: statsData.totalAds || 0,
      subLabel: "Total Ads",
      icon: LayoutGrid,
      color: "text-green-600",
      bg: "bg-green-50",
    },
    // {
    //   label: `$${(statsData.totalIncome || 0).toLocaleString()}`,
    //   subLabel: "Total Income",
    //   icon: MdPayments,
    //   color: "text-indigo-600",
    //   bg: "bg-indigo-50",
    // },
    {
      label: statsData.itemSold || 0,
      subLabel: "Item Sold",
      icon: CheckCircle2,
      color: "text-red-500",
      bg: "bg-red-50",
    },
    {
      label: statsData.totalAdsViewed || 0,
      subLabel: "Total Ads Viewed",
      icon: Eye,
      color: "text-blue-500",
      bg: "bg-blue-50",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {stats.map((stat, index) => (
        <Card key={index} className="border-none shadow-sm">
          <CardContent className="flex items-center p-6 gap-4">
            <div className={`p-3 rounded-xl ${stat.bg}`}>
              <stat.icon className={`w-6 h-6 ${stat.color}`} />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-slate-800">
                {stat.label}
              </h3>
              <p className="text-sm text-slate-500 font-medium">
                {stat.subLabel}
              </p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default SellerStats;
