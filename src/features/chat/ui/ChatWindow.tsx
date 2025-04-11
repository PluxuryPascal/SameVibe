"use client";
import React, { useState, useEffect, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "src/shared/lib/axios";
import { useWebSocket } from "src/shared/lib/useWebSocket";

interface Message {
  id: number;
  text: string;
  sender: number;
  created_at: string;
  sender_info: { first_name: string; last_name: string; avatar: string | null };
}

interface Props {
  chatId: number;
}

export default function ChatWindow({ chatId }: Props) {
  const qc = useQueryClient();
  const bottomRef = useRef<HTMLDivElement>(null);

  const { data: msgs = [] } = useQuery<Message[]>({
    queryKey: ["messages", chatId],
    queryFn: async () => {
      const res = await api.get(`/chats/${chatId}/contents/`, {
        headers: authHeader(),
      });
      return res.data;
    },
  });

  const sendMut = useMutation({
    mutationFn: (text: string) =>
      api.post(
        `/chats/${chatId}/contents/`,
        { text },
        { headers: authHeader() },
      ),
    onSuccess: () => {
      // не нужно вручную invalidation, т.к. WebSocket пришлёт сообщение
      qc.invalidateQueries(["messages", chatId]);
    },
  });

  useWebSocket(
    `ws://${location.host.replace(/^http/, "ws")}/ws/chat/${chatId}/`,
    () => qc.invalidateQueries(["messages", chatId]),
  );

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [msgs]);

  const [text, setText] = useState("");
  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;
    sendMut.mutate(text);
    setText("");
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 p-4 overflow-auto">
        {msgs.map((m) => {
          const isMe = m.sender === +localStorage.getItem("currentUserId")!;
          return (
            <div
              key={m.id}
              className={`flex mb-2 ${isMe ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`p-2 rounded-lg max-w-xs ${
                  isMe ? "bg-blue-200" : "bg-gray-200"
                }`}
              >
                {!isMe && (
                  <strong>
                    {m.sender_info.first_name} {m.sender_info.last_name}:{" "}
                  </strong>
                )}
                {m.text}
                <div className="text-xs text-gray-500 text-right">
                  {new Date(m.created_at).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </div>
              </div>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>
      <form onSubmit={handleSend} className="flex border-t p-4 bg-white">
        <input
          className="flex-1 p-2 border rounded-l focus:outline-none"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Введите сообщение..."
        />
        <button
          type="submit"
          className="px-4 bg-blue-500 text-white rounded-r hover:bg-blue-600"
        >
          Отправить
        </button>
      </form>
    </div>
  );
}

function authHeader() {
  const token = localStorage.getItem("accessToken");
  return { Authorization: `Bearer ${token}` };
}
