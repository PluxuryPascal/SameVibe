"use client";
import React from "react";
import ChooseMusicContainer from "src/features/choose/music/ChooseMusicContainer";
import Logo from "src/components/ui/Logo";

export default function ChooseMusicPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="grid grid-cols-2 gap-8 w-full max-w-6xl">
        <Logo width={800} height={800} />
        <ChooseMusicContainer />
      </div>
    </div>
  );
}
