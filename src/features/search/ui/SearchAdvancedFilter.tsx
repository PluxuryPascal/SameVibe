import React from "react";

export type SortOrder = "asc" | "desc";
export type GenderFilter = "all" | "male" | "female";

interface SearchAdvancedFilterProps {
  sortOrder: SortOrder;
  onSortOrderChange: (order: SortOrder) => void;
  gender: GenderFilter;
  onGenderChange: (gender: GenderFilter) => void;
  onClose: () => void;
}

export default function SearchAdvancedFilter({
  sortOrder,
  onSortOrderChange,
  gender,
  onGenderChange,
  onClose,
}: SearchAdvancedFilterProps) {
  return (
    <div className="absolute right-0 mt-4 bg-white border border-gray-200 rounded shadow-lg p-4 z-50">
      <div className="mb-4">
        <h4 className="font-semibold mb-2">Сортировка</h4>
        <div className="flex space-x-2">
          <button
            onClick={() => onSortOrderChange("asc")}
            className={`px-3 py-1 rounded ${
              sortOrder === "asc"
                ? "bg-blue-500 text-white"
                : "bg-gray-200 text-gray-800"
            }`}
          >
            А-Я
          </button>
          <button
            onClick={() => onSortOrderChange("desc")}
            className={`px-3 py-1 rounded ${
              sortOrder === "desc"
                ? "bg-blue-500 text-white"
                : "bg-gray-200 text-gray-800"
            }`}
          >
            Я-А
          </button>
        </div>
      </div>
      <div className="mb-4">
        <h4 className="font-semibold mb-2">Пол</h4>
        <div className="flex space-x-2">
          <button
            onClick={() => onGenderChange("all")}
            className={`px-3 py-1 rounded ${
              gender === "all"
                ? "bg-blue-500 text-white"
                : "bg-gray-200 text-gray-800"
            }`}
          >
            Все
          </button>
          <button
            onClick={() => onGenderChange("male")}
            className={`px-3 py-1 rounded ${
              gender === "male"
                ? "bg-blue-500 text-white"
                : "bg-gray-200 text-gray-800"
            }`}
          >
            Мужской
          </button>
          <button
            onClick={() => onGenderChange("female")}
            className={`px-3 py-1 rounded ${
              gender === "female"
                ? "bg-blue-500 text-white"
                : "bg-gray-200 text-gray-800"
            }`}
          >
            Женский
          </button>
        </div>
      </div>
      <div className="text-right">
        <button onClick={onClose} className="text-blue-500 underline">
          Закрыть
        </button>
      </div>
    </div>
  );
}
