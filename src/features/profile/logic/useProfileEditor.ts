import { useState } from "react";

export interface ProfileEditorState {
  avatar: File | null;
  name: string;
  musicTastes: string[];
  hobbies: string[];
  interests: string[];
}

export default function useProfileEditor(initialState?: Partial<ProfileEditorState>) {
  const [avatar, setAvatar] = useState<File | null>(initialState?.avatar || null);
  const [name, setName] = useState(initialState?.name || "");
  const [musicTastes, setMusicTastes] = useState<string[]>(initialState?.musicTastes || []);
  const [hobbies, setHobbies] = useState<string[]>(initialState?.hobbies || []);
  const [interests, setInterests] = useState<string[]>(initialState?.interests || []);

  const updateAvatar = (file: File | null) => setAvatar(file);
  const updateName = (newName: string) => setName(newName);
  const updateMusicTastes = (selected: string[]) => setMusicTastes(selected);
  const updateHobbies = (selected: string[]) => setHobbies(selected);
  const updateInterests = (selected: string[]) => setInterests(selected);

  const submitProfileChanges = () => {
    // Здесь можно добавить вызов API для сохранения изменений
    console.log("Отправка данных профиля", { avatar, name, musicTastes, hobbies, interests });
  };

  const logout = () => {
    // Логика выхода из аккаунта (очистка токенов, редирект и т.д.)
    console.log("Выход из аккаунта");
  };

  return {
    avatar,
    name,
    musicTastes,
    hobbies,
    interests,
    updateAvatar,
    updateName,
    updateMusicTastes,
    updateHobbies,
    updateInterests,
    submitProfileChanges,
    logout,
  };
}
