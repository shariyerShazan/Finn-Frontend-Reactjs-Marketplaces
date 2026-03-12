/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Camera,
  Mail,
  Phone,
  MapPin,
  Building2,
  Globe,
  ShieldCheck,
} from "lucide-react";

export interface UserProfile {
  name: string;
  email: string;
  phone: string;
  address: string;
  company: string;
  website: string;
  image: string;
  accountType: "seller" | "user";
}

interface ProfileCardProps {
  user: UserProfile;
}

const ProfileCard = ({ user }: ProfileCardProps) => {
  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden flex flex-col h-full">
      {/* Top Banner: Minimal & Clean */}
      <div className="h-28 bg-slate-900 relative">
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px]" />
      </div>

      <div className="px-8 pb-8 -mt-14">
        {/* Avatar Layout */}
        <div className="flex justify-between items-end mb-6">
          <div className="relative group">
            <img
              src={user.image}
              alt={user.name}
              className="w-28 h-28 rounded-2xl border-[4px] border-white shadow-lg object-cover bg-slate-100"
            />
            <button className="absolute -bottom-1 -right-1 bg-white text-slate-900 p-2 rounded-lg shadow-md border border-slate-100 hover:bg-slate-900 hover:text-white transition-all">
              <Camera size={14} />
            </button>
          </div>

          <div className="flex flex-col items-end gap-2">
            <span
              className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider border ${
                user.accountType === "seller"
                  ? "bg-emerald-50 text-emerald-700 border-emerald-100"
                  : "bg-blue-50 text-blue-700 border-blue-100"
              }`}
            >
              {user.accountType} Account
            </span>
            <div className="flex items-center gap-1 text-[10px] font-bold text-slate-400 uppercase">
              <ShieldCheck size={12} className="text-emerald-500" /> Identity
              Verified
            </div>
          </div>
        </div>

        {/* Identity Section */}
        <div className="text-left space-y-1">
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
            {user.name}
          </h2>
          <p className="text-sm font-medium text-slate-500 flex items-center gap-1.5 font-mono">
            ID: USR-9201-X
          </p>
        </div>

        {/* Summary / Bio */}
        <div className="mt-6 p-4 bg-slate-50 rounded-xl border border-slate-100">
          <p className="text-xs text-slate-600 leading-relaxed font-medium italic">
            "Expert in digital commerce and strategic growth management with
            over 8 years of industry experience."
          </p>
        </div>

        {/* Contact Details Grid */}
        <div className="mt-8 space-y-4">
          <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.15em] border-b border-slate-100 pb-2">
            Verification Data
          </h4>

          <div className="grid gap-3">
            <DetailRow
              icon={<Mail size={14} />}
              label="Primary Email"
              value={user.email}
            />
            <DetailRow
              icon={<Phone size={14} />}
              label="Contact Number"
              value={user.phone}
            />
            <DetailRow
              icon={<MapPin size={14} />}
              label="Location"
              value={user.address}
            />
            <DetailRow
              icon={<Building2 size={14} />}
              label="Organization"
              value={user.company}
            />
            <DetailRow
              icon={<Globe size={14} />}
              label="Business URL"
              value={user.website}
              isLink
            />
          </div>
        </div>
      </div>
    </div>
  );
};

// Internal Helper Component for Cleanliness
const DetailRow = ({ icon, label, value, isLink }: any) => (
  <div className="flex items-start gap-3 group">
    <div className="mt-0.5 text-slate-400 group-hover:text-[#0064AE] transition-colors">
      {icon}
    </div>
    <div>
      <p className="text-[9px] font-bold text-slate-400 uppercase leading-none mb-1">
        {label}
      </p>
      <p
        className={`text-xs font-semibold ${isLink ? "text-[#0064AE] hover:underline cursor-pointer" : "text-slate-800"}`}
      >
        {value}
      </p>
    </div>
  </div>
);

export default ProfileCard;
