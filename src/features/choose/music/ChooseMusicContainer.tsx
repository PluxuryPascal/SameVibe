"use client";
import React, { useState } from "react";
import Button from "src/components/ui/Button";
import SelectionGrid from "src/components/ui/SelectionGrid";
import SelectionContainer from "src/components/ui/SelectionContainer";
import { useRouter } from "next/navigation";

export default function ChooseMusicContainer() {
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
    "Фолк",
  ];

  const toggleMusic = (genre: string) => {
    setSelectedMusic((prev) =>
      prev.includes(genre) ? prev.filter((i) => i !== genre) : [...prev, genre],
    );
  };

  const router = useRouter();

  const handleContinue = () => {
    console.log("Selected music genres:", selectedMusic);
    // Переход на главный экран или сохранение настроек
    router.push("/chats");
  };

  return (
    <div className="flex flex-col items-center justify-center space-y-6">
      <div className="mb-6 text-center">
        <h2 className="text-2xl font-bold">Выберите ваш музыкальный вкус</h2>
      </div>
      <SelectionContainer>
        <SelectionGrid
          items={musicGenres}
          selectedItems={selectedMusic}
          onToggle={toggleMusic}
        />
      </SelectionContainer>
      <div className="w-full max-w-xs">
        <Button onClick={handleContinue}>Продолжить</Button>
      </div>
    </div>
  );
}
