"use client";
import React from "react";
import Header from "src/components/layout/Header";
import ProfileCard from "src/features/profile/ui/ProfileCard";

export default function ProfilePage() {
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Композиция: подключаем Header */}
      <Header />
      <div className="flex items-center justify-center py-10">
        <ProfileCard />
      </div>
    </div>
  );
}
