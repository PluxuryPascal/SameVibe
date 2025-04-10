"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import api from "src/shared/lib/axios";
import Logo from "src/components/ui/Logo";
import InputField from "src/components/ui/InputField";
import Button from "src/components/ui/Button";
import Link from "next/link";
import Checkbox from "src/components/ui/CheckBox";

type RegisterPayload = {
  user: {
    username: string;
    first_name: string;
    last_name: string;
    email: string;
    password: string;
  };
  gender: boolean | null;
};

export default function RegisterPage() {
  const [username, setUsername] = useState("");
  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [gender, setGender] = useState<"male" | "female" | undefined>(
    undefined,
  );
  const [fieldErrors, setFieldErrors] = useState<{
    username?: string;
    name?: string;
    surname?: string;
    email?: string;
    password?: string;
    gender?: string;
  }>({});
  const [serverError, setServerError] = useState("");
  const router = useRouter();

  // Мутация
  const registerMutation = useMutation<any, any, RegisterPayload>({
    mutationFn: (payload) => api.post("/users/register/", payload),
    onSuccess: () => {
      router.push("/auth/login");
    },
    onError: (err) => {
      const data = err.response?.data;
      if (data?.user?.username?.length) {
        setServerError("Пользователь с таким логином уже существует");
      } else {
        setServerError(err.response?.data?.detail || "Ошибка при регистрации");
      }
    },
  });

  // Валидация полей
  useEffect(() => {
    const errs: typeof fieldErrors = {};
    if (!username) errs.username = "Логин обязателен";
    else if (!/^[A-Za-z0-9]+$/.test(username))
      errs.username = "Логин может содержать только латиницу и цифры";

    if (!name) errs.name = "Имя обязательно";
    if (!surname) errs.surname = "Фамилия обязательна";
    if (!email) errs.email = "Email обязателен";
    if (!password) errs.password = "Пароль обязателен";
    if (!gender) errs.gender = "Пол обязателен";

    setFieldErrors(errs);
  }, [username, name, surname, email, password, gender]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setServerError("");
    // если есть ошибки — не шлём
    if (Object.keys(fieldErrors).length > 0) return;

    const payload: RegisterPayload = {
      user: {
        username,
        first_name: name,
        last_name: surname,
        email,
        password,
      },
      gender: gender === "male" ? true : false,
    };
    registerMutation.mutate(payload);
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="grid grid-cols-2 gap-8 w-full max-w-6xl">
        <div className="flex items-center justify-center">
          <Logo width={800} height={800} />
        </div>
        <div className="flex items-center justify-center">
          <div className="w-full max-w-md bg-white p-8 rounded shadow">
            <h2 className="text-2xl font-bold text-center mb-6">Регистрация</h2>

            {serverError && (
              <p className="mb-4 text-red-500 text-center">{serverError}</p>
            )}

            <form onSubmit={handleSubmit} noValidate>
              <InputField
                label="Логин"
                type="text"
                placeholder="Введите логин"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                error={fieldErrors.username}
              />

              <InputField
                label="Имя"
                type="text"
                placeholder="Введите имя"
                value={name}
                onChange={(e) => setName(e.target.value)}
                error={fieldErrors.name}
              />

              <InputField
                label="Фамилия"
                type="text"
                placeholder="Введите фамилию"
                value={surname}
                onChange={(e) => setSurname(e.target.value)}
                error={fieldErrors.surname}
              />

              <InputField
                label="Email"
                type="email"
                placeholder="Введите email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                error={fieldErrors.email}
              />

              <InputField
                label="Пароль"
                type="password"
                placeholder="Введите пароль"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                error={fieldErrors.password}
              />

              <div className="mt-4">
                <label className="block mb-1 font-medium">Пол</label>
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
                {fieldErrors.gender && (
                  <p className="mt-1 text-red-500 text-sm">
                    {fieldErrors.gender}
                  </p>
                )}
              </div>

              <Button
                type="submit"
                className="mt-6 w-full"
                disabled={
                  registerMutation.isPending ||
                  Object.keys(fieldErrors).length > 0
                }
              >
                {registerMutation.isPending
                  ? "Регистрация..."
                  : "Зарегистрироваться"}
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
