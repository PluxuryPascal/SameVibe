import { useTranslations } from "next-intl";
import React from "react";

export type SearchCategory = "interests" | "hobbies" | "music";

interface SearchFilterTabsProps {
  currentCategory: SearchCategory;
  onSelectCategory: (category: SearchCategory) => void;
}

export default function SearchFilterTabs({
  currentCategory,
  onSelectCategory,
}: SearchFilterTabsProps) {
  const t = useTranslations("");
  return (
    <div className="flex space-x-4">
      <button
        onClick={() => onSelectCategory("interests")}
        className={`flex-1 px-4 py-2 rounded ${
          currentCategory === "interests"
            ? "bg-blue-500 text-white"
            : "bg-gray-200 text-gray-800"
        }`}
      >
        {t("search_button_interests")}
      </button>
      <button
        onClick={() => onSelectCategory("hobbies")}
        className={`flex-1 px-4 py-2 rounded ${
          currentCategory === "hobbies"
            ? "bg-blue-500 text-white"
            : "bg-gray-200 text-gray-800"
        }`}
      >
        {t("search_button_hobbys")}
      </button>
      <button
        onClick={() => onSelectCategory("music")}
        className={`flex-1 px-4 py-2 rounded ${
          currentCategory === "music"
            ? "bg-blue-500 text-white"
            : "bg-gray-200 text-gray-800"
        }`}
      >
        {t("search_button_musics")}
      </button>
    </div>
  );
}
