import React from "react";
import Link from "next/link";
import Logo from "src/components/ui/Logo";
import Button from "src/components/ui/Button";

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4">
      <Logo width={500} height={500} />
      <h1 className="text-3xl font-bold mb-8">
        Заводите знакомства в SameVibe!
      </h1>
      <div className=" flex  items-center justify-center space-x-4 w-full max-w-xs ">
        <Link href="/auth/login" className="flex-1 " passHref>
          <Button>Вход</Button>
        </Link>
        <Link href="/auth/register" className="flex-1 " passHref>
          <Button>Регистрация</Button>
        </Link>
      </div>
    </div>
  );
}
