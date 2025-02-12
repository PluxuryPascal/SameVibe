import React from "react";
import InputField from "src/components/ui/InputField";

interface NameInputProps {
  name: string;
  onNameChange: (newName: string) => void;
}

export default function NameInput({ name, onNameChange }: NameInputProps) {
  return (
    <InputField
      label="Имя"
      type="text"
      placeholder="Введите имя"
      value={name}
      onChange={(e) => onNameChange(e.target.value)}
    />
  );
}
