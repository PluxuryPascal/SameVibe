"use client";
import React from "react";
import Header from "src/components/layout/Header";
import HelpFAQ from "src/features/help/ui/HelpFAQ";
import DeveloperSection from "src/features/help/ui/DeveloperSection";

export default function HelpPage() {
  const faqs = [
    {
      question: "Как изменить профиль?",
      answer:
        "Перейдите в раздел 'Профиль' и нажмите 'Редактировать профиль', чтобы внести изменения.",
    },
    {
      question: "Как связаться со службой поддержки?",
      answer: "Вы можете отправить письмо на samevivesup@gmail.com",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <div className="max-w-3xl mx-auto py-10 px-4">
        <h2 className="text-3xl font-bold mb-6 text-center">Помощь</h2>
        <HelpFAQ faqs={faqs} />
        {/* Добавляем раздел "Для разработчиков" */}
        <DeveloperSection />
      </div>
    </div>
  );
}
