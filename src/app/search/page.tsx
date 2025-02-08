"use client";
import React, { useState } from "react";
import Header from "src/components/layout/Header";
import InputField from "src/components/ui/InputField";
import SearchResultCard from "src/features/search/ui/SearchResultCard";

export default function SearchPage() {
  const [query, setQuery] = useState("");

  // Пример статического списка пользователей для поиска.
  const results = [
    { name: "Иван Иванов", description: "Общие интересы: Спорт, Музыка" },
    { name: "Мария Петрова", description: "Общие интересы: Чтение, Кино" },
    {
      name: "Алексей Сидоров",
      description: "Общие интересы: Путешествия, Технологии",
    },
  ];

  // Фильтрация результатов по введённому запросу.
  const filteredResults = results.filter((user) =>
    user.name.toLowerCase().includes(query.toLowerCase()),
  );

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Общий Header */}
      <Header />
      <div className="max-w-2xl mx-auto py-10 px-4">
        <h2 className="text-3xl font-bold mb-6 text-center">Поиск</h2>
        <div className="mb-6">
          <InputField
            label="Найти пользователя"
            type="text"
            placeholder="Введите имя или интерес"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
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
