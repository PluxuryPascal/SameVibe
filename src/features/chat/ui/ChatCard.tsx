import React from "react";
import Image from "next/image";

interface ChatCardProps {
  chatName: string;
  lastMessage: string;
  time: string;
  avatar?: string;
}

export default function ChatCard({
  chatName,
  lastMessage,
  time,
  avatar,
}: ChatCardProps) {
  return (
    <div className="flex items-center p-4 bg-white rounded shadow mb-4 cursor-pointer hover:bg-gray-50 transition-colors">
      <div className="relative w-16 h-16">
        <Image
          src={avatar || "/assets/profile-placeholder.png"}
          alt={chatName}
          width={64}
          height={64}
          className="rounded-full"
        />
      </div>
      <div className="ml-4 flex-1">
        <h3 className="text-xl font-semibold">{chatName}</h3>
        <p className="text-gray-600 truncate">{lastMessage}</p>
      </div>
      <div>
        <p className="text-gray-500 text-sm">{time}</p>
      </div>
    </div>
  );
}
