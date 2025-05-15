"use client";

import React from "react";
import { useQuery } from "@tanstack/react-query";
import api from "src/shared/lib/axios";
import Image from "next/image";
import Button from "@/components/ui/Button";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";

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
  const t = useTranslations("");

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

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    router.push("/auth/login");
  };

  if (profileLoading) return <div>Загрузка...</div>;
  if (profileError)
    return <div className="text-red-500">Ошибка загрузки профиля</div>;

  // Функция, которая делает массив названий в строку через запятую
  const joinNames = (items: NamedItem[]) =>
    items.map((it) => it.name).join(", ") || "—";

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
        <h3 className="text-xl font-semibold">{t("profile_interests")}</h3>
        <p className="mt-1 text-gray-700">{joinNames(interests)}</p>
      </div>

      <div className="mt-4">
        <h3 className="text-xl font-semibold">{t("profile_hobbies")}</h3>
        <p className="mt-1 text-gray-700">{joinNames(hobbies)}</p>
      </div>

      <div className="mt-4">
        <h3 className="text-xl font-semibold">{t("profile_musics")}</h3>
        <p className="mt-1 text-gray-700">{joinNames(musicGenres)}</p>
      </div>

      <div className="mt-6 flex w-full justify-around">
        <Link href="/profile/edit">
          <Button>{t("profile_edit_button")}</Button>
        </Link>
      </div>
      <div className="mt-2 flex justify-around">
        <Button className="bg-red-500 hover:bg-red-600" onClick={handleLogout}>
          {t("profile_logout")}
        </Button>
      </div>
    </div>
  );
}
