import React from "react";
import Link from "next/link";
import Logo from "src/components/ui/Logo";

export default function Header() {
  return (
    <header className="flex items-center justify-between bg-white shadow p-4">
      {/* Основное меню */}

      <nav className="flex items-center space-x-6">
        <Logo />
        <Link
          href="/profile"
          className="text-blue-500 font-semibold hover:underline"
        >
          Профиль
        </Link>
        <Link
          href="/friends"
          className="text-blue-500 font-semibold hover:underline"
        >
          Друзья
        </Link>
        <Link
          href="/chats"
          className="text-blue-500 font-semibold hover:underline"
        >
          Чаты
        </Link>
        <Link
          href="/search"
          className="text-blue-500 font-semibold hover:underline"
        >
          Поиск
        </Link>
      </nav>

      {/* Второстепенное меню */}
      <div className="space-y-4 w-full max-w-xs">
        <Link href="/settings" className="text-gray-500 hover:underline">
          Настройки
        </Link>
        <Link href="/help" className="text-gray-500 hover:underline">
          Помощь
        </Link>
      </div>
    </header>
  );
}
