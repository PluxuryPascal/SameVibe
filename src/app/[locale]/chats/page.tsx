"use client";
import { useTranslations } from "next-intl";
import React, { useState } from "react";
import Header from "src/components/layout/Header";
import ChatSidebar from "src/features/chat/ui/ChatSidebar";
import ChatWindow from "src/features/chat/ui/ChatWindow";

export default function ChatsPage() {
  const [chatId, setChatId] = useState<number | null>(null);
  const t = useTranslations("");

  return (
    <div className="h-screen flex flex-col bg-gray-100">
      <Header />
      <div className="flex flex-1">
        <ChatSidebar selectedId={chatId} onSelect={setChatId} />
        <div className="flex-1">
          {chatId != null ? (
            <ChatWindow chatId={chatId} />
          ) : (
            <div className="p-4">{t("chats_empty")}</div>
          )}
        </div>
      </div>
    </div>
  );
}
