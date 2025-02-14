import React from "react";
import Image from "next/image";

interface SearchResultCardProps {
  name: string;
  description: string;
  avatar?: string;
  isFriend: boolean; // Флаг: является ли пользователь другом
  onAddFriend?: () => void; // Функция для обработки клика по кнопке добавления
}

export default function SearchResultCard({
  name,
  description,
  avatar,
  isFriend,
  onAddFriend,
}: SearchResultCardProps) {
  return (
    <div className="flex items-center p-4 bg-white rounded shadow mb-4 cursor-pointer hover:bg-gray-50 transition-colors">
      <div className="relative w-16 h-16">
        <Image
          src={avatar || "/assets/profile-placeholder.png"}
          alt={name}
          width={64}
          height={64}
          className="rounded-full"
        />
      </div>
      <div className="ml-4">
        <h3 className="text-xl font-semibold">{name}</h3>
        <p className="text-gray-600">{description}</p>
      </div>
      <div className="ml-auto">
        {isFriend ? (
          <span className="text-gray-600">В друзьях</span>
        ) : (
          <button
            onClick={onAddFriend}
            className="text-blue-500 border border-blue-500 rounded px-3 py-1 hover:bg-blue-500 hover:text-white transition-colors"
          >
            Добавить в друзья
          </button>
        )}
      </div>
    </div>
  );
}
