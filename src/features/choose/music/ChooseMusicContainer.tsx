"use client";
import React, { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Button from "src/components/ui/Button";
import SelectionGrid from "src/components/ui/SelectionGrid";
import SelectionContainer from "src/components/ui/SelectionContainer";

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
  const searchParams = useSearchParams();
  const origin = searchParams.get("origin") || "auth";

  // Если пользователь пришёл с авторизации, то после выбора музыкального вкуса переходим в чаты,
  // иначе возвращаемся на страницу редактирования профиля.
  const continueLink =
    origin === "auth" ? `/chats?origin=auth` : `/profile/edit?origin=profile`;

  const handleContinue = async () => {
    if (selectedMusic.length === 0) return;
    console.log("Selected music genres:", selectedMusic);
    try {
      // Отправка выбранных музыкальных вкусов на сервер
      const response = await fetch("/api/save-music/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // Если используется JWT, можно добавить заголовок:
          // "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({ musicGenres: selectedMusic }),
      });
      if (!response.ok) {
        throw new Error("Ошибка сохранения музыкальных вкусов");
      }
    } catch (error) {
      console.error("Ошибка при сохранении музыкальных вкусов:", error);
      return;
    }
    router.push(continueLink);
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
        <Button
          onClick={handleContinue}
          disabled={selectedMusic.length === 0}
          className={
            selectedMusic.length === 0 ? "opacity-50 cursor-not-allowed" : ""
          }
        >
          Продолжить
        </Button>
      </div>
    </div>
  );
}
