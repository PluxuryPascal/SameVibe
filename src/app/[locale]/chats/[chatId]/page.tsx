"use client";
import React from "react";
import { useRouter, useParams } from "next/navigation";
import Header from "src/components/layout/Header";
import ChatSidebar from "src/features/chat/ui/ChatSidebar";
import ChatWindow from "src/features/chat/ui/ChatWindow";
import { useTranslations } from "next-intl";

export default function ChatPage() {
  const params = useParams();
  const chatIdParam = params?.chatId;
  const chatId = chatIdParam ? parseInt(chatIdParam, 10) : null;
  const router = useRouter();
  const t = useTranslations("");

  // Если chatId некорректен, редирект обратно
  React.useEffect(() => {
    if (chatId === null) {
      router.push("/chats");
    }
  }, [chatId, router]);
  if (chatId === null) {
    return <div className="p-10 text-center">{t("chats_loading")}</div>;
  }

  return (
    <div className="h-screen flex flex-col bg-gray-100">
      <Header />
      <div className="flex flex-1">
        <ChatSidebar
          selectedId={chatId}
          onSelect={(id) => router.push(`/chats/${id}`)}
        />
        <div className="flex-1">
          {chatId != null ? (
            <ChatWindow chatId={chatId} />
          ) : (
            <div className="p-4">{t("chats_loading")}</div>
          )}
        </div>
      </div>
    </div>
  );
}
