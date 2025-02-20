"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Button from "@/components/ui/Button";
import Link from "next/link";

interface ProfileData {
  firstName: string;
  lastName: string;
  avatarUrl: string;
}

export default function ProfileCard() {
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchProfile() {
      try {
        const res = await fetch("/api/profile/", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            // Если используется JWT, можно добавить заголовок авторизации:
            // "Authorization": `Bearer ${accessToken}`,
          },
        });
        if (!res.ok) {
          throw new Error("Ошибка получения данных профиля");
        }
        const data: ProfileData = await res.json();
        setProfile(data);
      } catch (err: any) {
        setError(err.message);
      }
    }
    fetchProfile();
  }, []);

  return (
    <div className="max-w-md mx-auto bg-white shadow rounded p-6">
      <div className="flex flex-col items-center">
        {profile && profile.avatarUrl ? (
          <Image
            src={profile.avatarUrl}
            alt="User Avatar"
            width={120}
            height={120}
            className="rounded-full"
          />
        ) : (
          <Image
            src="/assets/profile-placeholder.png"
            alt="User Avatar"
            width={120}
            height={120}
            className="rounded-full"
          />
        )}
        <h2 className="text-2xl font-bold mt-4">
          {profile ? `${profile.firstName} ${profile.lastName}` : "Загрузка..."}
        </h2>
      </div>
      <div className="mt-4">
        <Link href="/profile/edit" className="flex-1 " passHref>
          <Button>Редактировать профиль</Button>
        </Link>
      </div>
      {error && <p className="mt-2 text-red-500">{error}</p>}
    </div>
  );
}
