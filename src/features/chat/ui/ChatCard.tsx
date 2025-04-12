"use client";
import React from "react";
import Image from "next/image";

interface ChatCardProps {
  chatName: string;
  lastMessage: string;
  time: string;
  avatar?: string;
  isOther?: boolean;
}

export default function ChatCard({
  chatName,
  lastMessage,
  time,
  avatar,
  isOther = false,
}: ChatCardProps) {
  return (
    <div className="flex items-center p-4 bg-white rounded shadow hover:bg-gray-50 transition-colors">
      <div className="relative w-12 h-12 flex-shrink-0">
        <Image
          src={avatar || "/assets/profile-placeholder.png"}
          alt={chatName}
          width={48}
          height={48}
          className="rounded-full"
        />
      </div>
      <div className="ml-4 flex-1 overflow-hidden">
        <h3 className="text-lg font-semibold truncate">{chatName}</h3>
        <p
          className={`truncate ${isOther ? "text-blue-600" : "text-gray-600"}`}
        >
          {isOther ? `${chatName}: ` : "Вы: "}
          {lastMessage}
        </p>
      </div>
      <div className="flex-shrink-0 w-16 text-right">
        <p className="text-gray-500 text-sm">{time}</p>
      </div>
    </div>
  );
}
