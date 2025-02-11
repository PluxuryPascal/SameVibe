import React from "react";

interface ChoiceButtonProps {
  label: string;
  selected?: boolean;
  onClick: () => void;
}

export default function ChoiceButton({
  label,
  selected,
  onClick,
}: ChoiceButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`w-24 h-24 rounded-full flex items-center justify-center border-2 transition-colors ${
        selected ? "border-blue-500 bg-blue-100" : "border-gray-300 bg-white"
      }`}
    >
      <span
        className="text-center text-sm font-medium px-1 truncate"
        style={{ maxWidth: "100%" }}
      >
        {label}
      </span>
    </button>
  );
}
