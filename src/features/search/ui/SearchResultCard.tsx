import React from "react";
import Image from "next/image";

interface Props {
  name: string;
  description: string;
  avatar?: string;
  status: "incoming" | "outgoing" | "accepted" | null;
  onAddFriend: () => void;
  onCancel: () => void;
  onAccept: () => void;
  onWrite: () => void;
}

export default function SearchResultCard({
  name,
  description,
  avatar,
  status,
  onAddFriend,
  onCancel,
  onAccept,
  onWrite,
}: Props) {
  return (
    <div className="flex items-center bg-white p-4 rounded shadow mb-4">
      <Image
        src={avatar || "/assets/profile-placeholder.png"}
        alt={name}
        width={64}
        height={64}
        className="rounded-full"
      />
      <div className="ml-4">
        <h3 className="text-xl">{name}</h3>
        <p className="text-gray-600">{description}</p>
      </div>
      <div className="ml-auto flex items-center space-x-4">
        {status === null && (
          <button
            onClick={onAddFriend}
            className="text-blue-500 hover:underline"
          >
            Добавить
          </button>
        )}
        {status === "incoming" && (
          <button onClick={onAccept} className="text-blue-500 hover:underline">
            Принять
          </button>
        )}
        {status === "outgoing" && (
          <button onClick={onCancel} className="text-red-500 hover:underline">
            Отменить заявку
          </button>
        )}
        {status === "accepted" && (
          <button onClick={onWrite} className="text-blue-500 hover:underline">
            Написать
          </button>
        )}
      </div>
    </div>
  );
}
