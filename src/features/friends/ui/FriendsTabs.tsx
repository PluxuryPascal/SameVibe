"use client";
import React from "react";

export type FriendsTab = "received" | "sended" | "accepted";

interface FriendsTabsProps {
  current: FriendsTab;
  onChange: (tab: FriendsTabsProps["current"]) => void;
}

export default function FriendsTabs({ current, onChange }: FriendsTabsProps) {
  const tabs: { key: FriendsTab; label: string }[] = [
    { key: "received", label: "Входящие заявки" },
    { key: "sended", label: "Исходящие заявки" },
    { key: "accepted", label: "Друзья" },
  ];

  return (
    <div className="flex space-x-4 justify-center mb-6">
      {tabs.map((t) => (
        <button
          key={t.key}
          onClick={() => onChange(t.key)}
          className={`px-4 py-2 rounded-t-xl ${
            current === t.key
              ? "bg-white border-t border-x border-gray-300"
              : "bg-gray-200"
          }`}
        >
          {t.label}
        </button>
      ))}
    </div>
  );
}
