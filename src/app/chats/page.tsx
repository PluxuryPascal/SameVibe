"use client";
import React, { useEffect, useState } from "react";
import Header from "src/components/layout/Header";
import ChatSidebar, { Chat } from "src/features/chat/ui/ChatSidebar";
import ChatWindow from "src/features/chat/ui/ChatWindow";

export default function ChatsPage() {
  // Пример статического списка чатов
  const chats: Chat[] = [
    {
      id: 1,
      chatName: "Чат с Иваном",
      lastMessage: "Привет, как дела?",
      time: "10:15",
      messages: [
        { sender: "Иван", text: "Привет, как дела?", time: "10:15" },
        { sender: "Вы", text: "Отлично, спасибо!", time: "10:16" },
      ],
    },
    {
      id: 2,
      chatName: "Группа друзей",
      lastMessage: "Давайте встретимся сегодня.",
      time: "09:30",
      messages: [
        {
          sender: "Андрей",
          text: "Давайте встретимся сегодня.",
          time: "09:30",
        },
      ],
    },
    {
      id: 3,
      chatName: "Чат с Марией",
      lastMessage: "Увидимся на выходных",
      time: "Вчера",
      messages: [
        { sender: "Мария", text: "Увидимся на выходных", time: "Вчера" },
      ],
    },
    {
      id: 4,
      chatName: "Чат с коллегами",
      lastMessage: "Проект готов, отличная работа!",
      time: "Вчера",
      messages: [
        {
          sender: "Коллега",
          text: "Проект готов, отличная работа!",
          time: "Вчера",
        },
      ],
    },
  ];

  const [selectedChatId, setSelectedChatId] = useState(0);
  const selectedChat = chats.find((chat) => chat.id === selectedChatId);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setSelectedChatId(0);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <div className="h-screen bg-gray-100 flex flex-col">
      <Header />
      {/* Используем h-screen, чтобы область чата занимала всю высоту окна */}
      <div className="flex flex-1">
        <ChatSidebar
          chats={chats}
          selectedChatId={selectedChatId}
          onSelectChat={setSelectedChatId}
        />
        <div className="flex-1">
          {selectedChat ? (
            <ChatWindow chat={selectedChat} />
          ) : (
            <p className="p-4">Выберите чат для просмотра</p>
          )}
        </div>
      </div>
    </div>
  );
}
