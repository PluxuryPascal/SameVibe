import React from "react";

interface FAQItem {
  question: string;
  answer: string;
}

interface HelpFAQProps {
  faqs: FAQItem[];
}

export default function HelpFAQ({ faqs }: HelpFAQProps) {
  return (
    <div className="space-y-4">
      {faqs.map((faq, index) => (
        <div key={index} className="p-4 bg-white rounded shadow">
          <h3 className="text-lg font-bold mb-2">{faq.question}</h3>
          <p className="text-gray-700">{faq.answer}</p>
        </div>
      ))}
    </div>
  );
}
