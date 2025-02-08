"use client";
import React from "react";
import Header from "src/components/layout/Header";
import ChatCard from "src/features/chat/ui/ChatCard";

export default function ChatsPage() {
  // Пример статического списка чатов. В реальном приложении данные будут подгружаться через API или бизнес-логику.
  const chats = [
    {
      chatName: "Чат с Иваном",
      lastMessage: "Привет, как дела?",
      time: "10:15",
    },
    {
      chatName: "Группа друзей",
      lastMessage: "Давайте встретимся сегодня.",
      time: "09:30",
    },
    {
      chatName: "Чат с Марией",
      lastMessage: "Увидимся на выходных",
      time: "Вчера",
    },
    {
      chatName: "Чат с коллегами",
      lastMessage: "Проект готов, отличная работа!",
      time: "Вчера",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Общий Header */}
      <Header />
      {/* Основной контент */}
      <div className="max-w-2xl mx-auto py-10">
        <h2 className="text-3xl font-bold mb-6 text-center">Чаты</h2>
        {chats.map((chat, idx) => (
          <ChatCard
            key={idx}
            chatName={chat.chatName}
            lastMessage={chat.lastMessage}
            time={chat.time}
          />
        ))}
      </div>
    </div>
  );
}
