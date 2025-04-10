"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Header from "src/components/layout/Header";
import FriendsTabs, { FriendsTab } from "src/features/friends/ui/FriendsTabs";
import FriendCard from "src/features/friends/ui/FriendCard";
import api from "src/shared/lib/axios";

interface FriendshipData {
  from_user: number;
  to_user: number;
  status: "accepted" | "sended";
  // можно добавить поля name, avatar, если сервер отдаёт
}

export default function FriendsPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const currentUserId = Number(localStorage.getItem("currentUserId"));
  const [currentTab, setCurrentTab] = useState<FriendsTab>("accepted");

  const {
    data = [],
    isLoading,
    error,
  } = useQuery<FriendshipData[]>({
    queryKey: ["friendships", currentTab],
    queryFn: async () => {
      const token = localStorage.getItem("accessToken");
      const res = await api.get("/friends/friendshiplist/", {
        headers: { Authorization: `Bearer ${token}` },
        params: { cat: currentTab },
      });
      return res.data as FriendshipData[];
    },
    keepPreviousData: true,
  });

  const deleteMutation = useMutation({
    mutationFn: async (otherUserId: number) => {
      const token = localStorage.getItem("accessToken");
      return api.delete("/friends/friendship/", {
        headers: { Authorization: `Bearer ${token}` },
        data: { other_user_id: otherUserId },
      });
    },
    onSuccess: () => {
      router.refresh();
      queryClient.invalidateQueries(["friendships", currentTab]);
    },
  });

  const acceptMutation = useMutation({
    mutationFn: async (otherUserId: number) => {
      const token = localStorage.getItem("accessToken");
      return api.patch(
        "/friends/friendship/",
        { other_user_id: otherUserId },
        { headers: { Authorization: `Bearer ${token}` } },
      );
    },
    onSuccess: () => {
      router.refresh();
      queryClient.invalidateQueries(["friendships", currentTab]);
    },
  });

  const handleWrite = (otherId: number) =>
    router.push(`/chats?friendId=${otherId}`);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Загрузка...
      </div>
    );
  }
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500">
        Ошибка загрузки данных
      </div>
    );
  }

  // Преобразуем currentTab в friendshipType
  const mapType = (tab: FriendsTab): "incoming" | "outgoing" | "accepted" => {
    if (tab === "received") return "incoming";
    if (tab === "sended") return "outgoing";
    return "accepted";
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <div className="max-w-2xl mx-auto py-10">
        <h2 className="text-3xl font-bold mb-6 text-center">Друзья</h2>

        <FriendsTabs current={currentTab} onChange={setCurrentTab} />

        <div className="bg-white p-4 rounded-b-xl shadow">
          {data.length === 0 ? (
            <div className="text-center py-6 font-bold">
              {currentTab === "received" && "Входящих заявок нет"}
              {currentTab === "sended" && "Исходящих заявок нет"}
              {currentTab === "accepted" && "Друзей нет"}
            </div>
          ) : (
            data.map((fs) => {
              // определяем id другого пользователя
              const otherId =
                currentTab === "sended"
                  ? fs.to_user
                  : fs.from_user === currentUserId
                    ? fs.to_user
                    : fs.from_user;

              const type = mapType(currentTab);

              return (
                <FriendCard
                  key={`${currentTab}-${otherId}`}
                  name={`Пользователь ${otherId}`}
                  friendshipType={type}
                  onAccept={() =>
                    type === "incoming" && acceptMutation.mutate(otherId)
                  }
                  onRejectOrCancel={() => deleteMutation.mutate(otherId)}
                  onWrite={() => type === "accepted" && handleWrite(otherId)}
                />
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
