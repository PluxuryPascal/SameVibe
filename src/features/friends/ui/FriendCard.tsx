import React from "react";
import Image from "next/image";

interface FriendCardProps {
  name: string;
  status: "online" | "offline";
  avatar?: string;
}

export default function FriendCard({ name, status, avatar }: FriendCardProps) {
  return (
    <div className="flex items-center p-4 bg-white rounded shadow mb-4">
      <div className="relative w-16 h-16">
        <Image
          src={avatar || "/assets/profile-placeholder.png"}
          alt={name}
          width={64}
          height={64}
          className="rounded-full"
        />
        <span
          className={`absolute bottom-0 right-0 w-4 h-4 rounded-full border-2 border-white ${
            status === "online" ? "bg-green-500" : "bg-gray-500"
          }`}
        ></span>
      </div>
      <div className="ml-4">
        <h3 className="text-xl font-semibold">{name}</h3>
        <p className="text-sm text-gray-600">
          {status === "online" ? "Онлайн" : "Оффлайн"}
        </p>
      </div>
    </div>
  );
}
