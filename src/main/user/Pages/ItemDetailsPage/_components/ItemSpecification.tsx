/* eslint-disable @typescript-eslint/no-explicit-any */
// import React from "react";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { Settings2 } from "lucide-react";

const ItemSpecification = ({ specifications } : any) => {
  if (!specifications || Object.keys(specifications).length === 0) return null;

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-bold text-slate-800">Specifications</h3>
      <div className="border rounded-2xl overflow-hidden bg-white">
        <Table>
          <TableBody className="grid grid-cols-1 md:grid-cols-2 divide-x">
            {Object.entries(specifications).map(([key, value], i) => (
              <TableRow key={i} className="flex items-center border-b group">
                <TableCell className="w-1/2 py-4 px-6 flex items-center gap-3">
                  <div className="p-2 bg-slate-100 rounded-lg text-[#0064AE] group-hover:bg-[#0064AE] group-hover:text-white transition-all">
                    <Settings2 size={16} />
                  </div>
                  <span className="font-semibold text-slate-600 text-sm capitalize">
                    {key.replace(/([A-Z])/g, " $1").trim()}
                  </span>
                </TableCell>
                <TableCell className="w-1/2 py-4 px-6 text-sm font-medium text-slate-800">
                  {value as any}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default ItemSpecification;
