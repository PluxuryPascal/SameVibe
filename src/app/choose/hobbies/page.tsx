"use client";

import React, { useState } from "react";
import Link from "next/link";
import Logo from "src/components/ui/Logo";
import Button from "src/components/ui/Button";
import SelectionGrid from "src/components/ui/SelectionGrid";

export default function ChooseHobbiesPage() {
  // Локальное состояние для выбранных хобби (часть бизнес-логики)
  const [selectedHobbies, setSelectedHobbies] = useState<string[]>([]);
  const hobbies = [
    "Чтение",
    "Путешествия",
    "Рисование",
    "Игры",
    "Кулинария",
    "Фотография",
    "Музыка",
    "Спорт",
    "Мода",
  ];

  const toggleHobby = (hobby: string) => {
    setSelectedHobbies((prev) =>
      prev.includes(hobby) ? prev.filter((i) => i !== hobby) : [...prev, hobby],
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
            <h2 className="text-2xl font-bold mt-4">Выберите ваши хобби</h2>
          </div>
          {/* Сетка выбора хобби */}
          <SelectionGrid
            items={hobbies}
            selectedItems={selectedHobbies}
            onToggle={toggleHobby}
          />
          {/* Кнопка продолжения */}
          <div className="mt-6 w-full max-w-xs">
            <Button
              onClick={() => console.log("Selected hobbies:", selectedHobbies)}
            >
              Продолжить
            </Button>
          </div>
          {/* Навигация к следующей странице (Выбор музыкального вкуса) */}
          <div className="mt-4">
            <Link href="/choose/music" className="text-blue-500">
              Перейти к выбору музыкального вкуса
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
