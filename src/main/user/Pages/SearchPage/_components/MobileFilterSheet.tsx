"use client";

import { X } from "lucide-react";

interface Props {
  open: boolean;
  setOpen: (open: boolean) => void;
  children: React.ReactNode;
}

const MobileFilterSheet = ({ open, setOpen, children }: Props) => {
  return (
    <>
      {/* Overlay */}
      <div
        className={`fixed inset-0 bg-black/40 z-[998] transition-opacity ${
          open ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
        onClick={() => setOpen(false)}
      />

      {/* Bottom Sheet */}
      <div
        className={`fixed bottom-0 left-0 w-full bg-white rounded-t-3xl z-[999] p-6 max-h-[85vh] overflow-y-auto transition-transform duration-300 ${
          open ? "translate-y-0" : "translate-y-full"
        }`}
      >
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-bold">Filters</h3>

          <button
            onClick={() => setOpen(false)}
            className="p-2 rounded-full hover:bg-gray-100"
          >
            <X size={20} />
          </button>
        </div>

        {children}
      </div>
    </>
  );
};

export default MobileFilterSheet;
