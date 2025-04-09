"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { useQuery, useMutation } from "@tanstack/react-query";
import Header from "src/components/layout/Header";
import FriendCard from "src/features/friends/ui/FriendCard";
import Button from "src/components/ui/Button";
import api from "src/shared/lib/axios";

// Определяем тип данных, получаемых с сервера (сериализатор FriendshipSerializer)
interface FriendshipData {
  from_user: number;
  to_user: number;
  status: "accepted" | "sended";
  // Можно добавить дополнительные поля, если сервер возвращает имя, аватар и т.д.
}

export default function FriendsPage() {
  const router = useRouter();
  // Предполагается, что текущий пользователь сохранён в localStorage после авторизации
  const currentUserId = Number(localStorage.getItem("currentUserId"));

  // Получение списка записей дружбы для текущего пользователя
  const {
    data: friendships = [],
    isLoading,
    error,
  } = useQuery<FriendshipData[]>({
    queryKey: ["friendships"],
    queryFn: async () => {
      const token = localStorage.getItem("accessToken");
      const res = await api.get("/friends/friendshiplist/", {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data;
    },
    refetchOnWindowFocus: false,
  });

  // Разделяем записи дружбы на группы
  const incomingRequests = friendships.filter(
    (fs) => fs.status === "sended" && fs.from_user !== currentUserId,
  );
  const outgoingRequests = friendships.filter(
    (fs) => fs.status === "sended" && fs.from_user === currentUserId,
  );
  const acceptedFriends = friendships.filter((fs) => fs.status === "accepted");

  // Мутация для удаления дружбы, которая используется как для отклонения/отмены заявки, так и для удаления друга.
  const deleteMutation = useMutation({
    mutationFn: async (otherUserId: number) => {
      const token = localStorage.getItem("accessToken");
      return api.delete("/friends/friendship/", {
        headers: { Authorization: `Bearer ${token}` },
        data: { other_user_id: otherUserId },
      });
    },
    onSuccess: () => {
      router.refresh(); // Перезапросить данные после успешного удаления
    },
    onError: (err) => {
      console.error("Ошибка при удалении дружбы:", err);
    },
  });

  // Мутация для принятия входящей заявки
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
    },
    onError: (err) => {
      console.error("Ошибка при принятии заявки:", err);
    },
  });

  // Функция перехода в чат с другом
  const handleWriteMessage = (otherUserId: number) => {
    router.push(`/chats?friendId=${otherUserId}`);
  };

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

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <div className="max-w-2xl mx-auto py-10">
        <h2 className="text-3xl font-bold mb-6 text-center">Друзья</h2>

        {/* Раздел входящих заявок */}
        <div className="mb-8">
          <h3 className="text-2xl font-semibold mb-4">Входящие заявки</h3>
          {incomingRequests.length > 0 ? (
            incomingRequests.map((fs) => (
              <FriendCard
                key={`incoming-${fs.from_user}`}
                name={`Пользователь ${fs.from_user}`} // В идеале, подставлять имя, если оно доступно
                friendshipType="incoming"
                onAccept={() => acceptMutation.mutate(fs.from_user)}
                onRejectOrCancel={() => deleteMutation.mutate(fs.from_user)}
              />
            ))
          ) : (
            <div className="text-center font-bold">Входящих заявок нет</div>
          )}
        </div>

        {/* Раздел исходящих заявок */}
        <div className="mb-8">
          <h3 className="text-2xl font-semibold mb-4">Исходящие заявки</h3>
          {outgoingRequests.length > 0 ? (
            outgoingRequests.map((fs) => (
              <FriendCard
                key={`outgoing-${fs.to_user}`}
                name={`Пользователь ${fs.to_user}`}
                friendshipType="outgoing"
                onRejectOrCancel={() => deleteMutation.mutate(fs.to_user)}
              />
            ))
          ) : (
            <div className="text-center font-bold">Исходящих заявок нет</div>
          )}
        </div>

        {/* Раздел друзья */}
        <div className="mb-8">
          <h3 className="text-2xl font-semibold mb-4">Друзья</h3>
          {acceptedFriends.length > 0 ? (
            acceptedFriends.map((fs) => {
              // Определяем идентификатор другого пользователя
              const otherUserId =
                fs.from_user === currentUserId ? fs.to_user : fs.from_user;
              return (
                <FriendCard
                  key={`friend-${otherUserId}`}
                  name={`Пользователь ${otherUserId}`}
                  friendshipType="accepted"
                  onWrite={() => handleWriteMessage(otherUserId)}
                  onRejectOrCancel={() => deleteMutation.mutate(otherUserId)}
                />
              );
            })
          ) : (
            <div className="text-center font-bold">
              У вас пока нет друзей. Добавьте их, чтобы начать общаться!
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
