import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { ReactNode } from "react";

export interface Column<T> {
  header: string;
  key?: keyof T | string;
  render?: (item: T) => ReactNode;
}

interface CommonTableProps<T> {
  columns: Column<T>[];
  data: T[];
}

const CommonTable = <T,>({ columns, data }: CommonTableProps<T>) => {
  return (
    <div className="w-full border-t border-slate-200">
      <Table>
        <TableHeader>
          <TableRow className="bg-[#0064AE40] hover:bg-[#0076d140] border-b border-slate-200">
            {columns.map((col, index) => (
              <TableHead
                key={index}
                className="h-12 text-[15px] font-semibold text-slate-700 py-3 first:pl-6 last:pr-6"
              >
                {col.header}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.length > 0 ? (
            data.map((row, rowIndex) => (
              <TableRow
                key={rowIndex}
                className="border-b border-slate-100 hover:bg-[#e7f5ff40] transition-colors"
              >
                {columns.map((col, colIndex) => (
                  <TableCell
                    key={colIndex}
                    className="py-3 text-[15px] text-slate-600 first:pl-6 last:pr-6"
                  >
                    {col.render
                      ? col.render(row)
                      : (row[col.key as keyof T] as ReactNode)}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell
                colSpan={columns.length}
                className="text-center py-10 text-slate-400"
              >
                No data available.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default CommonTable;
