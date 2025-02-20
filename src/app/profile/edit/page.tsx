"use client";
import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Header from "src/components/layout/Header";
import AvatarUploader from "src/features/profile/ui/AvatarUploader";
import NameInput from "src/features/profile/ui/NameInput";
import InputField from "src/components/ui/InputField";
import Button from "src/components/ui/Button";
import useProfileEditor from "src/features/profile/logic/useProfileEditor";

export default function EditProfilePage() {
  const {
    avatar,
    name,
    surname,
    email,
    gender,
    updateAvatar,
    updateName,
    updateSurname,
    updateEmail,
    updateGender,
    submitProfileChanges,
    logout,
  } = useProfileEditor();
  const router = useRouter();
  const [saveMessage, setSaveMessage] = useState("");

  const handleSubmit = async () => {
    try {
      await submitProfileChanges(); // Отправка данных на сервер
      setSaveMessage("Изменения сохранены");
      setTimeout(() => {
        setSaveMessage("");
        router.push("/profile");
      }, 3000);
    } catch (error) {
      console.error(error);
      // Здесь можно добавить обработку ошибки (например, установить сообщение об ошибке)
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      {/* Уведомление о сохранении изменений */}
      {saveMessage && (
        <div className="fixed top-20 right-4 bg-green-500 text-white px-4 py-2 rounded transition-opacity duration-1000">
          {saveMessage}
        </div>
      )}
      <div className="max-w-4xl mx-auto bg-white p-8 m-10 rounded shadow">
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
        {/* Изменение фамилии */}
        <InputField
          label="Фамилия"
          type="text"
          placeholder="Введите фамилию"
          value={surname}
          onChange={(e) => updateSurname(e.target.value)}
        />
        {/* Изменение email */}
        <InputField
          label="Email"
          type="email"
          placeholder="Введите email"
          value={email}
          onChange={(e) => updateEmail(e.target.value)}
        />
        {/* Выбор пола */}
        <div className="mb-4">
          <label className="block mb-1 font-medium">Пол</label>
          <select
            value={gender || ""}
            onChange={(e) =>
              updateGender(
                e.target.value
                  ? (e.target.value as "male" | "female")
                  : undefined,
              )
            }
            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring focus:border-blue-300"
          >
            <option value="">Не выбран</option>
            <option value="male">Мужской</option>
            <option value="female">Женский</option>
          </select>
        </div>

        {/* Ссылки для изменения выбора (музыкальные вкусы, хобби, интересы) */}
        <div className="mb-4">
          <p className="text-gray-700 mb-2">Музыкальные вкусы</p>
          <Link
            href="/choose/music?origin=profile/edit"
            className="text-blue-500 hover:underline"
          >
            Изменить музыкальные вкусы
          </Link>
        </div>
        <div className="mb-4">
          <p className="text-gray-700 mb-2">Хобби</p>
          <Link
            href="/choose/hobbies?origin=profile/edit"
            className="text-blue-500 hover:underline"
          >
            Изменить хобби
          </Link>
        </div>
        <div className="mb-4">
          <p className="text-gray-700 mb-2">Интересы</p>
          <Link
            href="/choose/interests?origin=profile/edit"
            className="text-blue-500 hover:underline"
          >
            Изменить интересы
          </Link>
        </div>
        <span
          onClick={logout}
          className="mb-2 text-red-500 cursor-pointer hover:underline"
        >
          Выйти из аккаунта
        </span>

        {/* Нижняя панель: сохранение изменений */}
        <div className="flex justify-between mt-6">
          <Button onClick={handleSubmit}>Сохранить изменения</Button>
        </div>
      </div>
    </div>
  );
}
