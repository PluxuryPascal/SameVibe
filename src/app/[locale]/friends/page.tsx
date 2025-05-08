"use client";

import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import api from "src/shared/lib/axios";
import Header from "src/components/layout/Header";
import FriendsTabs, { FriendsTab } from "src/features/friends/ui/FriendsTabs";
import FriendCard from "src/features/friends/ui/FriendCard";
import { useTranslations } from "next-intl";

interface FriendInfo {
  first_name: string;
  last_name: string;
  avatar: string | null;
}
interface FriendshipData {
  status: "accepted" | "sended";
  other: FriendInfo;
  other_id: number;
}

function authHeader() {
  const token = localStorage.getItem("accessToken");
  return { Authorization: `Bearer ${token}` };
}

export default function FriendsPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [currentTab, setCurrentTab] = useState<FriendsTab>("accepted");
  const t = useTranslations("");

  // Получаем список дружбы для текущего пользователя по выбранной вкладке
  const {
    data = [],
    isLoading,
    error,
  } = useQuery<FriendshipData[]>({
    queryKey: ["friendships", currentTab],
    queryFn: async () => {
      const res = await api.get("/friends/friendshiplist/", {
        headers: authHeader(),
        params: { cat: currentTab },
      });
      return res.data;
    },
    keepPreviousData: true,
  });

  // Мутация для удаления (отклонения/отмены заявки или удаления друга)
  const deleteMut = useMutation({
    mutationFn: async (otherId: number) => {
      return api.delete("/friends/friendship/", {
        headers: authHeader(),
        data: { other_user_id: otherId },
      });
    },
    onSuccess: () => queryClient.invalidateQueries(["friendships", currentTab]),
  });

  // Мутация для принятия входящей заявки
  const acceptMut = useMutation({
    mutationFn: async (otherId: number) => {
      return api.patch(
        "/friends/friendship/",
        { other_user_id: otherId },
        { headers: authHeader() },
      );
    },
    onSuccess: () => queryClient.invalidateQueries(["friendships", currentTab]),
  });

  // Мутация для создания (или получения уже существующего) чата
  const chatMut = useMutation({
    mutationFn: async (otherId: number) => {
      return api.post(
        "/chat/chats/",
        { to_user: otherId },
        { headers: authHeader() },
      );
    },
    onSuccess: (response) => {
      const chatId = response.data.id;
      router.push(`/chats/${chatId}`);
    },
    onError: (err) => {
      console.error("Ошибка создания чата:", err);
    },
  });

  if (isLoading) {
    return <div className="p-10 text-center">Загрузка...</div>;
  }
  if (error) {
    return (
      <div className="p-10 text-center text-red-500">
        Ошибка загрузки данных
      </div>
    );
  }

  // Преобразовываем текущую вкладку в тип для FriendCard
  // Ожидаемые значения: incoming, outgoing, accepted.
  const mapType = (tab: FriendsTab): "incoming" | "outgoing" | "accepted" => {
    if (tab === "received") return "incoming";
    if (tab === "sended") return "outgoing";
    return "accepted";
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <div className="max-w-2xl mx-auto py-10 px-4">
        <h2 className="text-3xl font-bold mb-6 text-center">
          {t("friends_title")}
        </h2>
        <FriendsTabs current={currentTab} onChange={setCurrentTab} />
        <div className="bg-white p-4 rounded-b-xl shadow">
          {data.length === 0 ? (
            <div className="text-center py-6 font-bold">
              {currentTab === "received" && t("friends_empty_received")}
              {currentTab === "sended" && t("friends_empty_sended")}
              {currentTab === "accepted" && t("friends_empty_accepted")}
            </div>
          ) : (
            data.map((fs, i) => {
              const type = mapType(currentTab);
              const { first_name, last_name, avatar } = fs.other;
              const otherId = fs.other_id;
              return (
                <FriendCard
                  key={i}
                  name={`${first_name} ${last_name}`}
                  avatar={avatar || undefined}
                  friendshipType={type}
                  onAccept={() =>
                    type === "incoming" && acceptMut.mutate(otherId)
                  }
                  onRejectOrCancel={() => deleteMut.mutate(otherId)}
                  onWrite={() => type === "accepted" && chatMut.mutate(otherId)}
                />
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
