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
import { useTranslations } from "next-intl";

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
  const t = useTranslations("");

  // Мутация
  const registerMutation = useMutation<any, any, RegisterPayload>({
    mutationFn: (payload) => api.post("/users/register/", payload),
    onSuccess: () => {
      router.push("/auth/login");
    },
    onError: (err) => {
      const data = err.response?.data;
      if (data?.user?.username?.length) {
        setServerError(t("auth_register_error_user_exists"));
      } else {
        setServerError(
          err.response?.data?.detail || t("auth_register_error_generic"),
        );
      }
    },
  });

  // Валидация полей
  useEffect(() => {
    const errs: typeof fieldErrors = {};
    if (!username) errs.username = t("auth_register_error_login_required");
    else if (!/^[A-Za-z0-9]+$/.test(username))
      errs.username = t("auth_register_error_login_format");

    if (!name) errs.name = t("auth_register_error_name_required");
    if (!surname) errs.surname = t("auth_register_error_surname_required");
    if (!email) errs.email = t("auth_register_error_email_required");
    if (!password) errs.password = t("auth_register_error_password_required");
    if (!gender) errs.gender = t("auth_register_error_gender_required");

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
            <h2 className="text-2xl font-bold text-center mb-6">
              {t("auth_register_title")}
            </h2>

            {serverError && (
              <p className="mb-4 text-red-500 text-center">{serverError}</p>
            )}

            <form onSubmit={handleSubmit} noValidate>
              <InputField
                label={t("auth_register_username")}
                type="text"
                placeholder={t("auth_register_username_placeholder")}
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                error={fieldErrors.username}
              />

              <InputField
                label={t("auth_register_name")}
                type="text"
                placeholder={t("auth_register_name_placeholder")}
                value={name}
                onChange={(e) => setName(e.target.value)}
                error={fieldErrors.name}
              />

              <InputField
                label={t("auth_register_surname")}
                type="text"
                placeholder={t("auth_register_surname_placeholder")}
                value={surname}
                onChange={(e) => setSurname(e.target.value)}
                error={fieldErrors.surname}
              />

              <InputField
                label={t("auth_register_email")}
                type="email"
                placeholder={t("auth_register_email_placeholder")}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                error={fieldErrors.email}
              />

              <InputField
                label={t("auth_register_password")}
                type="password"
                placeholder={t("auth_register_password_placeholder")}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                error={fieldErrors.password}
              />

              <div className="mt-4">
                <label className="block mb-1 font-medium">
                  {t("auth_register_gender")}
                </label>
                <div className="flex space-x-4 justify-center">
                  <Checkbox
                    label={t("auth_register_gender_male")}
                    checked={gender === "male"}
                    onChange={() =>
                      setGender(gender === "male" ? undefined : "male")
                    }
                  />
                  <Checkbox
                    label={t("auth_register_gender_female")}
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
                  ? t("auth_register_pending")
                  : t("auth_register_button")}
              </Button>
            </form>

            <p className="mt-4 text-center">
              {t("auth_register_have_account")}{" "}
              <Link href="/auth/login" className="text-blue-500">
                {t("auth_register_go_login")}
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
