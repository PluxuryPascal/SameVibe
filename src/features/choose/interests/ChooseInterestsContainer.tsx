"use client";
import React, { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Button from "src/components/ui/Button";
import SelectionGrid from "src/components/ui/SelectionGrid";
import InterestsSelectionContainer from "@/components/ui/SelectionContainer";

export default function ChooseInterestsContainer() {
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
    "Приода",
    "Прида",
    "Прда",
    "Пда",
    "Па",
    "Пд",
    "рирода",
    "Пирода",
    "Пррода",
    "Прироа",
    "Посолса",
    "Прспорода",
    "Прспрода",
    "Прсприрода",
    "сода",
    "Псопроирода",
  ];

  const toggleInterest = (interest: string) => {
    setSelectedInterests((prev) =>
      prev.includes(interest)
        ? prev.filter((i) => i !== interest)
        : [...prev, interest],
    );
  };

  const router = useRouter();
  const searchParams = useSearchParams();
  const origin = searchParams.get("origin") || "auth";

  // Формируем ссылку перехода в зависимости от источника
  const continueLink =
    origin === "auth"
      ? `/choose/hobbies?origin=auth`
      : `/profile/edit?origin=profile`;

  const handleContinue = async () => {
    if (selectedInterests.length === 0) return;
    console.log("Selected interests:", selectedInterests);
    try {
      // Отправка выбранных интересов на сервер
      const response = await fetch("/api/save-interests/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // Если используется JWT, можно добавить:
          // "Authorization": `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ interests: selectedInterests }),
      });
      if (!response.ok) {
        throw new Error("Ошибка сохранения интересов");
      }
    } catch (error) {
      console.error("Ошибка при сохранении интересов:", error);
      return;
    }
    router.push(continueLink);
  };

  return (
    <div className="flex flex-col items-center justify-center space-y-6">
      <div className="mb-6 text-center">
        <h2 className="text-2xl font-bold">Выберите ваши интересы</h2>
      </div>
      <InterestsSelectionContainer>
        <SelectionGrid
          items={interests}
          selectedItems={selectedInterests}
          onToggle={toggleInterest}
        />
      </InterestsSelectionContainer>
      <div className="w-full max-w-xs">
        <Button
          onClick={handleContinue}
          disabled={selectedInterests.length === 0}
          className={
            selectedInterests.length === 0
              ? "opacity-50 cursor-not-allowed"
              : ""
          }
        >
          Продолжить
        </Button>
      </div>
    </div>
  );
}
