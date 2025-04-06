"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import api from "src/shared/lib/axios";
import Logo from "src/components/ui/Logo";
import InputField from "src/components/ui/InputField";
import Button from "src/components/ui/Button";
import Link from "next/link";
import Checkbox from "src/components/ui/CheckBox";

type RegisterVars = {
  username: string;
  name: string;
  surname: string;
  email: string;
  password: string;
  gender?: "male" | "female";
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
  const [errorMessage, setErrorMessage] = useState("");
  const router = useRouter();

  const registerMutation = useMutation<any, Error, RegisterVars>({
    mutationFn: async (vars: RegisterVars) => {
      const response = await api.post("/users/register/", vars);
      return response.data;
    },
    onSuccess: () => {
      router.push("/auth/login");
    },
    onError: (error: Error) => {
      setErrorMessage(error.message || "Ошибка при регистрации");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    registerMutation.mutate({
      user: {
        username: username,
        first_name: name,
        last_name: surname,
        email: email,
        password: password,
      },
      gender: gender === "male" ? true : gender === "female" ? false : null,
    });
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
                label="Логин"
                type="text"
                placeholder="Введите логин"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
              <InputField
                label="Имя"
                type="text"
                placeholder="Введите имя"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <InputField
                label="Фамилия"
                type="text"
                placeholder="Введите фамилию"
                value={surname}
                onChange={(e) => setSurname(e.target.value)}
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
              <Button
                type="submit"
                className="mt-4"
                disabled={registerMutation.isPending}
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
