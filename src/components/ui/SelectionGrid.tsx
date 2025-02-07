import React from "react";
import ChoiceButton from "./ChoiceButton";

interface SelectionGridProps {
  items: string[];
  selectedItems: string[];
  onToggle: (item: string) => void;
}

export default function SelectionGrid({
  items,
  selectedItems,
  onToggle,
}: SelectionGridProps) {
  return (
    <div className="grid grid-cols-3 gap-4">
      {items.map((item) => (
        <ChoiceButton
          key={item}
          label={item}
          selected={selectedItems.includes(item)}
          onClick={() => onToggle(item)}
        />
      ))}
    </div>
  );
}
