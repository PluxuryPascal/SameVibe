import React from "react";
import Link from "next/link";
import Logo from "src/components/ui/Logo";
import Button from "src/components/ui/Button";

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 px-4">
      <div className="mb-8">
        <Logo />
      </div>
      <h1 className="text-3xl font-bold mb-6">Добро пожаловать в SameVibe</h1>
      <div className="space-x-4">
        <Link href="/auth/login" passHref>
          <Button>Вход</Button>
        </Link>
        <Link href="/auth/register" passHref>
          <Button>Регистрация</Button>
        </Link>
      </div>
    </div>
  );
}
