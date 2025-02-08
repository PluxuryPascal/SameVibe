"use client";
import React from "react";
import Header from "src/components/layout/Header";
import FriendCard from "src/features/friends/ui/FriendCard";

export default function FriendsPage() {
  // Пример статического списка друзей; в реальном приложении данные будут получаться через API или бизнес-логику
  const friends = [
    { name: "Иван Иванов", status: "online" },
    { name: "Мария Петрова", status: "offline" },
    { name: "Алексей Сидоров", status: "online" },
    { name: "Екатерина Смирнова", status: "offline" },
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Композиция: общий Header */}
      <Header />
      <div className="max-w-2xl mx-auto py-10">
        <h2 className="text-3xl font-bold mb-6 text-center">Друзья</h2>
        {friends.map((friend, idx) => (
          <FriendCard
            key={idx}
            name={friend.name}
            status={friend.status as "online" | "offline"}
          />
        ))}
      </div>
    </div>
  );
}
