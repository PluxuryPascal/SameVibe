"use client";
import React from "react";
import Header from "src/components/layout/Header";
import ChatSidebar from "src/features/chat/ui/ChatSidebar";
import ChatWindow from "src/features/chat/ui/ChatWindow";

export default function MainPage() {
  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Композиция Header */}
      <Header />
      {/* Основная область: боковая панель и окно чата */}
      <div className="flex flex-1 overflow-hidden">
        <ChatSidebar />
        <ChatWindow />
      </div>
    </div>
  );
}
