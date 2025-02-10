import React, { useState } from "react";

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
  chat: Chat | undefined;
}

export default function ChatWindow({ chat }: ChatWindowProps) {
  const [newMessage, setNewMessage] = useState("");
  const [attachedFile, setAttachedFile] = useState<File | null>(null);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    // Здесь можно добавить логику отправки сообщения
    console.log("Sending message:", newMessage, attachedFile);
    setNewMessage("");
    setAttachedFile(null);
  };
  if (!chat) {
    return <div className="p-4">Выберите чат для просмотра</div>;
  }
  return (
    <div className="flex flex-col h-full">
      {/* Заголовок чата */}
      <div className="border-b border-gray-200 p-4">
        <h2 className="text-2xl font-bold">{chat.chatName}</h2>
      </div>
      {/* Область сообщений */}
      <div className="flex-1 p-4 overflow-y-auto space-y-4">
        {chat.messages.map((msg, idx) => (
          <div key={idx} className="mb-2">
            <p className="text-gray-800">
              <strong>{msg.sender}:</strong> {msg.text}
            </p>
            <p className="text-xs text-gray-500">{msg.time}</p>
          </div>
        ))}
      </div>
      {/* Форма ввода сообщения */}
      <div className="border-t border-gray-200 p-4">
        <form onSubmit={handleSend} className="flex items-center space-x-2">
          <input
            type="text"
            placeholder="Введите сообщение..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            className="flex-1 p-2 border border-gray-300 rounded"
          />
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
            className="cursor-pointer px-3 py-2 bg-gray-200 rounded"
          >
            Прикрепить
          </label>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white rounded"
          >
            Отправить
          </button>
        </form>
      </div>
    </div>
  );
}
