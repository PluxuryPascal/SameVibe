"use client";
import React, { useState, useEffect } from "react";

interface Message {
  sender: string;
  text: string;
  time: string;
}

interface Chat {
  id: number;
  chatName: string;
  messages: Message[];
}

interface ChatWindowProps {
  chat: Chat;
}

export default function ChatWindow({ chat }: ChatWindowProps) {
  const [newMessage, setNewMessage] = useState("");
  const [attachedFile, setAttachedFile] = useState<File | null>(null);

  // TODO: Реализовать подключение к WebSocket для получения сообщений в режиме реального времени
  /*
  useEffect(() => {
    const socket = new WebSocket("ws://yourserver/ws/chats/" + chat.id + "/");
    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      // Обновите состояние сообщений, например, добавив новое сообщение:
      // setMessages(prev => [...prev, data.message]);
    };
    return () => socket.close();
  }, [chat.id]);
  */

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();

    // TODO: Отправить сообщение на сервер через WebSocket или fetch
    /*
    const payload = { chatId: chat.id, text: newMessage, attachedFile };
    // Если используете WebSocket:
    socket.send(JSON.stringify(payload));
    // Или отправка через fetch:
    await fetch(`/api/chats/${chat.id}/send/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    */
    console.log("Sending message:", newMessage, attachedFile);
    setNewMessage("");
    setAttachedFile(null);
  };

  return (
    <div className="flex flex-col h-full">
      {/* Заголовок чата */}
      <div className="border-b border-gray-200 p-4">
        <h2 className="text-2xl font-bold">{chat.chatName}</h2>
      </div>
      {/* Область сообщений */}
      <div className="flex-1 p-4 overflow-y-auto space-y-4">
        {chat.messages.map((msg, idx) => (
          <div
            key={idx}
            className={`mb-2 flex ${
              msg.sender === "Вы" ? "justify-end" : "justify-start"
            }`}
          >
            <div className="max-w-xs p-2 rounded-lg bg-gray-100">
              <p className="text-gray-800">
                {msg.sender !== "Вы" && <strong>{msg.sender}: </strong>}
                {msg.text}
              </p>
              <p className="text-xs text-gray-500 text-right">{msg.time}</p>
            </div>
          </div>
        ))}
      </div>
      {/* Форма ввода сообщения */}
      <div className="border-t border-gray-200 p-4">
        <form onSubmit={handleSend} className="flex items-center">
          <input
            type="text"
            placeholder="Введите сообщение..."
            className="flex-1 p-3 border border-gray-300 rounded-l focus:outline-none focus:ring focus:border-blue-300"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
          />
          <button
            type="submit"
            className="bg-blue-500 text-white p-3 rounded-r hover:bg-blue-600 transition-colors"
          >
            Отправить
          </button>
          <input
            type="file"
            onChange={(e) => {
              if (e.target.files && e.target.files[0]) {
                setAttachedFile(e.target.files[0]);
              }
            }}
            className="hidden"
            id="fileInput"
          />
          <label
            htmlFor="fileInput"
            className="cursor-pointer p-3 ml-2 mr-2 bg-gray-200 rounded-r hover:bg-gray-300"
          >
            Прикрепить
          </label>
        </form>
      </div>
    </div>
  );
}
