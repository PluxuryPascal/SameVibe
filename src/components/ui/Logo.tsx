import React from "react";
import Image from "next/image";

export default function Logo() {
  return (
    <div className="flex items-center justify-center">
      <Image src="/assets/icon.png" alt="SameVibe" width={80} height={80} />
      <div className="w-20 h-20 bg-blue-500 rounded-full" />
    </div>
  );
}
