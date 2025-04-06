"use client";
import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useQuery, useMutation } from "@tanstack/react-query";
import api from "src/shared/lib/axios";
import Button from "src/components/ui/Button";
import SelectionGrid from "src/components/ui/SelectionGrid";
import InterestsSelectionContainer from "@/components/ui/SelectionContainer";

interface InterestItem {
  id: number;
  name: string;
}

export default function ChooseInterestsContainer() {
  // Храним выбранные интересы как массив числовых id
  const [selectedInterests, setSelectedInterests] = useState<number[]>([]);
  const router = useRouter();
  const searchParams = useSearchParams();
  const origin = searchParams.get("origin") || "auth";

  const continueLink =
    origin === "auth"
      ? `/choose/hobbies?origin=auth`
      : `/profile/edit?origin=profile`;

  // Получение всех интересов
  const { data: allInterests = [] } = useQuery<InterestItem[]>({
    queryKey: ["interests"],
    queryFn: async () => {
      const res = await api.get("/interests/interestslist/");
      return res.data;
    },
  });

  // Получение интересов пользователя
  const { data: userInterests = [] } = useQuery({
    queryKey: ["user-interests"],
    queryFn: async () => {
      const token = localStorage.getItem("accessToken");
      const res = await api.get("/interests/userinterests/", {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data;
    },
  });

  // Сохранение интересов пользователя (PUT-запрос)
  const saveInterestsMutation = useMutation({
    mutationFn: async (interest_ids: number[]) => {
      const token = localStorage.getItem("accessToken");
      return api.put(
        "/interests/userinterests/",
        { interest_ids },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
    },
    onSuccess: () => {
      router.push(continueLink);
    },
    onError: (err) => {
      console.error("Ошибка при сохранении интересов:", err);
    },
  });

  // При загрузке компонента устанавливаем выбранные интересы
  useEffect(() => {
    if (userInterests.length > 0) {
      const selected = userInterests.map((ui: any) => ui.interest_id);
      setSelectedInterests(selected);
    }
  }, [userInterests]);

  // Функция переключения выбора интереса (принимает id интереса)
  const toggleInterest = (id: number) => {
    setSelectedInterests((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id],
    );
  };

  const handleContinue = () => {
    if (selectedInterests.length < 2) return;
    saveInterestsMutation.mutate(selectedInterests);
  };

  return (
    <div className="flex flex-col items-center justify-center space-y-6">
      <div className="mb-6 text-center">
        <h2 className="text-2xl font-bold">Выберите ваши интересы</h2>
      </div>
      <InterestsSelectionContainer>
        <SelectionGrid
          items={allInterests} // ожидаем, что каждый элемент имеет поля id и name
          selectedItems={selectedInterests} // массив id выбранных интересов
          onToggle={toggleInterest}
        />
      </InterestsSelectionContainer>
      <div className="w-full max-w-xs">
        <Button
          onClick={handleContinue}
          disabled={selectedInterests.length < 2}
          className={
            selectedInterests.length < 2 ? "opacity-50 cursor-not-allowed" : ""
          }
        >
          Продолжить
        </Button>
      </div>
    </div>
  );
}
