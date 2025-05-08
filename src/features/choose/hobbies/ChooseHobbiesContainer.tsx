"use client";
import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useQuery, useMutation } from "@tanstack/react-query";
import api from "src/shared/lib/axios";
import Button from "src/components/ui/Button";
import SelectionGrid, { SelectionItem } from "src/components/ui/SelectionGrid";
import SelectionContainer from "src/components/ui/SelectionContainer";
import { useTranslations } from "next-intl";

export default function ChooseHobbiesContainer() {
  // Храним выбранные хобби как массив числовых id
  const [selectedHobbies, setSelectedHobbies] = useState<number[]>([]);
  const router = useRouter();
  const searchParams = useSearchParams();
  const origin = searchParams.get("origin") || "auth";
  const t = useTranslations("");

  const continueLink =
    origin === "auth"
      ? `/choose/music?origin=auth`
      : `/profile/edit?origin=profile`;

  // Получение всех хобби (ожидается массив объектов { id, name })
  const { data: allHobbies = [] } = useQuery<SelectionItem[]>({
    queryKey: ["hobbies"],
    queryFn: async () => {
      const res = await api.get("/interests/hobbylist/");
      return res.data;
    },
  });

  // Получение хобби, выбранных пользователем (ожидается массив объектов с полем hobby_id)
  const { data: userHobbies = [] } = useQuery({
    queryKey: ["user-hobbies"],
    queryFn: async () => {
      const token = localStorage.getItem("accessToken");
      const res = await api.get("/interests/userhobbies/", {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data;
    },
  });

  // Mutation для сохранения хобби (PUT-запрос с телом { hobby_ids: [...] })
  const saveHobbiesMutation = useMutation({
    mutationFn: async (hobby_ids: number[]) => {
      const token = localStorage.getItem("accessToken");
      return api.put(
        "/interests/userhobbies/",
        { hobby_ids },
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
      console.error("Ошибка при сохранении хобби:", err);
    },
  });

  useEffect(() => {
    if (userHobbies.length > 0) {
      const selected = userHobbies.map((uh: any) => uh.hobby.id);
      setSelectedHobbies(selected);
    }
  }, [userHobbies]);

  // Функция переключения выбранного хобби
  const toggleHobby = (id: number) => {
    setSelectedHobbies((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id],
    );
  };

  const handleContinue = () => {
    if (selectedHobbies.length < 2) return;
    saveHobbiesMutation.mutate(selectedHobbies);
  };

  return (
    <div className="flex flex-col items-center justify-center space-y-6">
      <div className="mb-6 text-center">
        <h2 className="text-2xl font-bold">{t("choose_hobbies_title")}</h2>
      </div>
      <SelectionContainer>
        <SelectionGrid
          items={allHobbies} // массив объектов { id, name }
          selectedItems={selectedHobbies} // массив id выбранных хобби
          onToggle={toggleHobby}
        />
      </SelectionContainer>
      <div className="w-full max-w-xs">
        <Button
          onClick={handleContinue}
          disabled={selectedHobbies.length < 2}
          className={
            selectedHobbies.length < 2 ? "opacity-50 cursor-not-allowed" : ""
          }
        >
          {t("choose_continue")}
        </Button>
      </div>
    </div>
  );
}
