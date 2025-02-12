"use client";
import React from "react";
import Link from "next/link";
import Header from "src/components/layout/Header";
import AvatarUploader from "src/features/profile/ui/AvatarUploader";
import NameInput from "src/features/profile/ui/NameInput";
import Button from "src/components/ui/Button";
import useProfileEditor from "src/features/profile/logic/useProfileEditor";

export default function EditProfilePage() {
  const {
    avatar,
    name,
    updateAvatar,
    updateName,
    submitProfileChanges,
    logout,
  } = useProfileEditor();

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <div className="max-w-4xl  mx-auto bg-white p-8 m-10 rounded shadow">
        <h1 className="text-3xl font-bold mb-6 text-center">
          Редактировать профиль
        </h1>
        {/* Загрузка аватара */}
        <AvatarUploader
          avatarUrl={avatar ? URL.createObjectURL(avatar) : undefined}
          onFileChange={updateAvatar}
        />
        {/* Изменение имени */}
        <NameInput name={name} onNameChange={updateName} />

        {/* Ссылки для изменения выбора */}
        <div className="mb-4">
          <p className="text-gray-700 mb-2">Музыкальные вкусы</p>
          <Link href="/choose/music" className="text-blue-500 hover:underline">
            Изменить музыкальные вкусы
          </Link>
        </div>
        <div className="mb-4">
          <p className="text-gray-700 mb-2">Хобби</p>
          <Link
            href="/choose/hobbies"
            className="text-blue-500 hover:underline"
          >
            Изменить хобби
          </Link>
        </div>
        <div className="mb-4">
          <p className="text-gray-700 mb-2">Интересы</p>
          <Link
            href="/choose/interests"
            className="text-blue-500 hover:underline"
          >
            Изменить интересы
          </Link>
        </div>
        <span
          onClick={logout}
          className=" mb-2 text-red-500 cursor-pointer hover:underline"
        >
          Выйти из аккаунта
        </span>

        {/* Нижняя панель: сохранение изменений */}
        <div className="flex justify-between mt-6">
          <Button onClick={submitProfileChanges}>Сохранить изменения</Button>
        </div>
      </div>
    </div>
  );
}
