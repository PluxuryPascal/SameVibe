// src/shared/ui/Button.tsx
"use client"; // <-- Добавляем директиву

import { FC } from "react";

interface ButtonProps {
  variant?: "primary" | "secondary";
  children: React.ReactNode;
  className?: string;
}

export const Button: FC<ButtonProps> = ({
  variant = "primary",
  children,
  className = "",
}) => {
  const baseStyles = "px-4 py-2 rounded-lg transition-colors";
  const variantStyles = {
    primary: "bg-blue-600 text-white hover:bg-blue-700",
    secondary: "bg-gray-200 text-gray-800 hover:bg-gray-300",
  };

  return (
    <button className={`${baseStyles} ${variantStyles[variant]} ${className}`}>
      {children}
    </button>
  );
};
