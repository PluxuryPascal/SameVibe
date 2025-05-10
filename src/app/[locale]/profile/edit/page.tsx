"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "src/shared/lib/axios";
import Header from "src/components/layout/Header";
import AvatarUploader from "src/features/profile/ui/AvatarUploader";
import InputField from "src/components/ui/InputField";
import Button from "src/components/ui/Button";
import { useTranslations } from "next-intl";
import Link from "next/link";

interface ProfileData {
  user: {
    username: string;
    first_name: string;
    last_name: string;
    email: string;
  };
  photo: string;
  gender: boolean | null;
}

export default function EditProfilePage() {
  const router = useRouter();
  const qc = useQueryClient();
  const [saveMessage, setSaveMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isAvatarLoading, setIsAvatarLoading] = useState(false);
  const t = useTranslations("");

  // 1. Получаем текущий профиль
  const {
    data: profile,
    isLoading,
    error: profileError,
  } = useQuery<ProfileData>({
    queryKey: ["profile"],
    queryFn: () => api.get("/users/profile/").then((res) => res.data),
    refetchOnWindowFocus: false,
    retry: 1,
  });

  // 2. Локальное состояние формы
  const [formState, setFormState] = useState({
    username: "",
    firstName: "",
    lastName: "",
    email: "",
    photoUrl: "",
    gender: "" as "male" | "female" | "",
  });

  // 3. Инициализируем из ответа
  useEffect(() => {
    if (!profile) return;
    setFormState({
      username: profile.user.username,
      firstName: profile.user.first_name,
      lastName: profile.user.last_name,
      email: profile.user.email,
      photoUrl: profile.photo,
      gender:
        profile.gender === true
          ? "male"
          : profile.gender === false
            ? "female"
            : "",
    });
  }, [profile]);

  // 4. Валидация
  const validateForm = () => {
    const errors: string[] = [];
    if (!/^[A-Za-z0-9]+$/.test(formState.username)) {
      errors.push("Логин — только латиница и цифры");
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formState.email)) {
      errors.push("Некорректный email");
    }
    return errors;
  };

  // 5. Мутация — формируем payload только с изменениями
  const mutation = useMutation({
    mutationFn: async () => {
      if (!profile) throw new Error("Profile not loaded");

      // Собираем только те поля, которые отличаются от оригинала
      const userPayload: any = {};
      if (formState.username !== profile.user.username) {
        userPayload.username = formState.username;
      }
      if (formState.firstName !== profile.user.first_name) {
        userPayload.first_name = formState.firstName;
      }
      if (formState.lastName !== profile.user.last_name) {
        userPayload.last_name = formState.lastName;
      }
      if (formState.email !== profile.user.email) {
        userPayload.email = formState.email;
      }

      const payload: any = {};
      if (Object.keys(userPayload).length) {
        payload.user = userPayload;
      }
      if (formState.photoUrl !== profile.photo) {
        payload.photo = formState.photoUrl;
      }
      const genderVal =
        formState.gender === "male"
          ? true
          : formState.gender === "female"
            ? false
            : null;
      if (genderVal !== profile.gender) {
        payload.gender = genderVal;
      }

      return api.patch("/users/profile/", payload);
    },
    onSuccess: () => {
      qc.invalidateQueries(["profile"]);
      setSaveMessage(t("profile_edit_saved"));
      setTimeout(() => router.push("/profile"), 2000);
    },
    onError: (err: any) => {
      const errData = err.response?.data;
      const msg =
        errData?.detail ||
        errData?.user?.username?.join(" ") ||
        "Ошибка при сохранении профиля";
      setErrorMessage(msg);
    },
  });

  const handleSubmit = () => {
    const errs = validateForm();
    if (errs.length) {
      setErrorMessage(errs.join("\n"));
      return;
    }
    if (isAvatarLoading) {
      setErrorMessage("Дождитесь завершения загрузки аватара");
      return;
    }
    setErrorMessage("");
    mutation.mutate();
  };

  if (isLoading) return <div>Загрузка...</div>;
  if (profileError)
    return <div className="text-red-500">Ошибка загрузки профиля</div>;

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      {/* Уведомления */}
      <div className="fixed top-20 right-4 space-y-2">
        {saveMessage && (
          <div className="bg-green-500 text-white px-4 py-2 rounded">
            {saveMessage}
          </div>
        )}
        {errorMessage && (
          <div className="bg-red-500 text-white px-4 py-2 rounded">
            {errorMessage}
          </div>
        )}
      </div>

      {/* Форма */}
      <div className="max-w-4xl mx-auto bg-white p-8 my-10 rounded shadow">
        <h1 className="text-3xl font-bold mb-6 text-center">
          {t("profile_edit_title")}
        </h1>

        <AvatarUploader
          avatarUrl={formState.photoUrl}
          onUploadStart={() => setIsAvatarLoading(true)}
          onUploadEnd={(url) => {
            setFormState((p) => ({ ...p, photoUrl: url }));
            setIsAvatarLoading(false);
          }}
          onUploadError={(err) => {
            setIsAvatarLoading(false);
            setErrorMessage(`Ошибка загрузки аватара: ${err}`);
          }}
        />

        <div className="space-y-4 mt-6">
          <InputField
            label={t("auth_register_username")}
            value={formState.username}
            onChange={(e) =>
              setFormState((p) => ({ ...p, username: e.target.value }))
            }
          />
          <InputField
            label={t("auth_register_name")}
            value={formState.firstName}
            onChange={(e) =>
              setFormState((p) => ({ ...p, firstName: e.target.value }))
            }
          />
          <InputField
            label={t("auth_register_surname")}
            value={formState.lastName}
            onChange={(e) =>
              setFormState((p) => ({ ...p, lastName: e.target.value }))
            }
          />
          <InputField
            label={t("auth_register_email")}
            type="email"
            value={formState.email}
            onChange={(e) =>
              setFormState((p) => ({ ...p, email: e.target.value }))
            }
          />

          <div className="mb-4">
            <label className="block mb-1 font-medium">
              {t("profile_edit_gender_label")}
            </label>
            <select
              className="w-full p-2 border rounded"
              value={formState.gender}
              onChange={(e) =>
                setFormState((p) => ({
                  ...p,
                  gender: e.target.value as any,
                }))
              }
            >
              <option value="">{t("profile_edit_gender_none")}</option>
              <option value="male">{t("profile_edit_gender_male")}</option>
              <option value="female">{t("profile_edit_gender_female")}</option>
            </select>
          </div>
        </div>

        {/* Ссылки для изменения выбора */}
        <div className="mb-4">
          <p className="text-gray-700 mb-2">Музыкальные вкусы</p>
          <Link
            href="/choose/music?origin=profile"
            className="text-blue-500 hover:underline"
          >
            Изменить музыкальные вкусы
          </Link>
        </div>
        <div className="mb-4">
          <p className="text-gray-700 mb-2">Хобби</p>
          <Link
            href="/choose/hobbies?origin=profile"
            className="text-blue-500 hover:underline"
          >
            Изменить хобби
          </Link>
        </div>
        <div className="mb-4">
          <p className="text-gray-700 mb-2">Интересы</p>
          <Link
            href="/choose/interests?origin=profile"
            className="text-blue-500 hover:underline"
          >
            Изменить интересы
          </Link>
        </div>

        <div className="flex justify-end mt-6">
          <Button
            onClick={handleSubmit}
            disabled={mutation.isPending || isAvatarLoading}
          >
            {mutation.isPending
              ? t("profile_edit_button_saving")
              : t("profile_edit_button_save")}
          </Button>
        </div>
      </div>
    </div>
  );
}
