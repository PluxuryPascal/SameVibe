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
        <Link href="/auth/login" passHref>
          <Button className="flex-1 w-52">Вход</Button>
        </Link>
        <Link href="/auth/register" passHref>
          <Button className="flex-1 w-52">Регистрация</Button>
        </Link>
      </div>
    </div>
  );
}
