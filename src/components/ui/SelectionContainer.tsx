import React from "react";

interface SelectionContainerProps {
  children: React.ReactNode;
}

export default function SelectionContainer({
  children,
}: SelectionContainerProps) {
  return (
    <div className="border-t-4 border-r-4 border-blue-500  rounded-lg shadow p-4 w-full max-h-96 overflow-y-auto">
      {children}
    </div>
  );
}
