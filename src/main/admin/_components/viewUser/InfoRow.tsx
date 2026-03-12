import {
  Mail,
  Phone,
  MapPin,
  Building2,
  Globe,
  type LucideIcon,
  // LucideIcon,
} from "lucide-react";

type InfoLabel = "Email" | "Phone" | "Address" | "Company" | "Website";

const ICONS: Record<InfoLabel, LucideIcon> = {
  Email: Mail,
  Phone: Phone,
  Address: MapPin,
  Company: Building2,
  Website: Globe,
};

interface InfoRowProps {
  label: InfoLabel;
  value: string;
}

const InfoRow = ({ label, value }: InfoRowProps) => {
  const Icon = ICONS[label];

  return (
    <div className="flex items-center justify-between text-xs py-2.5 border-b border-slate-50 last:border-none group">
      <div className="flex items-center gap-2.5 text-slate-400 group-hover:text-slate-600 transition-colors">
        <div className="p-1.5 rounded-lg bg-slate-50">
          <Icon size={14} strokeWidth={2.5} />
        </div>
        <span className="font-bold uppercase tracking-wider text-[10px]">
          {label}
        </span>
      </div>

      <span className="text-slate-700 font-bold truncate max-w-[55%]">
        {value || "N/A"}
      </span>
    </div>
  );
};

export default InfoRow;
