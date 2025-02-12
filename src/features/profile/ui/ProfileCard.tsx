import React from "react";
import Image from "next/image";
import Button from "@/components/ui/Button";
import Link from "next/link";

export default function ProfileCard() {
  return (
    <div className="max-w-md mx-auto bg-white shadow rounded p-6">
      <div className="flex flex-col items-center">
        {/* Предполагается, что изображение профиля лежит в public/assets */}
        <Image
          src="/assets/profile-placeholder.png"
          alt="User Avatar"
          width={120}
          height={120}
          className="rounded-full"
        />
        <h2 className="text-2xl font-bold mt-4">Имя Фамилия</h2>
        <p className="text-gray-600">
          Краткое описание или статус пользователя
        </p>
      </div>
      <div className="mt-4">
        <Link href="/profile/edit" className="flex-1 " passHref>
          <Button>Редактировать профиль</Button>
        </Link>
      </div>
    </div>
  );
}
