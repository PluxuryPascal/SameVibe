import React from "react";

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
        <form className="flex items-center">
          <input
            type="text"
            placeholder="Введите сообщение..."
            className="flex-1 p-3 border border-gray-300 rounded-l focus:outline-none focus:ring focus:border-blue-300"
          />
          <button
            type="submit"
            className="bg-blue-500 text-white p-3 rounded-r hover:bg-blue-600 transition-colors"
          >
            Отправить
          </button>
        </form>
      </div>
    </div>
  );
}
