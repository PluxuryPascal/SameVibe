import React from "react";

export default function ChatWindow() {
  return (
    <main className="flex-1 flex flex-col p-4">
      {/* Заголовок чата */}
      <div className="border-b border-gray-200 pb-3 mb-4">
        <h2 className="text-2xl font-bold">Название чата</h2>
      </div>
      {/* Область сообщений */}
      <div className="flex-1 overflow-y-auto space-y-4">
        <div className="flex">
          <div className="bg-gray-200 p-3 rounded-lg max-w-xs">
            Привет! Как дела?
          </div>
        </div>
        <div className="flex justify-end">
          <div className="bg-blue-200 p-3 rounded-lg max-w-xs">
            Все отлично, спасибо!
          </div>
        </div>
      </div>
      {/* Форма ввода сообщения */}
      <div className="mt-4">
        <form className="flex items-center">
          <input
            type="text"
            placeholder="Введите сообщение..."
            className="flex-1 p-3 border border-gray-300 rounded-l focus:outline-none focus:ring focus:border-blue-300"
          />
          <button
            type="submit"
            className="bg-blue-500 text-white p-3 rounded-r hover:bg-blue-600 transition-colors"
          >
            Отправить
          </button>
        </form>
      </div>
    </main>
  );
}
