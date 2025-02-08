"use client";
import React, { useState } from "react";
import Header from "src/components/layout/Header";
import InputField from "src/components/ui/InputField";
import SearchResultCard from "src/features/search/ui/SearchResultCard";
import SearchFilterTabs, {
  SearchCategory,
} from "src/features/search/ui/SearchFilterTabs";
import SearchAdvancedFilter, {
  SortOrder,
  GenderFilter,
} from "src/features/search/ui/SearchAdvancedFilter";

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [currentCategory, setCurrentCategory] =
    useState<SearchCategory>("interests");
  const [advancedFilterOpen, setAdvancedFilterOpen] = useState(false);
  const [sortOrder, setSortOrder] = useState<SortOrder>("asc");
  const [gender, setGender] = useState<GenderFilter>("all");

  // Пример статических данных для каждой категории, добавлено поле gender.
  const resultsByCategory = {
    interests: [
      {
        name: "Иван Иванов",
        description: "Общие интересы: Спорт, Музыка",
        gender: "male",
      },
      {
        name: "Мария Петрова",
        description: "Общие интересы: Чтение, Кино",
        gender: "female",
      },
    ],
    hobbies: [
      {
        name: "Алексей Сидоров",
        description: "Общие хобби: Путешествия, Фотография",
        gender: "male",
      },
      {
        name: "Елена Кузнецова",
        description: "Общие хобби: Рисование, Кулинария",
        gender: "female",
      },
    ],
    music: [
      {
        name: "Дмитрий Смирнов",
        description: "Общий музыкальный вкус: Рок, Джаз",
        gender: "male",
      },
      {
        name: "Анна Михайлова",
        description: "Общий музыкальный вкус: Поп, Классика",
        gender: "female",
      },
    ],
  };

  let results = resultsByCategory[currentCategory];

  // Фильтрация по полу
  if (gender !== "all") {
    results = results.filter((user) => user.gender === gender);
  }

  // Сортировка результатов по имени
  results = results.sort((a, b) => {
    if (sortOrder === "asc") {
      return a.name.localeCompare(b.name);
    } else {
      return b.name.localeCompare(a.name);
    }
  });

  // Фильтрация по введённому запросу
  const filteredResults = results.filter((user) =>
    user.name.toLowerCase().includes(query.toLowerCase()),
  );

  return (
    <div className="min-h-screen bg-gray-100 relative">
      <Header />
      <div className="max-w-2xl mx-auto py-10 px-4">
        <h2 className="text-3xl font-bold mb-6 text-center">Поиск людей</h2>
        {/* Переключение категорий поиска */}
        <SearchFilterTabs
          currentCategory={currentCategory}
          onSelectCategory={setCurrentCategory}
        />
        <div className="relative mb-6">
          <InputField
            label="Найти пользователя"
            type="text"
            placeholder="Введите имя или ключевое слово"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          {/* Кнопка для открытия контекстного меню фильтра */}
          <button
            onClick={() => setAdvancedFilterOpen(!advancedFilterOpen)}
            className="absolute right-0 top-0 mt-8 mr-2 px-3 py-1 bg-gray-300 rounded hover:bg-gray-400"
          >
            Фильтр
          </button>
          {advancedFilterOpen && (
            <SearchAdvancedFilter
              sortOrder={sortOrder}
              onSortOrderChange={setSortOrder}
              gender={gender}
              onGenderChange={setGender}
              onClose={() => setAdvancedFilterOpen(false)}
            />
          )}
        </div>
        <div>
          {filteredResults.map((user, idx) => (
            <SearchResultCard
              key={idx}
              name={user.name}
              description={user.description}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
