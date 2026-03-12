"use client";

import { Globe } from "lucide-react";

import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

import { baseApi } from "@/redux/api/baseApi";
import { useDispatch } from "react-redux";
import { setLanguage } from "@/redux/languageSlice";

const languages = [
  { code: "en", name: "English", flag: "🇬🇧" },
  { code: "no", name: "Norwegian", flag: "🇳🇴" },
  { code: "se", name: "Swedish", flag: "🇸🇪" },
  { code: "dk", name: "Danish", flag: "🇩🇰" },
  { code: "is", name: "Icelandic", flag: "🇮🇸" },
];

const LanguageDropdownNav = () => {
  const dispatch = useDispatch();
  const currentLang = localStorage.getItem("lang") || "en";

  const handleChange = (lang: string) => {
    dispatch(setLanguage(lang));
    // Reset API cache to auto refetch all queries with new lang
    dispatch(baseApi.util.resetApiState());
  };

  const activeLanguage = languages.find((l) => l.code === currentLang) || languages[0];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex items-center gap-2 bg-black/20 hover:bg-black/30 px-3 py-2 rounded-md text-xs font-semibold cursor-pointer">
        <span>{activeLanguage.flag}</span>
        {activeLanguage.code.toUpperCase()}
        <Globe size={14} />
      </DropdownMenuTrigger>

      <DropdownMenuContent className="bg-white text-slate-800 rounded-xl shadow-xl border-none mt-2 p-2 min-w-[160px]">
        {languages.map((lang) => (
          <DropdownMenuItem
            key={lang.code}
            onClick={() => handleChange(lang.code)}
            className="cursor-pointer hover:bg-slate-100 rounded-lg py-2 flex items-center gap-2 font-semibold text-[12px]"
          >
            <span>{lang.flag}</span>
            {lang.name}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default LanguageDropdownNav;