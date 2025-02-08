"use client";
import React from "react";
import Header from "src/components/layout/Header";
import HelpFAQ from "src/features/help/ui/HelpFAQ";

export default function HelpPage() {
  const faqs = [
    {
      question: "Как восстановить пароль?",
      answer:
        "Для восстановления пароля воспользуйтесь ссылкой 'Забыли пароль?' на странице входа.",
    },
    {
      question: "Как изменить профиль?",
      answer:
        "Перейдите в раздел 'Профиль' и нажмите 'Редактировать профиль', чтобы внести изменения.",
    },
    {
      question: "Как связаться со службой поддержки?",
      answer:
        "Вы можете отправить письмо на support@samevibe.com или воспользоваться формой обратной связи в приложении.",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <div className="max-w-3xl mx-auto py-10 px-4">
        <h2 className="text-3xl font-bold mb-6 text-center">Помощь</h2>
        <HelpFAQ faqs={faqs} />
      </div>
    </div>
  );
}
