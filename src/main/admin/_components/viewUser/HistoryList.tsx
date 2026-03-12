import { Eye, History, ArrowRight, Calendar } from "lucide-react";

interface HistoryItemProps {
  id: number;
  title: string;
  price: string;
  date: string;
  status: "Active" | "Closed" | "Pending";
  image: string;
}

const HistoryList = ({ title }: { title: string }) => {
  const items: HistoryItemProps[] = [
    {
      id: 1,
      title: "2BR Condo with Huge Balcony",
      price: "$13,750",
      date: "May 24, 2026",
      status: "Active",
      image:
        "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&q=80&w=150",
    },
    {
      id: 2,
      title: "Tesla Model 3 – Long Range 2023",
      price: "$32,500",
      date: "May 21, 2026",
      status: "Closed",
      image:
        "https://images.unsplash.com/photo-1560958089-b8a1929cea89?auto=format&fit=crop&q=80&w=150",
    },
    {
      id: 3,
      title: "Modern Apartment in Downtown",
      price: "$25,000",
      date: "May 18, 2026",
      status: "Pending",
      image:
        "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=150",
    },
  ];

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      {/* Header Section */}
      <div className="px-6 py-5 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-slate-900 rounded-lg text-white">
            <History size={16} strokeWidth={2} />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 tracking-tight">
              {title}
            </h3>
            <p className="text-[10px] text-slate-500 font-medium uppercase tracking-wider">
              Last 30 Days Activity
            </p>
          </div>
        </div>
        <button className="flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-slate-900 transition-colors group">
          Full Audit Log
          <ArrowRight
            size={14}
            className="group-hover:translate-x-0.5 transition-transform"
          />
        </button>
      </div>

      {/* List Body */}
      <div className="divide-y divide-slate-100">
        {items.map((item) => (
          <div
            key={item.id}
            className="group flex items-center justify-between p-4 hover:bg-slate-50/80 transition-all cursor-default"
          >
            <div className="flex items-center gap-4 min-w-0">
              {/* Image with Professional Aspect Ratio */}
              <div className="relative w-12 h-12 flex-shrink-0 rounded-lg overflow-hidden border border-slate-200 bg-slate-100">
                <img
                  src={item.image}
                  className="w-full h-full object-cover grayscale-[30%] group-hover:grayscale-0 transition-all duration-500"
                  alt={item.title}
                />
              </div>

              <div className="min-w-0">
                <p className="text-sm font-semibold text-slate-800 truncate group-hover:text-[#0064AE] transition-colors">
                  {item.title}
                </p>
                <div className="flex items-center gap-3 mt-1">
                  <span className="text-xs font-bold text-slate-900 italic">
                    {item.price}
                  </span>
                  <span className="w-1 h-1 bg-slate-300 rounded-full" />
                  <span className="flex items-center gap-1 text-[11px] text-slate-500 font-medium">
                    <Calendar size={12} /> {item.date}
                  </span>
                </div>
              </div>
            </div>

            {/* Status & Professional Action Button */}
            <div className="flex items-center gap-6">
              <div className="hidden md:flex flex-col items-end">
                <StatusBadge status={item.status} />
              </div>

              <button className="flex items-center justify-center w-9 h-9 rounded-lg bg-white border border-slate-200 text-slate-400 hover:text-slate-900 hover:border-slate-400 hover:shadow-sm transition-all active:scale-95">
                <Eye size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Subtle Footer */}
      <div className="px-6 py-3 bg-slate-50 border-t border-slate-100 text-center">
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
          End of list • Auto-refreshed every 5m
        </p>
      </div>
    </div>
  );
};

// Helper Sub-component for Status
const StatusBadge = ({ status }: { status: HistoryItemProps["status"] }) => {
  const styles = {
    Active: "bg-emerald-50 text-emerald-700 border-emerald-100",
    Closed: "bg-slate-100 text-slate-600 border-slate-200",
    Pending: "bg-amber-50 text-amber-700 border-amber-100",
  };

  return (
    <span
      className={`px-2 py-0.5 rounded text-[10px] font-bold border ${styles[status]}`}
    >
      {status}
    </span>
  );
};

export default HistoryList;
