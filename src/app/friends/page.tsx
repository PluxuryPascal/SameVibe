"use client";
import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import api from "src/shared/lib/axios";
import Header from "src/components/layout/Header";
import FriendsTabs, { FriendsTab } from "src/features/friends/ui/FriendsTabs";
import FriendCard from "src/features/friends/ui/FriendCard";

interface FriendInfo {
  first_name: string;
  last_name: string;
  avatar: string | null;
}
interface FriendshipData {
  status: "accepted" | "sended";
  other: FriendInfo;
}

export default function FriendsPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [tab, setTab] = useState<FriendsTab>("accepted");

  // 1) Запрос списка по tab
  const { data, isLoading, error } = useQuery<FriendshipData[]>({
    queryKey: ["friendships", tab],
    queryFn: async () => {
      const token = localStorage.getItem("accessToken");
      const res = await api.get("/friends/friendshiplist/", {
        headers: { Authorization: `Bearer ${token}` },
        params: { cat: tab },
      });
      return res.data;
    },
    keepPreviousData: true,
  });

  // 2) Мутации
  const deleteMut = useMutation({
    mutationFn: async (otherId: number) => {
      const token = localStorage.getItem("accessToken");
      return api.delete("/friends/friendship/", {
        headers: { Authorization: `Bearer ${token}` },
        data: { other_user_id: otherId },
      });
    },
    onSuccess: () => queryClient.invalidateQueries(["friendships", tab]),
  });

  const acceptMut = useMutation({
    mutationFn: async (otherId: number) => {
      const token = localStorage.getItem("accessToken");
      return api.patch(
        "/friends/friendship/",
        { other_user_id: otherId },
        { headers: { Authorization: `Bearer ${token}` } },
      );
    },
    onSuccess: () => queryClient.invalidateQueries(["friendships", tab]),
  });

  const handleWrite = () => {
    // пока просто логика перехода
    router.push("/chats");
  };

  if (isLoading) return <div className="p-10 text-center">Загрузка...</div>;
  if (error)
    return <div className="p-10 text-center text-red-500">Ошибка загрузки</div>;

  // 3) Преобразуем таб в тип для карточки
  const mapType = (t: FriendsTab) =>
    t === "received" ? "incoming" : t === "sended" ? "outgoing" : "accepted";

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <div className="max-w-2xl mx-auto py-10 px-4">
        <h2 className="text-3xl font-bold mb-6 text-center">Друзья</h2>

        <FriendsTabs current={tab} onChange={setTab} />

        <div className="bg-white p-4 rounded-b-xl shadow">
          {data.length === 0 ? (
            <div className="text-center py-6 font-bold">
              {tab === "received" && "Входящих заявок нет"}
              {tab === "sended" && "Исходящих заявок нет"}
              {tab === "accepted" && "Друзей нет"}
            </div>
          ) : (
            data.map((fs, i) => {
              const type = mapType(tab);
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
                  onWrite={() => type === "accepted" && handleWrite()}
                />
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
