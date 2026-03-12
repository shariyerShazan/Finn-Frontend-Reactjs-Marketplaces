"use client";
// import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
// import { Button } from "@/components/ui/button"; 

interface Props {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const CommonPagination = ({ currentPage, totalPages, onPageChange }: Props) => {
  return (
    <div className="flex items-center justify-between w-full my-3 px-2">
      {/* 📝 Left Side: Status Text */}
      <div className="text-sm font-medium text-slate-500 bg-slate-50 px-4 py-2 rounded-full border border-slate-100">
        Showing Page{" "}
        <span className="text-[#0064AE] font-bold">{currentPage}</span> of{" "}
        <span className="text-slate-800 font-bold">{totalPages}</span>
      </div>

      {/* 🚀 Right Side: Navigation Buttons */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => onPageChange(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1}
          className="flex cursor-pointer items-center gap-1 p-2 text-sm font-semibold rounded-xl border bg-white text-slate-600 hover:bg-slate-50 hover:border-[#0064AE] hover:text-[#0064AE] disabled:opacity-40 disabled:hover:bg-white disabled:hover:border-slate-200 disabled:hover:text-slate-600 transition-all active:scale-95 shadow-sm"
        >
          <ChevronLeft size={20} strokeWidth={2.5} />
          
        </button>

        <button
          onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage === totalPages}
          className="flex items-center gap-1  p-2 cursor-pointer text-sm font-semibold rounded-xl border bg-[#0064AE] text-white hover:bg-[#004f8b] shadow-md shadow-blue-100 disabled:opacity-50 transition-all active:scale-95"
        >
          
          <ChevronRight size={20} strokeWidth={2.5} />
        </button>
      </div>
    </div>
  );
};

export default CommonPagination;
