import React from "react";

export default function ChatSidebar() {
  const chats = ["Чат 1", "Чат 2", "Чат 3", "Чат 4"];

  return (
    <aside className="w-1/4 border-r border-gray-200 p-4 flex flex-col">
      <div className="mb-4">
        <input
          type="text"
          placeholder="Поиск чатов..."
          className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring focus:border-blue-300"
        />
      </div>
      <ul className="flex-1 overflow-y-auto">
        {chats.map((chat, idx) => (
          <li
            key={idx}
            className="p-3 mb-2 rounded cursor-pointer hover:bg-blue-50 transition-colors"
          >
            {chat}
          </li>
        ))}
      </ul>
    </aside>
  );
}
