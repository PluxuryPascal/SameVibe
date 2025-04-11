"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation, UseMutationResult } from "@tanstack/react-query";
import api from "src/shared/lib/axios";
import Logo from "src/components/ui/Logo";
import InputField from "src/components/ui/InputField";
import Button from "src/components/ui/Button";
import Link from "next/link";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const router = useRouter();

  type LoginVars = { username: string; password: string };

  // Функция проверки предпочтений пользователя (осталась без изменений)
  const checkUserPreferences = async () => {
    const interestsPromise = api.get("/interests/userinterests/");
    const hobbiesPromise = api.get("/interests/userhobbies/");
    const musicsPromise = api.get("/interests/usermusics/");
    const [interestsRes, hobbiesRes, musicsRes] = await Promise.all([
      interestsPromise,
      hobbiesPromise,
      musicsPromise,
    ]);
    return {
      interests: interestsRes.data,
      hobbies: hobbiesRes.data,
      musics: musicsRes.data,
    };
  };

  const loginMutation: UseMutationResult<any, Error, LoginVars, unknown> =
    useMutation<any, Error, LoginVars>({
      mutationFn: async (vars: LoginVars) => {
        const response = await api.post("/token/", vars);
        return response.data;
      },
      onSuccess: async (data) => {
        // Сохраняем токены
        localStorage.setItem("accessToken", data.access);
        localStorage.setItem("refreshToken", data.refresh);

        // Дополнительный запрос для получения id пользователя
        try {
          const res = await api.get("/users/userid/", {
            headers: { Authorization: `Bearer ${data.access}` },
          });
          // Предполагается, что сервер возвращает число или объект { id: ... }
          const userId = typeof res.data === "object" ? res.data.id : res.data;
          localStorage.setItem("currentUserId", userId.toString());
        } catch (err) {
          console.error("Ошибка получения id пользователя", err);
        }

        try {
          const { interests, hobbies, musics } = await checkUserPreferences();
          if (
            interests.length === 0 &&
            hobbies.length === 0 &&
            musics.length === 0
          ) {
            router.push("/choose/interests?origin=auth");
          } else {
            router.push("/chats/");
          }
        } catch (error) {
          router.push("/choose/interests?origin=auth");
        }
      },
      onError: (error: Error) => {
        console.error(error);
        setErrorMessage("Неверный логин или пароль");
      },
    });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    loginMutation.mutate({ username, password });
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="grid grid-cols-2 gap-8 w-full max-w-6xl">
        <div className="flex items-center justify-center">
          <Logo width={800} height={800} />
        </div>
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
                label="Логин"
                type="text"
                placeholder="Введите логин"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
              <InputField
                label="Пароль"
                type="password"
                placeholder="Введите пароль"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <Button type="submit" disabled={loginMutation.isPending}>
                {loginMutation.isPending ? "Вход..." : "Войти"}
              </Button>
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
