/* eslint-disable @typescript-eslint/no-explicit-any */
import { Trash2, ShieldCheck } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";

export const SpecFieldItem = ({ field, index, onUpdate, onRemove }: any) => {
  return (
    <div className="relative p-5 bg-white border border-slate-200 rounded-lg shadow-sm hover:border-slate-400 transition-all group">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label className="text-[9px] font-black uppercase text-slate-400 tracking-wider">
            Attribute Label
          </label>
          <Input
            value={field.label}
            onChange={(e) => onUpdate(index, "label", e.target.value)}
            className="h-9 bg-slate-50/50 border-slate-100 focus:bg-white text-sm"
            placeholder="e.g. RAM Size"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-[9px] font-black uppercase text-slate-400 tracking-wider">
            Data Type
          </label>
          <Select
            value={field.type}
            onValueChange={(v) => onUpdate(index, "type", v)}
          >
            <SelectTrigger className="h-9 bg-slate-50/50 border-slate-100 text-sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="text">String</SelectItem>
              <SelectItem value="number">Numeric</SelectItem>
              <SelectItem value="select">Enumerated (List)</SelectItem>
              <SelectItem value="boolean">Boolean (Toggle)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="col-span-2 flex items-center justify-between mt-2 pt-3 border-t border-slate-50">
          <Button
            variant="ghost"
            className={`h-7 px-3 text-[10px] font-bold uppercase gap-2 transition-all ${field.required ? "text-slate-900 bg-slate-100" : "text-slate-300"}`}
            onClick={() => onUpdate(index, "required", !field.required)}
          >
            <ShieldCheck
              size={12}
              className={field.required ? "text-slate-900" : "text-slate-300"}
            />
            {field.required ? "Required" : "Optional"}
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => onRemove(index)}
            className="h-7 w-7 text-slate-300 hover:text-red-600 hover:bg-red-50 rounded-full"
          >
            <Trash2 size={14} />
          </Button>
        </div>

        {field.type === "select" && (
          <div className="col-span-2 mt-2 space-y-1.5 animate-in fade-in slide-in-from-top-1">
            <label className="text-[9px] font-black uppercase text-blue-600 tracking-widest italic">
              Enum Options (CSV)
            </label>
            <Input
              value={field.options || ""}
              className="h-9 border-dashed border-blue-200 bg-blue-50/20 text-xs text-blue-900 focus:border-blue-500"
              placeholder="e.g. 4GB, 8GB, 16GB"
              onChange={(e) => onUpdate(index, "options", e.target.value)}
            />
          </div>
        )}
      </div>
    </div>
  );
};
