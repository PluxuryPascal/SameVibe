// app/profile/edit/page.tsx
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
  gender: "male" | "female" | null;
}

export default function EditProfilePage() {
  const router = useRouter();
  const qc = useQueryClient();
  const [saveMessage, setSaveMessage] = useState("");

  // исходный профиль
  const { data: profile, isLoading } = useQuery<ProfileData>({
    queryKey: ["profile"],
    queryFn: () => api.get("/users/profile/").then((r) => r.data),
    refetchOnWindowFocus: false,
  });

  // локальные поля — пустые по умолчанию
  const [username, setUsername] = useState<string | null>(null);
  const [firstName, setFirstName] = useState<string | null>(null);
  const [lastName, setLastName] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>(null);
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const [gender, setGender] = useState<"male" | "female" | "" | null>(null);

  // заполняем локальный стейт исходными значениями
  useEffect(() => {
    if (profile) {
      setUsername(profile.user.username);
      setFirstName(profile.user.first_name);
      setLastName(profile.user.last_name);
      setEmail(profile.user.email);
      setPhotoUrl(profile.photo);
      setGender(profile.gender || "");
    }
  }, [profile]);

  // мутация
  const mutation = useMutation({
    mutationFn: async () => {
      // если какое‑то поле в локальном стейте вдруг null (не инициализировалось), берём из profile
      const payloadUser: any = {};
      if (username !== profile?.user.username) {
        payloadUser.username = username;
      }
      payloadUser.first_name = firstName;
      payloadUser.last_name = lastName;
      payloadUser.email = email;

      const payload = {
        user: payloadUser,
        photo: photoUrl,
        gender: gender || null,
      };
      return api.patch("/users/profile/", payload);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["profile"] });
      setSaveMessage("Изменения сохранены");
      setTimeout(() => {
        setSaveMessage("");
        router.push("/profile");
      }, 2000);
    },
  });

  if (isLoading || !profile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Загрузка...
      </div>
    );
  }

  const handleSubmit = () => {
    mutation.mutate();
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      {saveMessage && (
        <div className="fixed top-20 right-4 bg-green-500 text-white px-4 py-2 rounded">
          {saveMessage}
        </div>
      )}
      <div className="max-w-4xl mx-auto bg-white p-8 m-10 rounded shadow">
        <h1 className="text-3xl font-bold mb-6 text-center">
          Редактировать профиль
        </h1>

        {/* AvatarUploader для превью, но в payload уйдёт photoUrl */}
        <AvatarUploader
          avatarUrl={photoUrl!}
          onFileChange={(file) => {
            // const reader = new FileReader();
            // reader.onload = () => {
            //   if (typeof reader.result === "string") {
            //     setPhotoUrl(reader.result);
            //   }
            // };
            // reader.readAsDataURL(file);
          }}
        />

        <InputField
          label="Логин"
          type="text"
          placeholder="Введите логин"
          value={username!}
          onChange={(e) => setUsername(e.target.value)}
        />

        <InputField
          label="Имя"
          type="text"
          placeholder="Введите имя"
          value={firstName!}
          onChange={(e) => setFirstName(e.target.value)}
        />

        <InputField
          label="Фамилия"
          type="text"
          placeholder="Введите фамилию"
          value={lastName!}
          onChange={(e) => setLastName(e.target.value)}
        />

        <InputField
          label="Email"
          type="email"
          placeholder="Введите email"
          value={email!}
          onChange={(e) => setEmail(e.target.value)}
        />

        <div className="mb-4">
          <label className="block mb-1 font-medium">Пол</label>
          <select
            value={gender!}
            onChange={(e) => setGender(e.target.value as any)}
            className="w-full p-2 border rounded"
          >
            <option value="">Не выбран</option>
            <option value="male">Мужской</option>
            <option value="female">Женский</option>
          </select>
        </div>

        <div className="flex justify-between space-y-2 mb-6">
          <a
            href="/choose/interests?origin=profile/edit"
            className="text-blue-500 hover:underline"
          >
            Изменить интересы
          </a>
          <a
            href="/choose/hobbies?origin=profile/edit"
            className="text-blue-500 hover:underline"
          >
            Изменить хобби
          </a>
          <a
            href="/choose/music?origin=profile/edit"
            className="text-blue-500 hover:underline"
          >
            Изменить музыкальные вкусы
          </a>
        </div>

        <div className="flex justify-between">
          <Button onClick={handleSubmit} disabled={mutation.isPending}>
            {mutation.isPending ? "Сохранение..." : "Сохранить изменения"}
          </Button>
        </div>
      </div>
    </div>
  );
}
