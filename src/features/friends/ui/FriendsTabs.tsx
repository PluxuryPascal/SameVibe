"use client";

import React from "react";

export type FriendsTab = "received" | "sended" | "accepted";

interface FriendsTabsProps {
  current: FriendsTab;
  onChange: (tab: FriendsTab) => void;
}

export default function FriendsTabs({ current, onChange }: FriendsTabsProps) {
  const tabs: { key: FriendsTab; label: string }[] = [
    { key: "received", label: "Входящие заявки" },
    { key: "sended", label: "Исходящие заявки" },
    { key: "accepted", label: "Друзья" },
  ];

  return (
    <div className="flex space-x-4 mb-4">
      {tabs.map((t) => (
        <button
          key={t.key}
          onClick={() => onChange(t.key)}
          className={`flex-1 px-4 py-2 rounded ${
            current === t.key
              ? "bg-blue-500 text-white"
              : "bg-gray-200 text-gray-800"
          }`}
        >
          {t.label}
        </button>
      ))}
    </div>
  );
}
