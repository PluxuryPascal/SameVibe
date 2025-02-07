import React from "react";
import Link from "next/link";
import Logo from "src/components/ui/Logo";
import InputField from "src/components/ui/InputField";
import Button from "src/components/ui/Button";

export default function LoginPage() {
  // Здесь можно подключить бизнес-логику авторизации (например, хук useAuth)
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md bg-white p-8 rounded shadow">
        <div className="mb-6 text-center">
          <Logo />
          <h2 className="text-2xl font-bold mt-4">Вход</h2>
        </div>
        <form>
          <InputField label="Email" type="email" placeholder="Введите email" />
          <InputField
            label="Пароль"
            type="password"
            placeholder="Введите пароль"
          />
          <Link href="/choose/interests">
            <Button type="submit">Войти</Button>
          </Link>
        </form>
        <p className="mt-4 text-center">
          Нет аккаунта?{" "}
          <Link href="/auth/register" className="text-blue-500">
            Зарегистрироваться
          </Link>
        </p>
      </div>
    </div>
  );
}
