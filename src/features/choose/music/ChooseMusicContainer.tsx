"use client";
import React, { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useQuery, useMutation } from "@tanstack/react-query";
import api from "src/shared/lib/axios";
import Button from "src/components/ui/Button";
import SelectionGrid, { SelectionItem } from "src/components/ui/SelectionGrid";
import SelectionContainer from "src/components/ui/SelectionContainer";

export default function ChooseMusicContainer() {
  const [selectedMusic, setSelectedMusic] = useState<number[]>([]);
  const router = useRouter();
  const searchParams = useSearchParams();
  const origin = searchParams.get("origin") || "auth";

  const continueLink =
    origin === "auth" ? `/chats?origin=auth` : `/profile/edit?origin=profile`;

  // Запрос всех музыкальных жанров
  const { data: allMusic = [] } = useQuery<SelectionItem[]>({
    queryKey: ["music"],
    queryFn: async () => {
      const res = await api.get("/interests/musiclist/");
      return res.data;
    },
  });

  // Запрос музыкальных жанров пользователя
  const { data: userMusic = [] } = useQuery({
    queryKey: ["user-music"],
    queryFn: async () => {
      const token = localStorage.getItem("accessToken");
      const res = await api.get("/interests/usermusics/", {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data;
    },
  });

  // Mutation для сохранения музыкальных жанров (PUT-запрос)
  const saveMusicMutation = useMutation({
    mutationFn: async (music_ids: number[]) => {
      const token = localStorage.getItem("accessToken");
      return api.put(
        "/interests/usermusics/",
        { music_ids },
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
      console.error("Ошибка при сохранении музыкальных жанров:", err);
    },
  });

  // При загрузке выбираем уже выбранные музыкальные жанры
  React.useEffect(() => {
    if (userMusic.length > 0) {
      const selected = userMusic.map((um: any) => um.music_id);
      setSelectedMusic(selected);
    }
  }, [userMusic]);

  const toggleMusic = (id: number) => {
    setSelectedMusic((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id],
    );
  };

  const handleContinue = () => {
    if (selectedMusic.length === 0) return;
    saveMusicMutation.mutate(selectedMusic);
  };

  return (
    <div className="flex flex-col items-center justify-center space-y-6">
      <div className="mb-6 text-center">
        <h2 className="text-2xl font-bold">Выберите ваш музыкальный вкус</h2>
      </div>
      <SelectionContainer>
        <SelectionGrid
          items={allMusic}
          selectedItems={selectedMusic}
          onToggle={toggleMusic}
        />
      </SelectionContainer>
      <div className="w-full max-w-xs">
        <Button
          onClick={handleContinue}
          disabled={selectedMusic.length < 2}
          className={
            selectedMusic.length < 2 ? "opacity-50 cursor-not-allowed" : ""
          }
        >
          Продолжить
        </Button>
      </div>
    </div>
  );
}
