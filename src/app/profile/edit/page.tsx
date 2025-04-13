"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "src/shared/lib/axios";
import Header from "src/components/layout/Header";
import AvatarUploader from "src/features/profile/ui/AvatarUploader";
import InputField from "src/components/ui/InputField";
import Button from "src/components/ui/Button";

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

  // 1. Запрос профиля с обновленной обработкой ошибок
  const {
    data: profile,
    isLoading,
    error: profileError,
  } = useQuery<ProfileData>({
    queryKey: ["profile"],
    queryFn: async () => {
      try {
        const response = await api.get("/users/profile/");
        return response.data;
      } catch (error) {
        console.error("Profile fetch error:", error);
        throw error;
      }
    },
    refetchOnWindowFocus: false,
    retry: 1,
  });

  // 2. Состояния формы с валидацией
  const [formState, setFormState] = useState({
    username: "",
    firstName: "",
    lastName: "",
    email: "",
    photoUrl: "",
    gender: "" as "male" | "female" | "",
  });

  // 3. Инициализация формы с защитой от null
  useEffect(() => {
    if (profile) {
      setFormState({
        username: profile.user.username || "",
        firstName: profile.user.first_name || "",
        lastName: profile.user.last_name || "",
        email: profile.user.email || "",
        photoUrl: profile.photo || "",
        gender:
          profile.gender === true
            ? "male"
            : profile.gender === false
              ? "female"
              : "",
      });
    }
  }, [profile]);

  // 4. Валидации с улучшенной обработкой
  const validateForm = () => {
    const errors = [];
    if (!/^[A-Za-z0-9]+$/.test(formState.username)) {
      errors.push("Логин — только латиница и цифры");
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formState.email)) {
      errors.push("Некорректный email");
    }
    return errors;
  };

  // 5. Обновленная мутация с обработкой фото
  const mutation = useMutation({
    mutationFn: async () => {
      const payload = {
        user: {
          username: formState.username,
          first_name: formState.firstName,
          last_name: formState.lastName,
          email: formState.email,
        },
        photo: formState.photoUrl,
        gender:
          formState.gender === "male"
            ? true
            : formState.gender === "female"
              ? false
              : null,
      };

      return api.patch("/users/profile/", payload);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["profile"] });
      setSaveMessage("Изменения сохранены");
      setTimeout(() => router.push("/profile"), 2000);
    },
    onError: (error: any) => {
      const errorData = error.response?.data;
      const errorMessage =
        errorData?.detail ||
        errorData?.user?.username?.join?.(" ") ||
        "Ошибка при сохранении профиля";
      setErrorMessage(errorMessage);
    },
  });

  // 6. Обработчик отправки формы
  const handleSubmit = () => {
    const errors = validateForm();
    if (errors.length > 0) {
      setErrorMessage(errors.join("\n"));
      return;
    }

    if (isAvatarLoading) {
      setErrorMessage("Дождитесь завершения загрузки аватара");
      return;
    }

    setErrorMessage("");
    mutation.mutate();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Загрузка профиля...
      </div>
    );
  }

  if (profileError) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500">
        Ошибка загрузки профиля
      </div>
    );
  }

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

      {/* Основная форма */}
      <div className="max-w-4xl mx-auto bg-white p-8 m-10 rounded shadow">
        <h1 className="text-3xl font-bold mb-6 text-center">
          Редактировать профиль
        </h1>

        <AvatarUploader
          avatarUrl={formState.photoUrl}
          onUploadStart={() => setIsAvatarLoading(true)}
          onUploadEnd={(url) => {
            setFormState((prev) => ({ ...prev, photoUrl: url }));
            setIsAvatarLoading(false);
          }}
          onUploadError={(error) => {
            setIsAvatarLoading(false);
            setErrorMessage(`Ошибка загрузки аватара: ${error}`);
          }}
        />

        {/* Поля формы */}
        <div className="space-y-4">
          <InputField
            label="Логин"
            value={formState.username}
            onChange={(e) =>
              setFormState((prev) => ({
                ...prev,
                username: e.target.value,
              }))
            }
          />

          <InputField
            label="Имя"
            value={formState.firstName}
            onChange={(e) =>
              setFormState((prev) => ({
                ...prev,
                firstName: e.target.value,
              }))
            }
          />

          <InputField
            label="Фамилия"
            value={formState.lastName}
            onChange={(e) =>
              setFormState((prev) => ({
                ...prev,
                lastName: e.target.value,
              }))
            }
          />

          <InputField
            label="Email"
            type="email"
            value={formState.email}
            onChange={(e) =>
              setFormState((prev) => ({
                ...prev,
                email: e.target.value,
              }))
            }
          />

          <div className="mb-4">
            <label className="block mb-1 font-medium">Пол</label>
            <select
              value={formState.gender}
              onChange={(e) =>
                setFormState((prev) => ({
                  ...prev,
                  gender: e.target.value as typeof formState.gender,
                }))
              }
              className="w-full p-2 border rounded"
            >
              <option value="">Не выбран</option>
              <option value="male">Мужской</option>
              <option value="female">Женский</option>
            </select>
          </div>
        </div>

        {/* Ссылки */}
        <div className="flex flex-wrap gap-4 mb-6">
          {["interests", "hobbies", "music"].map((type) => (
            <a
              key={type}
              href={`/choose/${type}?origin=profile/edit`}
              className="text-blue-500 hover:underline"
            >
              Изменить{" "}
              {
                {
                  interests: "интересы",
                  hobbies: "хобби",
                  music: "музыкальные вкусы",
                }[type]
              }
            </a>
          ))}
        </div>

        {/* Кнопка отправки */}
        <div className="flex justify-end">
          <Button
            onClick={handleSubmit}
            disabled={mutation.isPending || isAvatarLoading}
          >
            {mutation.isPending ? "Сохранение..." : "Сохранить изменения"}
          </Button>
        </div>
      </div>
    </div>
  );
}
