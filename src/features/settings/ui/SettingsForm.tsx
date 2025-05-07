"use client";

import React, { useState } from "react";
import { useRouter } from "src/i18n/navigation";
import Button from "src/components/ui/Button";

export default function SettingsForm() {
  const router = useRouter();
  const [language, setLanguage] = useState("ru");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Настройки сохранены:", { language });

    // router.push автоматически учитывает текущий pathname и locale
    router.push("/settings", { locale: language });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <label htmlFor="language" className="block mb-1 font-medium">
        Язык интерфейса
      </label>
      <select
        id="language"
        value={language}
        onChange={(e) => setLanguage(e.target.value)}
        className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring focus:border-blue-300"
      >
        <option value="ru">Русский</option>
        <option value="en">English</option>
        <option value="es">Español</option>
        <option value="de">Deutsch</option>
      </select>
      <Button type="submit">Сохранить настройки</Button>
    </form>
  );
}
