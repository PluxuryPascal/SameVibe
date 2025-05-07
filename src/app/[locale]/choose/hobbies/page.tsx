"use client";
import React from "react";
import ChooseHobbiesContainer from "src/features/choose/hobbies/ChooseHobbiesContainer";
import Logo from "src/components/ui/Logo";

export default function ChooseHobbiesPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="grid grid-cols-2 gap-8 w-full max-w-6xl">
        <Logo width={800} height={800} />
        <ChooseHobbiesContainer />
      </div>
    </div>
  );
}
