/* eslint-disable @typescript-eslint/no-explicit-any */
import { TrendingUp, TrendingDown } from "lucide-react";

interface StatBoxProps {
  icon: any;
  label: string;
  value: string | number;
  trend?: string; // e.g., "+12.5%"
  isUp?: boolean;
}

export const StatBox = ({
  icon: Icon,
  label,
  value,
  trend,
  isUp,
}: StatBoxProps) => (
  <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm hover:border-slate-300 transition-all duration-200 flex flex-col gap-4">
    {/* Top Row: Icon & Trend Insight */}
    <div className="flex items-center justify-between">
      <div className="p-2.5 bg-slate-50 border border-slate-100 rounded-lg text-slate-700">
        <Icon size={20} strokeWidth={2} />
      </div>

      {trend && (
        <div
          className={`flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-bold ${
            isUp ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-600"
          }`}
        >
          {isUp ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
          {trend}
        </div>
      )}
    </div>

    {/* Metric Content */}
    <div>
      <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
        {label}
      </h4>
      <div className="flex items-baseline gap-1">
        <p className="text-2xl font-bold text-slate-900 tracking-tight">
          {value}
        </p>
        <span className="text-[10px] font-medium text-slate-400">/ total</span>
      </div>
    </div>
  </div>
);
