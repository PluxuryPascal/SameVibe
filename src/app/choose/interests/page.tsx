"use client";
import React from "react";
import ChooseInterestsContainer from "src/features/choose/interests/ChooseInterestsContainer";
import Logo from "@/components/ui/Logo";

export default function ChooseInterestsPage() {
  return (
    <div className="min-h-screen flex  items-center justify-center p-4">
      <div className="grid grid-cols-2 gap-8 w-full max-w-6xl">
        <Logo width={800} height={800}></Logo>
        <ChooseInterestsContainer />
      </div>
    </div>
  );
}
