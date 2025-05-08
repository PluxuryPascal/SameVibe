import { useTranslations } from "next-intl";
import React from "react";
import Button from "src/components/ui/Button";

export default function DeveloperSection() {
  const t = useTranslations("");
  return (
    <div className="mt-4 p-4 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-4">
        {t("help_developer_section_title")}
      </h2>
      <p className="mb-4 text-gray-700">{t("help_developer_section_text")}</p>
      <a href="/assets/documentation.pdf" download>
        <Button>{t("help_developer_section_button")}</Button>
      </a>
    </div>
  );
}
