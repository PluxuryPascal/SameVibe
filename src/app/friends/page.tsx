"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Header from "src/components/layout/Header";
import FriendCard, { Friend } from "src/features/friends/ui/FriendCard";

export default function FriendsPage() {
  const router = useRouter();
  // Статический список друзей для тестирования.
  const [friends, setFriends] = useState<Friend[]>([
    {
      id: 1,
      name: "Иван Иванов",
      status: "online",
      //avatar: "https://example.com/avatars/ivan.jpg",
    },
    {
      id: 2,
      name: "Мария Петрова",
      status: "offline",
      //avatar: "https://example.com/avatars/maria.jpg",
    },
    {
      id: 3,
      name: "Алексей Сидоров",
      status: "online",
      //avatar: "https://example.com/avatars/alexey.jpg",
    },
    {
      id: 4,
      name: "Екатерина Смирнова",
      status: "offline",
      //avatar: "https://example.com/avatars/ekaterina.jpg",
    },
  ]);

  // TODO: Получение списка друзей с сервера
  /*
  useEffect(() => {
    async function fetchFriends() {
      try {
        const res = await fetch("/api/friends/");
        if (!res.ok) {
          throw new Error("Ошибка получения списка друзей");
        }
        const data = await res.json();
        setFriends(data);
      } catch (error) {
        console.error(error);
      }
    }
    fetchFriends();
  }, []);
  */

  // Функция удаления друга
  const handleDeleteFriend = async (friendId: number) => {
    try {
      // TODO: Отправка запроса на сервер для удаления друга
      /*
      const res = await fetch(`/api/friends/${friendId}/`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          // "Authorization": `Bearer ${accessToken}`,
        },
      });
      if (!res.ok) {
        throw new Error("Ошибка удаления друга");
      }
      */
      console.log("Удаляем друга с id:", friendId);
      // Обновляем состояние: убираем удалённого друга из списка
      setFriends((prev) => prev.filter((friend) => friend.id !== friendId));
    } catch (error) {
      console.error("Ошибка при удалении друга:", error);
    }
  };

  // Функция перехода в чат с другом
  const handleWriteMessage = (friendId: number) => {
    // Перенаправляем на страницу чата с параметром friendId
    router.push(`/chats?friendId=${friendId}`);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <div className="max-w-2xl mx-auto py-10">
        <h2 className="text-3xl font-bold mb-6 text-center">Друзья</h2>
        {friends.length > 0 ? (
          friends.map((friend) => (
            <FriendCard
              key={friend.id}
              name={friend.name}
              status={friend.status}
              avatar={friend.avatar}
              onDelete={() => handleDeleteFriend(friend.id)}
              onWrite={() => handleWriteMessage(friend.id)}
            />
          ))
        ) : (
          <div className="font-bold mt-10 text-center">У вас нет друзей</div>
        )}
      </div>
    </div>
  );
}
