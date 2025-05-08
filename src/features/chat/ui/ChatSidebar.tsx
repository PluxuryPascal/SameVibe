"use client";
import React, { useState, useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import api from "src/shared/lib/axios";
import ChatCard from "./ChatCard";
import { useWebSocket } from "src/shared/lib/useWebSocket";
import { useTranslations } from "next-intl";

export interface ChatInfo {
  id: number;
  other_user: {
    id: number;
    first_name: string;
    last_name: string;
    avatar: string | null;
  };
  last_message: string;
  last_message_sender_id: number;
  last_time: string | null;
}

interface ChatSidebarProps {
  selectedId: number | null;
  onSelect: (id: number) => void;
}

export default function ChatSidebar({
  selectedId,
  onSelect,
}: ChatSidebarProps) {
  const qc = useQueryClient();
  const t = useTranslations("");

  // Загрузка текущего userId из localStorage
  const [currentUserId, setCurrentUserId] = useState<number | null>(null);
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedId = localStorage.getItem("currentUserId");
      if (storedId) {
        setCurrentUserId(Number(storedId));
      }
    }
  }, []);

  const { data: chats = [] } = useQuery<ChatInfo[]>({
    queryKey: ["chats"],
    queryFn: async () => {
      const res = await api.get("/chat/chats/", { headers: authHeader() });
      return res.data;
    },
  });

  const [wsUrl, setWsUrl] = useState<string | null>(null);
  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      setWsUrl(`ws://localhost:8000/ws/chat-list/?token=${token}`);
    }
  }, []);

  useWebSocket(wsUrl, () => qc.invalidateQueries(["chats"]), {
    enabled: !!wsUrl,
  });

  const [search, setSearch] = useState("");
  const filtered = chats.filter((c) =>
    `${c.other_user.first_name} ${c.other_user.last_name}`
      .toLowerCase()
      .includes(search.toLowerCase()),
  );

  // Если currentUserId ещё не загружен, показываем индикатор загрузки
  if (currentUserId === null) {
    return <div className="p-4 text-center">{t("chats_loading")}</div>;
  }

  return (
    <aside
      className="w-1/4 border-r p-4 flex flex-col"
      style={{ maxHeight: "calc(100vh - 100px)" }}
    >
      <input
        type="text"
        placeholder={t("chat_search_placeholder")}
        className="mb-4 p-2 border rounded"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <ul className="flex-1 overflow-y-auto">
        {filtered.map((c) => {
          const dt = c.last_time ? new Date(c.last_time) : null;
          const timeLabel = dt ? formatChatTime(dt) : "";
          // Если отправитель последнего сообщения равен currentUserId, то это текущее сообщение,
          // иначе - сообщение от другого пользователя.
          const isOther = c.last_message_sender_id !== currentUserId;
          return (
            <li
              key={c.id}
              onClick={() => onSelect(c.id)}
              className={`mb-2 p-2 rounded cursor-pointer ${
                c.id === selectedId ? "bg-blue-100" : ""
              }`}
            >
              <ChatCard
                chatName={`${c.other_user.first_name} ${c.other_user.last_name}`}
                lastMessage={c.last_message}
                time={timeLabel}
                avatar={c.other_user.avatar || undefined}
                isOther={isOther}
              />
            </li>
          );
        })}
      </ul>
    </aside>
  );
}

function authHeader() {
  const token = localStorage.getItem("accessToken");
  return { Authorization: token ? `Bearer ${token}` : "" };
}

function formatChatTime(d: Date) {
  const now = new Date();
  if (
    d.getDate() === now.getDate() &&
    d.getMonth() === now.getMonth() &&
    d.getFullYear() === now.getFullYear()
  ) {
    return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  }
  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);
  if (
    d.getDate() === yesterday.getDate() &&
    d.getMonth() === yesterday.getMonth() &&
    d.getFullYear() === yesterday.getFullYear()
  ) {
    return "Вчера";
  }
  const mo = (d.getMonth() + 1).toString().padStart(2, "0");
  const da = d.getDate().toString().padStart(2, "0");
  return `${mo}.${da}`;
}
