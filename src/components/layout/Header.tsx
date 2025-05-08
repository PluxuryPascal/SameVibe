"use client";
import React from "react";
import Link from "next/link";
import Logo from "src/components/ui/Logo";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";

export default function Header() {
  const pathname = usePathname();
  const isActive = (href: string) => pathname.startsWith(href);
  const t = useTranslations("");

  return (
    <header className="flex items-center justify-between bg-white shadow p-4">
      {/* Основное меню */}
      <nav className="flex items-center space-x-6">
        <Logo />
        <Link
          href="/profile"
          className={`font-semibold hover:underline ${
            isActive("/profile")
              ? "text-blue-700 border-b-2 border-blue-700"
              : "text-blue-500"
          }`}
        >
          {t("header_profile")}
        </Link>
        <Link
          href="/friends"
          className={`font-semibold hover:underline ${
            isActive("/friends")
              ? "text-blue-700 border-b-2 border-blue-700"
              : "text-blue-500"
          }`}
        >
          {t("header_friends")}
        </Link>
        <Link
          href="/chats"
          className={`font-semibold hover:underline ${
            isActive("/chats")
              ? "text-blue-700 border-b-2 border-blue-700"
              : "text-blue-500"
          }`}
        >
          {t("header_chats")}
        </Link>
        <Link
          href="/search"
          className={`font-semibold hover:underline ${
            isActive("/search")
              ? "text-blue-700 border-b-2 border-blue-700"
              : "text-blue-500"
          }`}
        >
          {t("header_search")}
        </Link>
      </nav>

      {/* Второстепенное меню */}
      <div className="space-y-2 text-right">
        <div>
          <Link
            href="/settings"
            className={`hover:underline ${
              isActive("/settings")
                ? "text-gray-700 border-b-2 border-gray-700"
                : "text-gray-500"
            }`}
          >
            {t("header_settings")}
          </Link>
        </div>
        <div>
          <Link
            href="/help"
            className={`hover:underline ${
              isActive("/help")
                ? "text-gray-700 border-b-2 border-gray-700"
                : "text-gray-500"
            }`}
          >
            {t("header_help")}
          </Link>
        </div>
      </div>
    </header>
  );
}
