import { Trash2, Ban, AlertTriangle } from "lucide-react";

interface DangerActionsProps {
  label: string;
}

const DangerActions = ({ label }: DangerActionsProps) => {
  return (
    <div className="mt-auto pt-10 border-t border-slate-200">
      {/* Header for Security Context */}
      <div className="flex items-center gap-2 mb-5">
        <AlertTriangle size={14} className="text-amber-500" />
        <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">
          Administrative Management
        </h4>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Delete Action: Clean, Sharp, No Animation Bloat */}
        <button
          className="group flex items-center justify-center gap-2.5 py-3 px-5 
          bg-white text-rose-600 border border-rose-200 rounded-xl 
          text-[11px] font-bold uppercase tracking-wider transition-all duration-200 
          hover:bg-rose-600 hover:text-white hover:border-rose-600 active:scale-[0.98] cursor-pointer"
        >
          <Trash2
            size={14}
            strokeWidth={2}
            className="opacity-70 group-hover:opacity-100 transition-opacity"
          />
          Permanently Delete {label}
        </button>

        {/* Restriction Action: Solid & Serious */}
        <button
          className="group flex items-center justify-center gap-2.5 py-3 px-5 
          bg-white text-slate-700 border border-slate-300 rounded-xl 
          text-[11px] font-bold uppercase tracking-wider transition-all duration-200 
          hover:bg-slate-900 hover:text-white hover:border-slate-900 active:scale-[0.98] cursor-pointer"
        >
          <Ban
            size={14}
            strokeWidth={2}
            className="opacity-70 group-hover:opacity-100 transition-opacity"
          />
          Restrict {label} Access
        </button>
      </div>

      {/* Verification Sub-text */}
      <p className="mt-4 text-[10px] text-slate-400 font-medium italic text-center">
        Note: These actions are logged and require administrative privileges.
      </p>
    </div>
  );
};

export default DangerActions;
