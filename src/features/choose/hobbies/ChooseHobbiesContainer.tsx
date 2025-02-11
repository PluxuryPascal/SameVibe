"use client";
import React, { useState } from "react";
import Button from "src/components/ui/Button";
import SelectionGrid from "src/components/ui/SelectionGrid";
import SelectionContainer from "src/components/ui/SelectionContainer";
import { useRouter } from "next/navigation";

export default function ChooseHobbiesContainer() {
  const [selectedHobbies, setSelectedHobbies] = useState<string[]>([]);
  const hobbies = [
    "Чтение",
    "Путешествия",
    "Рисование",
    "Игры",
    "Кулинария",
    "Фотография",
    "Спорт",
    "Рукоделие",
    "Велоспорт",
    "Плавание",
    "Пешие прогулки",
    "Садоводство",
  ];

  const toggleHobby = (hobby: string) => {
    setSelectedHobbies((prev) =>
      prev.includes(hobby) ? prev.filter((i) => i !== hobby) : [...prev, hobby],
    );
  };

  const router = useRouter();

  const handleContinue = () => {
    console.log("Selected hobbies:", selectedHobbies);
    // Переход на страницу выбора музыкального вкуса
    router.push("/choose/music");
  };

  return (
    <div className="flex flex-col items-center justify-center space-y-6">
      <div className="mb-6 text-center">
        <h2 className="text-2xl font-bold">Выберите ваши хобби</h2>
      </div>
      <SelectionContainer>
        <SelectionGrid
          items={hobbies}
          selectedItems={selectedHobbies}
          onToggle={toggleHobby}
        />
      </SelectionContainer>
      <div className="w-full max-w-xs">
        <Button onClick={handleContinue}>Продолжить</Button>
      </div>
    </div>
  );
}
