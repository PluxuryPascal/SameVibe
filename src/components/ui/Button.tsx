import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

export default function Button({ children, ...props }: ButtonProps) {
  return (
    <button
      {...props}
      className="w-full bg-blue-500 text-white p-3 rounded hover:bg-blue-600 transition-colors"
    >
      {children}
    </button>
  );
}
