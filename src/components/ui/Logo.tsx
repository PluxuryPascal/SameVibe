import React from "react";
import Image from "next/image";

interface LogoProps {
  width?: number;
  height?: number;
  className?: string;
}

export default function Logo({
  width = 80,
  height = 80,
  className = "",
}: LogoProps) {
  return (
    <div className={`flex items-center justify-center ${className}`}>
      <Image
        src="/assets/icon.png"
        alt="SameVibe"
        width={width}
        height={height}
        layout="fixed"
      />
    </div>
  );
}
