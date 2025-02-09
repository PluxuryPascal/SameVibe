"use client";
import React, { useState } from "react";
import Link from "next/link";
import Logo from "src/components/ui/Logo";
import Button from "src/components/ui/Button";
import SelectionGrid from "src/components/ui/SelectionGrid";

export default function ChooseMusicPage() {
  // Локальное состояние для выбранных музыкальных вкусов
  const [selectedMusic, setSelectedMusic] = useState<string[]>([]);
  const musicGenres = [
    "Рок",
    "Поп",
    "Джаз",
    "Классика",
    "Хип-хоп",
    "Электронная",
    "Рэгги",
    "Металл",
    "Блюз",
  ];

  const toggleMusic = (genre: string) => {
    setSelectedMusic((prev) =>
      prev.includes(genre)
        ? prev.filter((item) => item !== genre)
        : [...prev, genre],
    );
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      {/* Заголовок и логотип */}
      <div className="mb-6 text-center">
        <Logo />
        <h2 className="text-2xl font-bold mt-4">
          Выберите ваш музыкальный вкус
        </h2>
      </div>
      {/* Сетка выбора музыкальных жанров */}
      <SelectionGrid
        items={musicGenres}
        selectedItems={selectedMusic}
        onToggle={toggleMusic}
      />
      {/* Кнопка продолжения */}
      <div className="mt-6 w-full max-w-xs">
        <Button
          onClick={() => console.log("Selected music genres:", selectedMusic)}
        >
          Продолжить
        </Button>
      </div>
      {/* Навигация. Например, можно направить на главный экран или другую страницу */}
      <div className="mt-4">
        <Link href="/main" className="text-blue-500">
          Перейти к главному экрану
        </Link>
      </div>
    </div>
  );
}
