import React from "react";
import ChoiceButton from "./ChoiceButton";

export interface SelectionItem {
  id: number; // или string, если id строковые
  name: string;
}

interface SelectionGridProps {
  items: SelectionItem[];
  selectedItems: number[]; // храним id выбранных элементов
  onToggle: (id: number) => void;
}

export default function SelectionGrid({
  items,
  selectedItems,
  onToggle,
}: SelectionGridProps) {
  return (
    <div className="grid grid-cols-4 gap-2">
      {items.map((item) => (
        <ChoiceButton
          key={item.id} // используем уникальное поле id в качестве ключа
          label={item.name}
          selected={selectedItems.includes(item.id)}
          onClick={() => onToggle(item.id)}
        />
      ))}
    </div>
  );
}
