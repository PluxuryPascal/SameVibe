"use client";
import React from "react";
import Link from "next/link";
import Logo from "src/components/ui/Logo";
import { usePathname } from "next/navigation";

export default function Header() {
  const pathname = usePathname();
  const isActive = (href: string) => pathname.startsWith(href);

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
          Профиль
        </Link>
        <Link
          href="/friends"
          className={`font-semibold hover:underline ${
            isActive("/friends")
              ? "text-blue-700 border-b-2 border-blue-700"
              : "text-blue-500"
          }`}
        >
          Друзья
        </Link>
        <Link
          href="/chats"
          className={`font-semibold hover:underline ${
            isActive("/chats")
              ? "text-blue-700 border-b-2 border-blue-700"
              : "text-blue-500"
          }`}
        >
          Чаты
        </Link>
        <Link
          href="/search"
          className={`font-semibold hover:underline ${
            isActive("/search")
              ? "text-blue-700 border-b-2 border-blue-700"
              : "text-blue-500"
          }`}
        >
          Поиск
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
            Настройки
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
            Помощь
          </Link>
        </div>
      </div>
    </header>
  );
}
