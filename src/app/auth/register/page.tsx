"use client";
import React, { useState } from "react";
import Link from "next/link";
import Logo from "src/components/ui/Logo";
import InputField from "src/components/ui/InputField";
import Button from "src/components/ui/Button";
import Checkbox from "src/components/ui/CheckBox";

export default function RegisterPage() {
  // Используем единое состояние для хранения выбранного гендера: "male", "female" или undefined
  const [gender, setGender] = useState<"male" | "female" | undefined>(
    undefined,
  );

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="grid grid-cols-2 gap-8 w-full max-w-6xl">
        <div className="flex items-center justify-center">
          <Logo width={800} height={800} />
        </div>
        <div className="flex items-center justify-center">
          <div className="w-full max-w-md bg-white p-8 rounded shadow">
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
