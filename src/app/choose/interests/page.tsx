"use client";

import React, { useState } from "react";
import Link from "next/link";
import Logo from "src/components/ui/Logo";
import Button from "src/components/ui/Button";
import SelectionGrid from "src/components/ui/SelectionGrid";

export default function ChooseInterestsPage() {
  // Локальное состояние для выбранных интересов (бизнес-логика)
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const interests = [
    "Спорт",
    "Музыка",
    "Кино",
    "Путешествия",
    "Книги",
    "Технологии",
    "Искусство",
    "Еда",
    "Природа",
  ];

  const toggleInterest = (interest: string) => {
    setSelectedInterests((prev) =>
      prev.includes(interest)
        ? prev.filter((i) => i !== interest)
        : [...prev, interest],
    );
  };

  return (
    <div className="min-h-screen flex  items-center justify-center p-4">
      <div className="grid grid-cols-2 gap-8 w-full max-w-6xl">
        {/* Логотип */}
        <div className="flex items-center justify-center">
          <Logo width={800} height={800} />
        </div>
        <div className="flex flex-col items-center justify-center">
          <div className="mb-6 text-center">
            <h2 className="text-2xl font-bold mt-4">Выберите ваши интересы</h2>
          </div>
          {/* Сетка выбора интересов */}
          <SelectionGrid
            items={interests}
            selectedItems={selectedInterests}
            onToggle={toggleInterest}
          />
          {/* Кнопка продолжения */}
          <div className="mt-6 w-full max-w-xs">
            <Button
              onClick={() =>
                console.log("Selected interests:", selectedInterests)
              }
            >
              Продолжить
            </Button>
          </div>
          {/* Ссылка для перехода к следующей странице (например, выбор хобби) */}
          <div className="mt-4 text-blue-500">
            <Link href="/choose/hobbies">Перейти к выбору хобби</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
