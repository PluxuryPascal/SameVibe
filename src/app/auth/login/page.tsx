import React from "react";
import Link from "next/link";
import Logo from "src/components/ui/Logo";
import InputField from "src/components/ui/InputField";
import Button from "src/components/ui/Button";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="grid grid-cols-2 gap-8 w-full max-w-6xl">
        {/* Левая колонка с логотипом */}
        <div className="flex items-center justify-center">
          {/* Передаём нужные размеры, например, 600×600 */}
          <Logo width={800} height={800} />
        </div>
        {/* Правая колонка с формой */}
        <div className="flex items-center justify-center">
          <div className="w-full max-w-md bg-white p-8 rounded shadow">
            <div className="mb-6 text-center">
              <h2 className="text-2xl font-bold mt-4">Вход</h2>
            </div>
            <form>
              <InputField
                label="Email"
                type="email"
                placeholder="Введите email"
              />
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
      </div>
    </div>
  );
}
