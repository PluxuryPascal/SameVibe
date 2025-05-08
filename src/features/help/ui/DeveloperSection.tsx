"use client";

import { useTranslations } from "next-intl";
import React from "react";
import api from "src/shared/lib/axios";
import Button from "src/components/ui/Button";

export default function DeveloperSection() {
  const t = useTranslations("");

  const openDocsUI = async () => {
    try {
      // 1) Проверяем доступность эндпоинта
      await api.get("/docs/schema/ui/");

      // 2) Открываем страницу в новой вкладке
      window.open("http://localhost:8000/api/v1/docs/schema/ui/", "_blank");
    } catch (error) {
      console.error("Не удалось открыть документацию:", error);
    }
  };

  return (
    <div className="mt-4 p-4 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-4">
        {t("help_developer_section_title")}
      </h2>
      <p className="mb-4 text-gray-700">{t("help_developer_section_text")}</p>
      <Button onClick={openDocsUI}>{t("help_developer_section_button")}</Button>
    </div>
  );
}
