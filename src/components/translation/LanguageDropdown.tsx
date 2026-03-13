// LanguageDropdown.tsx

import { useCallback, useEffect, useState } from "react";
import { changeLanguage, isTranslateReady } from "./useGoogleTranslate";
import { ArrowDownIcon } from "lucide-react";

export interface Language {
  code: string;
  name: string;
  flag: string;
}

const languages: Language[] = [
  { code: "en", name: "English", flag: "🇺🇸" },
  { code: "da", name: "Denmark", flag: "🇩🇰" },
  { code: "sv", name: "Sweden", flag: "🇸🇪" },
  { code: "is", name: "Iceland", flag: "🇮🇸" },
  { code: "nb", name: "Norwegian", flag: "🇳🇴" },
];

interface LanguageDropdownProps {
  onLanguageChange?: (language: Language) => void;
}

export const LanguageDropdown = ({
  onLanguageChange,
}: LanguageDropdownProps) => {
  const [selectedLanguage, setSelectedLanguage] = useState<Language>(
    languages[0],
  );
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
  const [ready, setReady] = useState(false);

  // Check if Google Translate is ready
  useEffect(() => {
    let isMounted = true;

    const checkReady = () => {
      if (!isMounted) return;

      if (isTranslateReady()) {
        setReady(true);
        loadSavedLanguage();
      } else {
        setTimeout(checkReady, 300);
      }
    };

    const timer = setTimeout(checkReady, 500);

    return () => {
      isMounted = false;
      clearTimeout(timer);
    };
  }, []);

  // Load saved language from localStorage
  const loadSavedLanguage = useCallback(() => {
    const savedLanguage = localStorage.getItem("selectedLanguage");

    if (savedLanguage) {
      try {
        const lang = JSON.parse(savedLanguage);
        setSelectedLanguage(lang);

        setTimeout(() => {
          let codeToUse = lang.code;
          if (lang.code === "nb") codeToUse = "da"; // Norway fallback
          changeLanguage(codeToUse).catch((err) => {
            console.error("[LanguageDropdown] Failed to restore language:", err);
          });
        }, 300);
      } catch (e) {
        console.error("[LanguageDropdown] Failed to parse saved language:", e);
        localStorage.removeItem("selectedLanguage");
      }
    }
  }, []);

  // Handle user selecting a language
  const handleLanguageChange = useCallback(
    async (language: Language) => {
      if (!ready) return;

      let codeToUse = language.code;

      // Norway fallback to Danish
      if (language.code === "nb") {
        console.log("[LanguageDropdown] Norway not supported, using Danish instead");
        codeToUse = "da";
      }

      setSelectedLanguage(language);
      setIsDropdownOpen(false);

      try {
        localStorage.setItem("selectedLanguage", JSON.stringify(language));
      } catch (e) {
        console.error("[LanguageDropdown] Failed to save language:", e);
      }

      if (onLanguageChange) onLanguageChange(language);

      try {
        const success = await changeLanguage(codeToUse);
        if (!success) console.error("[LanguageDropdown] Language change failed");
      } catch (error) {
        console.error("[LanguageDropdown] Error changing language:", error);
      }
    },
    [ready, onLanguageChange],
  );

  return (
    <div className="relative">
      <button
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        className="flex items-center bg-black text-white border border-black space-x-2 text-sm px-3 py-2 rounded-md hover:bg-gray-800 transition-colors"
        title={ready ? "Change Language" : "Loading translation..."}
        disabled={!ready}
      >
        <span className="text-lg">{selectedLanguage.flag}</span>
        <span className="hidden sm:inline">{selectedLanguage.name}</span>
        <ArrowDownIcon />
        {!ready && <p className="text-xs text-gray-300">Loading</p>}
      </button>

      {isDropdownOpen && (
        <>
          <div className="absolute right-0 mt-2 w-40 bg-white text-black border border-gray-200 rounded-md shadow-lg z-50">
            {languages.map((language) => (
              <button
                key={language.code}
                onClick={() => handleLanguageChange(language)}
                disabled={!ready}
                className={`w-full flex items-center space-x-2 px-4 py-2 text-sm text-black hover:bg-gray-100 transition-colors
                  ${selectedLanguage.code === language.code ? "bg-gray-50 font-semibold" : ""}
                  ${!ready ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
              >
                <span className="text-lg">{language.flag}</span>
                <span>{language.name}</span>
                {selectedLanguage.code === language.code && (
                  <span className="ml-auto text-green-600 text-xs">✓</span>
                )}
              </button>
            ))}
            {!ready && (
              <div className="px-4 py-2 text-xs text-gray-500 border-t border-gray-200">
                Loading translation...
              </div>
            )}
          </div>

          <div className="fixed inset-0 z-40" onClick={() => setIsDropdownOpen(false)} />
        </>
      )}
    </div>
  );
};

export default LanguageDropdown;