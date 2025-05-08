"use client";
import { useTranslations } from "next-intl";
import React from "react";
import Header from "src/components/layout/Header";
import SettingsForm from "src/features/settings/ui/SettingsForm";

export default function SettingsPage() {
  const t = useTranslations("");

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <div className="max-w-2xl mx-auto py-10 px-4">
        <h2 className="text-3xl font-bold mb-6 text-center">
          {t("settings_title")}
        </h2>
        <SettingsForm />
      </div>
    </div>
  );
}
