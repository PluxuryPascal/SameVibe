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
  const [ws, setWs] = useState<WebSocket | null>(null);

  // Получаем сообщения чата
  const { data: msgs = [] } = useQuery<Message[]>({
    queryKey: ["messages", chatId],
    queryFn: async () => {
      const res = await api.get(`/chat/chats/${chatId}/messages/`, {
        headers: authHeader(),
      });
      return res.data;
    },
  });

  // Устанавливаем WS-соединение с сервером (на нужном порту)
  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    const socket = new WebSocket(
      `ws://localhost:8000/ws/chat/${chatId}/?token=${token}`,
    );
    socket.onopen = () => {
      console.log("WS opened");
    };
    socket.onmessage = (evt) => {
      qc.invalidateQueries(["messages", chatId]);
    };
    setWs(socket);
    return () => {
      socket.close();
      setWs(null);
    };
  }, [chatId, qc]);

  // Автопрокрутка вниз при получении новых сообщений
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [msgs]);

  const [text, setText] = useState("");
  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim() || !ws || ws.readyState !== WebSocket.OPEN) {
      console.error("WebSocket не готов");
      return;
    }
    ws.send(JSON.stringify({ message: text }));
    setText("");
  };

  // Группировка сообщений по датам
  const groups: Record<string, Message[]> = {};
  msgs.forEach((m) => {
    // Группировка по локальной дате (например, "28.02.2025")
    const day = new Date(m.created_at).toLocaleDateString();
    groups[day] = groups[day] || [];
    groups[day].push(m);
  });

  const currentUserId = +localStorage.getItem("currentUserId")!;

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 p-4 overflow-auto">
        {Object.entries(groups).map(([day, messages]) => (
          <React.Fragment key={day}>
            <div className="text-center text-gray-500 my-2">{day}</div>
            {messages.map((m) => {
              const isMe = m.sender === currentUserId;
              return (
                <div
                  key={m.id}
                  className={`flex mb-2 ${isMe ? "justify-start" : "justify-end"}`}
                >
                  <div
                    className={`p-2 rounded-lg max-w-xs ${
                      isMe ? "bg-blue-200" : "bg-gray-200"
                    }`}
                  >
                    <strong>
                      {isMe
                        ? "Вы: "
                        : `${m.sender_info.first_name} ${m.sender_info.last_name}: `}
                    </strong>
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
          </React.Fragment>
        ))}
        <div ref={bottomRef} />
      </div>
      <form onSubmit={handleSend} className="flex border-t p-4 bg-white">
        <input
          type="text"
          placeholder="Введите сообщение..."
          className="flex-1 p-2 border rounded-l focus:outline-none focus:ring focus:border-blue-300"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <button
          type="submit"
          className="px-4 bg-blue-500 text-white rounded-r hover:bg-blue-600 transition-colors"
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
