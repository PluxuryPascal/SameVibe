"use client";

import React from "react";
import { useQuery } from "@tanstack/react-query";
import api from "src/shared/lib/axios";
import Image from "next/image";
import Button from "@/components/ui/Button";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface ProfileData {
  user: {
    username: string;
    first_name: string;
    last_name: string;
    email: string;
  };
  photo: string;
  gender: string;
}

interface NamedItem {
  id: number;
  name: string;
}

export default function ProfileCard() {
  const router = useRouter();

  const {
    data: profile,
    error: profileError,
    isLoading: profileLoading,
  } = useQuery<ProfileData>({
    queryKey: ["profile"],
    queryFn: async () => {
      const token = localStorage.getItem("accessToken");
      const res = await api.get("/users/profile/", {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data;
    },
  });

  const { data: interests = [] } = useQuery<NamedItem[]>({
    queryKey: ["user-interests"],
    queryFn: async () => {
      const token = localStorage.getItem("accessToken");
      const res = await api.get("/interests/userinterests/", {
        headers: { Authorization: `Bearer ${token}` },
      });
      // Предполагается, что сервер возвращает объекты с вложенным объектом interest
      return res.data.map((item: any) => item.interest);
    },
  });

  const { data: hobbies = [] } = useQuery<NamedItem[]>({
    queryKey: ["user-hobbies"],
    queryFn: async () => {
      const token = localStorage.getItem("accessToken");
      const res = await api.get("/interests/userhobbies/", {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data.map((item: any) => item.hobby);
    },
  });

  const { data: musicGenres = [] } = useQuery<NamedItem[]>({
    queryKey: ["user-music-genres"],
    queryFn: async () => {
      const token = localStorage.getItem("accessToken");
      const res = await api.get("/interests/usermusics/", {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data.map((item: any) => item.genre);
    },
  });

  // Функция для очистки токенов и выхода пользователя
  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    // Перенаправление на страницу логина
    router.push("/auth/login");
  };

  if (profileLoading) return <div>Загрузка...</div>;
  if (profileError)
    return <div className="text-red-500">Ошибка загрузки профиля</div>;

  return (
    <div className="max-w-md mx-auto bg-white shadow rounded p-6">
      <div className="flex flex-col items-center">
        <Image
          src={profile?.photo || "/assets/profile-placeholder.png"}
          alt="User Avatar"
          width={120}
          height={120}
          className="rounded-full"
        />
        <h2 className="text-2xl font-bold mt-4">
          {profile.user.first_name} {profile.user.last_name}
        </h2>
        <p className="text-lg text-gray-600">@{profile.user.username}</p>
      </div>

      <div className="mt-4">
        <h3 className="text-xl font-semibold">Интересы:</h3>
        <ul className="list-disc ml-6">
          {interests.map((interest) => (
            <li key={interest.id}>{interest.name}</li>
          ))}
        </ul>
      </div>

      <div className="mt-4">
        <h3 className="text-xl font-semibold">Хобби:</h3>
        <ul className="list-disc ml-6">
          {hobbies.map((hobby) => (
            <li key={hobby.id}>{hobby.name}</li>
          ))}
        </ul>
      </div>

      <div className="mt-4">
        <h3 className="text-xl font-semibold">Музыкальные жанры:</h3>
        <ul className="list-disc ml-6">
          {musicGenres.map((genre) => (
            <li key={genre.id}>{genre.name}</li>
          ))}
        </ul>
      </div>

      <div className="mt-6 flex justify-around">
        <Link href="/profile/edit">
          <Button>Редактировать профиль</Button>
        </Link>
      </div>
      <div className="mt-2 flex justify-around">
        <Button className="bg-red-500 hover:bg-red-600" onClick={handleLogout}>
          Выйти
        </Button>
      </div>
    </div>
  );
}
