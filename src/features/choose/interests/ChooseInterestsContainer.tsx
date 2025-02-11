"use client";
import React, { useState } from "react";
import Button from "src/components/ui/Button";
import SelectionGrid from "src/components/ui/SelectionGrid";
import InterestsSelectionContainer from "src/components/ui/InterestsSelectionContainer";
import { useRouter } from "next/navigation";

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

  const handleContinue = () => {
    console.log("Selected interests:", selectedInterests);
    // Переход на следующую страницу (например, выбор хобби)
    router.push("/choose/hobbies");
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
        <Button onClick={handleContinue}>Продолжить</Button>
      </div>
    </div>
  );
}
