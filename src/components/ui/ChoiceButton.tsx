import React from "react";

interface ChoiceButtonProps {
  label: string;
  selected?: boolean;
  onClick?: () => void;
}

export default function ChoiceButton({
  label,
  selected,
  onClick,
}: ChoiceButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`w-20 h-20 rounded-full flex items-center justify-center border-2 transition-colors ${
        selected ? "border-blue-500 bg-blue-100" : "border-gray-300 bg-white"
      }`}
    >
      <span className="text-sm font-medium">{label}</span>
    </button>
  );
}
