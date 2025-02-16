"use client";
import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Logo from "src/components/ui/Logo";
import InputField from "src/components/ui/InputField";
import Button from "src/components/ui/Button";
import Checkbox from "@/components/ui/CheckBox";

export default function RegisterPage() {
  // Состояния для формы
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  // Используем единое состояние для гендера: "male", "female" или undefined
  const [gender, setGender] = useState<"male" | "female" | undefined>(
    undefined,
  );
  const [errorMessage, setErrorMessage] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    try {
      const response = await fetch("/api/register/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, gender }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Ошибка регистрации");
      }

      // Регистрация успешна: можно перенаправить пользователя на страницу входа.
      router.push("/auth/login");
    } catch (error: any) {
      setErrorMessage(error.message || "Ошибка при регистрации");
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
              <h2 className="text-2xl font-bold mt-4">Регистрация</h2>
            </div>
            {errorMessage && (
              <p className="mb-4 text-red-500 text-center">{errorMessage}</p>
            )}
            <form onSubmit={handleSubmit}>
              <InputField
                label="Имя"
                type="text"
                placeholder="Введите имя"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
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
              <div className="mt-4">
                <label className="block mb-1 font-medium">Выберите пол</label>
                <div className="flex space-x-4 justify-center">
                  <Checkbox
                    label="Мужской"
                    checked={gender === "male"}
                    onChange={() =>
                      setGender(gender === "male" ? undefined : "male")
                    }
                  />
                  <Checkbox
                    label="Женский"
                    checked={gender === "female"}
                    onChange={() =>
                      setGender(gender === "female" ? undefined : "female")
                    }
                  />
                </div>
              </div>
              <Button type="submit" className="mt-4">
                Зарегистрироваться
              </Button>
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
