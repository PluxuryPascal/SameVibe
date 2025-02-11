import React from "react";

interface InterestsSelectionContainerProps {
  children: React.ReactNode;
}

export default function InterestsSelectionContainer({
  children,
}: InterestsSelectionContainerProps) {
  return (
    <div className="border-t-4 border-r-4 border-blue-500  rounded-lg shadow p-4 w-full max-h-96 overflow-y-auto">
      {children}
    </div>
  );
}
