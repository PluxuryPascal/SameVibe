"use client";
import React, { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Button from "src/components/ui/Button";
import SelectionGrid from "src/components/ui/SelectionGrid";
import SelectionContainer from "src/components/ui/SelectionContainer";

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
  const searchParams = useSearchParams();
  const origin = searchParams.get("origin") || "auth";

  // Если пользователь пришёл с авторизации, продолжаем на выбор музыкальных вкусов,
  // иначе возвращаемся на страницу редактирования профиля
  const continueLink =
    origin === "auth"
      ? `/choose/music?origin=auth`
      : `/profile/edit?origin=profile`;

  const handleContinue = () => {
    if (selectedHobbies.length === 0) return;
    console.log("Selected hobbies:", selectedHobbies);
    // Здесь можно добавить сохранение выбранных хобби на сервере
    router.push(continueLink);
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
        <Button
          onClick={handleContinue}
          disabled={selectedHobbies.length === 0}
          className={`${selectedHobbies.length === 0 ? "opacity-50 cursor-not-allowed" : ""}`}
        >
          Продолжить
        </Button>
      </div>
    </div>
  );
}
