import React, { useState } from "react";
import ChatCard from "./ChatCard";

export interface Chat {
  id: number;
  chatName: string;
  lastMessage: string;
  time: string;
  messages: { sender: string; text: string; time: string }[];
}

interface ChatSidebarProps {
  chats: Chat[];
  selectedChatId: number;
  onSelectChat: (chatId: number) => void;
}

export default function ChatSidebar({
  chats = [],
  selectedChatId,
  onSelectChat,
}: ChatSidebarProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredChats = chats.filter((chat) =>
    chat.chatName.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <aside className="w-1/4 border-r border-gray-200 p-4 flex flex-col">
      <div className="mb-4">
        <input
          type="text"
          placeholder="Поиск чатов..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring focus:border-blue-300"
        />
      </div>
      <ul className="flex-1 overflow-y-auto">
        {filteredChats.map((chat) => (
          <li
            key={chat.id}
            onClick={() => onSelectChat(chat.id)}
            className={`cursor-pointer rounded p-1 ${
              selectedChatId === chat.id ? "bg-blue-100" : ""
            }`}
          >
            <ChatCard
              chatName={chat.chatName}
              lastMessage={chat.lastMessage}
              time={chat.time}
            />
          </li>
        ))}
      </ul>
    </aside>
  );
}
