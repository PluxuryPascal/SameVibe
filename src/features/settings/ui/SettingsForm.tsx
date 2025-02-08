import React, { useState } from "react";
import InputField from "src/components/ui/InputField";
import Button from "src/components/ui/Button";

export default function SettingsForm() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Здесь можно подключить бизнес-логику для сохранения настроек
    console.log("Настройки сохранены:", { username, email });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <InputField
        label="Имя пользователя"
        type="text"
        placeholder="Введите имя пользователя"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <InputField
        label="Email"
        type="email"
        placeholder="Введите email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <Button type="submit">Сохранить настройки</Button>
    </form>
  );
}
