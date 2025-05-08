"use client";
import React from "react";
import Header from "src/components/layout/Header";
import HelpFAQ from "src/features/help/ui/HelpFAQ";
import DeveloperSection from "src/features/help/ui/DeveloperSection";
import { useTranslations } from "next-intl";

export default function HelpPage() {
  const t = useTranslations("");

  const faqs = [
    {
      question: t("help_faq_question_edit_profile"),
      answer: t("help_faq_answer_edit_profile"),
    },
    {
      question: t("help_faq_question_contact_support"),
      answer: t("help_faq_answer_contact_support"),
    },
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <div className="max-w-3xl mx-auto py-10 px-4">
        <h2 className="text-3xl font-bold mb-6 text-center">
          {t("help_title")}
        </h2>
        <HelpFAQ faqs={faqs} />
        {/* Раздел "Для разработчиков" */}
        <DeveloperSection />
      </div>
    </div>
  );
}
