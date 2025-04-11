"use client";
import React, { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import api from "src/shared/lib/axios";
import ChatCard from "./ChatCard";
import { useWebSocket } from "src/shared/lib/useWebSocket";

export interface ChatInfo {
  id: number;
  other_user: {
    id: number;
    first_name: string;
    last_name: string;
    avatar: string | null;
  };
  last_message: string;
  last_time: string | null;
}

interface Props {
  selectedId: number | null;
  onSelect: (id: number) => void;
}

export default function ChatSidebar({ selectedId, onSelect }: Props) {
  const qc = useQueryClient();
  const { data: chats = [] } = useQuery<ChatInfo[]>({
    queryKey: ["chats"],
    queryFn: async () => {
      const res = await api.get("/chat/chats/", { headers: authHeader() });
      return res.data;
    },
  });

  useWebSocket(
    `ws://localhost:8000/ws/chat-list/?token=${localStorage.getItem("accessToken")}`,
    () => qc.invalidateQueries(["chats"]),
  );

  const [search, setSearch] = useState("");
  const filtered = chats.filter((c) =>
    `${c.other_user.first_name} ${c.other_user.last_name}`
      .toLowerCase()
      .includes(search.toLowerCase()),
  );

  return (
    <aside className="w-1/4 border-r p-4 flex flex-col">
      <input
        type="text"
        placeholder="Поиск чатов..."
        className="mb-4 p-2 border rounded"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <ul className="flex-1 overflow-auto">
        {filtered.map((c) => {
          const dt = c.last_time ? new Date(c.last_time) : null;
          const timeLabel = dt ? formatChatTime(dt) : "";
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
  return { Authorization: `Bearer ${token}` };
}

function formatChatTime(d: Date) {
  const now = new Date();
  // Если сообщение отправлено сегодня: HH:MM
  if (
    d.getDate() === now.getDate() &&
    d.getMonth() === now.getMonth() &&
    d.getFullYear() === now.getFullYear()
  ) {
    return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  }
  // Если вчера: "Вчера"
  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);
  if (
    d.getDate() === yesterday.getDate() &&
    d.getMonth() === yesterday.getMonth() &&
    d.getFullYear() === yesterday.getFullYear()
  ) {
    return "Вчера";
  }
  // Иначе: формат "MM.DD" (месяц и число, разделённые точкой)
  const month = (d.getMonth() + 1).toString().padStart(2, "0");
  const day = d.getDate().toString().padStart(2, "0");
  return `${month}.${day}`;
}
