import React from "react";
import Button from "src/components/ui/Button";

interface LogoutButtonProps {
  onLogout: () => void;
}

export default function LogoutButton({ onLogout }: LogoutButtonProps) {
  return (
    <Button onClick={onLogout} className="bg-red-500 hover:bg-red-600">
      Выйти из аккаунта
    </Button>
  );
}
