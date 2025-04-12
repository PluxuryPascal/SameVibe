"use client";
import React, { useState, useEffect, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "src/shared/lib/axios";
import clsx from "clsx";

// Интерфейс сообщения
interface Message {
  id: number;
  text: string;
  sender: number;
  created_at: string;
  sender_info: { first_name: string; last_name: string; avatar: string | null };
}

interface ChatWindowProps {
  chatId: number;
}

export default function ChatWindow({ chatId }: ChatWindowProps) {
  const qc = useQueryClient();
  const bottomRef = useRef<HTMLDivElement>(null);

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

  // Мутация редактирования сообщения
  const editMut = useMutation({
    mutationFn: async ({ id, text }: { id: number; text: string }) =>
      api.patch(`/chat/messages/${id}/`, { text }, { headers: authHeader() }),
    onSuccess: () => qc.invalidateQueries(["messages", chatId]),
  });

  // Устанавливаем WebSocket-соединение один раз при изменении chatId
  const [ws, setWs] = useState<WebSocket | null>(null);
  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (!token) return;
    const socket = new WebSocket(
      `ws://localhost:8000/ws/chat/${chatId}/?token=${token}`,
    );
    socket.onopen = () => console.log("WS opened");
    socket.onmessage = (evt) => {
      // При получении сообщения обновляем список через invalidate
      qc.invalidateQueries(["messages", chatId]);
    };
    setWs(socket);
    return () => {
      socket.close();
      setWs(null);
    };
  }, [chatId, qc]);

  // Автопрокрутка при изменении сообщений
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [msgs]);

  // Локальное состояние для отправки сообщения и редактирования
  const [text, setText] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editText, setEditText] = useState("");
  const currentUserId = +localStorage.getItem("currentUserId")!;

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim() || !ws || ws.readyState !== WebSocket.OPEN) {
      console.error("WebSocket не готов");
      return;
    }
    ws.send(JSON.stringify({ message: text }));
    setText("");
  };

  // Группировка сообщений по датам с Today/Yesterday
  const groups: Record<string, Message[]> = {};
  const now = new Date();
  msgs.forEach((m) => {
    const d = new Date(m.created_at);
    let label: string;
    if (
      d.getDate() === now.getDate() &&
      d.getMonth() === now.getMonth() &&
      d.getFullYear() === now.getFullYear()
    ) {
      label = "Сегодня";
    } else {
      const yesterday = new Date(now);
      yesterday.setDate(now.getDate() - 1);
      if (
        d.getDate() === yesterday.getDate() &&
        d.getMonth() === yesterday.getMonth() &&
        d.getFullYear() === yesterday.getFullYear()
      ) {
        label = "Вчера";
      } else {
        label = d.toLocaleDateString();
      }
    }
    groups[label] = groups[label] ? [...groups[label], m] : [m];
  });

  return (
    <div className="flex flex-col h-full">
      {/* Блок сообщений с фиксированной высотой и локальной вертикальной прокруткой */}
      <div
        className="flex-1 p-4 overflow-y-auto"
        style={{ maxHeight: "calc(100vh - 200px)" }}
      >
        {Object.entries(groups).map(([day, messages]) => (
          <React.Fragment key={day}>
            <div className="text-center text-gray-500 my-2">{day}</div>
            {messages.map((m) => {
              const isMe = m.sender === currentUserId;
              const isEditing = editingId === m.id;
              return (
                <div
                  key={m.id}
                  className={`flex mb-2 ${
                    isMe ? "justify-start" : "justify-end"
                  }`}
                >
                  <div
                    className={`p-2 rounded-lg max-w-xs break-words ${
                      isMe ? "bg-blue-200" : "bg-gray-200"
                    }`}
                  >
                    {/* Верхняя строка: имя (или "Вы") и кнопка редактирования */}
                    <div className="flex items-center justify-between gap-x-4">
                      <span className="font-semibold">
                        {isMe
                          ? "Вы"
                          : `${m.sender_info.first_name} ${m.sender_info.last_name}`}
                      </span>
                      {isMe && !isEditing && (
                        <button
                          className="text-xs text-gray-600"
                          onClick={() => {
                            setEditingId(m.id);
                            setEditText(m.text);
                          }}
                        >
                          ✎
                        </button>
                      )}
                    </div>
                    {/* Основной текст сообщения с оборачиванием */}
                    {isEditing ? (
                      <>
                        <textarea
                          className="w-full p-1 border rounded mt-1 resize-none whitespace-normal break-words"
                          value={editText}
                          onChange={(e) => setEditText(e.target.value)}
                        />
                        <button
                          className="mt-1 text-sm text-blue-600"
                          onClick={() => {
                            editMut.mutate({ id: m.id, text: editText });
                            setEditingId(null);
                          }}
                        >
                          Сохранить
                        </button>
                      </>
                    ) : (
                      <div className="mt-1 whitespace-normal break-words">
                        {m.text}
                      </div>
                    )}
                    {/* Нижняя строка: время отправки и (если редактируется) кнопка редактирования уже выведена */}
                    <div className="flex items-center justify-end mt-1">
                      <div className="text-xs text-gray-500">
                        {new Date(m.created_at).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </React.Fragment>
        ))}
        <div ref={bottomRef} />
      </div>
      {/* Форма отправки сообщения */}
      <form onSubmit={handleSend} className="flex border-t p-4 bg-white">
        <textarea
          className="flex-1 p-2 border rounded-l focus:outline-none focus:ring focus:border-blue-300 resize-none"
          rows={1}
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Введите сообщение..."
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
  return { Authorization: token ? `Bearer ${token}` : "" };
}
