"use client";

import { useTranslations } from "next-intl";
import React from "react";

export type FriendsTab = "received" | "sended" | "accepted";

interface FriendsTabsProps {
  current: FriendsTab;
  onChange: (tab: FriendsTab) => void;
}

export default function FriendsTabs({ current, onChange }: FriendsTabsProps) {
  const t = useTranslations("");

  const tabs: { key: FriendsTab; label: string }[] = [
    { key: "received", label: t("friends_tab_received") },
    { key: "sended", label: t("friends_tab_sended") },
    { key: "accepted", label: t("friends_tab_accepted") },
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
