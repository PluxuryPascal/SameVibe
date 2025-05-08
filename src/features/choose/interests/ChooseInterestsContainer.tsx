"use client";
import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useQuery, useMutation } from "@tanstack/react-query";
import api from "src/shared/lib/axios";
import Button from "src/components/ui/Button";
import SelectionGrid, { SelectionItem } from "src/components/ui/SelectionGrid";
import InterestsSelectionContainer from "@/components/ui/SelectionContainer";
import { useTranslations } from "next-intl";

export default function ChooseInterestsContainer() {
  // Храним выбранные интересы как массив числовых id
  const [selectedInterests, setSelectedInterests] = useState<number[]>([]);
  const router = useRouter();
  const searchParams = useSearchParams();
  const origin = searchParams.get("origin") || "auth";
  const t = useTranslations("");

  const continueLink =
    origin === "auth"
      ? `/choose/hobbies?origin=auth`
      : `/profile/edit?origin=profile`;

  // Получение всех интересов (ожидается массив объектов { id, name })
  const { data: allInterests = [] } = useQuery<SelectionItem[]>({
    queryKey: ["interests"],
    queryFn: async () => {
      const res = await api.get("/interests/interestslist/");
      return res.data;
    },
  });

  // Получение интересов пользователя (ожидается массив объектов { id, name })
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

  // Mutation для сохранения интересов (PUT-запрос с телом { interest_ids: [...] })
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

  useEffect(() => {
    if (userInterests.length > 0) {
      const selected = userInterests.map((ui: any) => ui.interest.id);
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
        <h2 className="text-2xl font-bold">{t("choose_interests_title")}</h2>
      </div>
      <InterestsSelectionContainer>
        <SelectionGrid
          items={allInterests} // ожидается, что каждый элемент имеет поля id и name
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
          {t("choose_continue")}
        </Button>
      </div>
    </div>
  );
}
