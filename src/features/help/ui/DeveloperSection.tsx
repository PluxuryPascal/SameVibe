import React from "react";
import Button from "src/components/ui/Button";

export default function DeveloperSection() {
  return (
    <div className="mt-8 p-4 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-4">Для разработчиков</h2>
      <p className="mb-4 text-gray-700">
        Здесь вы можете скачать документацию по проекту для ознакомления и
        разработки.
      </p>
      <a href="/assets/documentation.pdf" download>
        <Button>Скачать документацию</Button>
      </a>
    </div>
  );
}
