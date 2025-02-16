"use client";
import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Logo from "src/components/ui/Logo";
import InputField from "src/components/ui/InputField";
import Button from "src/components/ui/Button";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    try {
      const response = await fetch("/api/token/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        throw new Error("Неверный email или пароль");
      }
      const data = await response.json();

      // Сохранение токенов (access и refresh) в localStorage.
      // В реальном проекте рекомендуется использовать httpOnly cookies для большей безопасности.
      localStorage.setItem("accessToken", data.access);
      localStorage.setItem("refreshToken", data.refresh);

      // Перенаправляем пользователя на страницу выбора интересов с параметром origin=auth
      router.push("/choose/interests?origin=auth");
    } catch (error: any) {
      setErrorMessage(error.message || "Ошибка при входе");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="grid grid-cols-2 gap-8 w-full max-w-6xl">
        {/* Левая колонка с логотипом */}
        <div className="flex items-center justify-center">
          <Logo width={800} height={800} />
        </div>
        {/* Правая колонка с формой */}
        <div className="flex items-center justify-center">
          <div className="w-full max-w-md bg-white p-8 rounded shadow">
            <div className="mb-6 text-center">
              <h2 className="text-2xl font-bold mt-4">Вход</h2>
            </div>
            {errorMessage && (
              <p className="mb-4 text-red-500 text-center">{errorMessage}</p>
            )}
            <form onSubmit={handleSubmit}>
              <InputField
                label="Email"
                type="email"
                placeholder="Введите email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <InputField
                label="Пароль"
                type="password"
                placeholder="Введите пароль"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <Button type="submit">Войти</Button>
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
