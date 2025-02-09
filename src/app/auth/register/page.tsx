import React from "react";
import Link from "next/link";
import Logo from "src/components/ui/Logo";
import InputField from "src/components/ui/InputField";
import Button from "src/components/ui/Button";

export default function RegisterPage() {
  // Здесь можно подключить бизнес-логику регистрации (например, useAuth или другой хук)
  return (
    <div className="min-h-screen flex items-center justify-center  px-4">
      <div className="grid grid-cols-2 gap-8 w-full max-w-6xl">
        {/* Передаём нужные размеры, например, 600×600 */}
        <div className="flex items-center justify-center">
          {/* Передаём нужные размеры, например, 600×600 */}
          <Logo width={800} height={800} />
        </div>
        <div className="flex items-center justify-center">
          <div className="w-full max-w-md bg-white p-8 rounded shadow ">
            <div className="mb-6 text-center">
              <h2 className="text-2xl font-bold mt-4">Регистрация</h2>
            </div>
            <form>
              <InputField label="Имя" type="text" placeholder="Введите имя" />
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
              <Button type="submit">Зарегистрироваться</Button>
            </form>
            <p className="mt-4 text-center">
              Уже есть аккаунт?{" "}
              <Link href="/auth/login" className="text-blue-500">
                Войти
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
