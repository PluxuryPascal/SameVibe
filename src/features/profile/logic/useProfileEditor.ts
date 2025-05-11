import { useState } from "react";

export interface ProfileEditorState {
  avatar: File | null;
  name: string;
  surname: string;
  email: string;
  gender: "male" | "female" | undefined;
  musicTastes: string[];
  hobbies: string[];
  interests: string[];
}

export default function useProfileEditor(initialState?: Partial<ProfileEditorState>) {
  const [avatar, setAvatar] = useState<File | null>(initialState?.avatar || null);
  const [name, setName] = useState(initialState?.name || "");
  const [surname, setSurname] = useState(initialState?.surname || "");
  const [email, setEmail] = useState(initialState?.email || "");
  const [gender, setGender] = useState<"male" | "female" | undefined>(initialState?.gender);
  const [musicTastes, setMusicTastes] = useState<string[]>(initialState?.musicTastes || []);
  const [hobbies, setHobbies] = useState<string[]>(initialState?.hobbies || []);
  const [interests, setInterests] = useState<string[]>(initialState?.interests || []);

  const updateAvatar = (file: File | null) => setAvatar(file);
  const updateName = (newName: string) => setName(newName);
  const updateSurname = (newSurname: string) => setSurname(newSurname);
  const updateEmail = (newEmail: string) => setEmail(newEmail);
  const updateGender = (newGender: "male" | "female" | undefined) => setGender(newGender);
  const updateMusicTastes = (selected: string[]) => setMusicTastes(selected);
  const updateHobbies = (selected: string[]) => setHobbies(selected);
  const updateInterests = (selected: string[]) => setInterests(selected);

  // Пример получения данных профиля с сервера (раскомментируйте при интеграции)
  /*
  useEffect(() => {
    async function fetchProfile() {
      try {
        const res = await fetch("/api/profile/", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            // "Authorization": `Bearer ${accessToken}`,
          },
        });
        if (!res.ok) {
          throw new Error("Ошибка получения данных профиля");
        }
        const data = await res.json();
        setName(data.firstName);
        setSurname(data.lastName);
        setEmail(data.email);
        setGender(data.gender); // ожидается "male" или "female"
        // Если сервер возвращает URL аватара, можно сохранить его в виде File или как строку (здесь оставляем File)
      } catch (error) {
        console.error(error);
      }
    }
    fetchProfile();
  }, []);
  */

  const submitProfileChanges = async () => {
    // Здесь можно добавить вызов API для сохранения изменений на сервере
    const payload = {
      // Если avatar отправляется отдельно (например, через FormData), можно обработать отдельно
      name,
      surname,
      email,
      gender,
      musicTastes,
      hobbies,
      interests,
    };
    console.log("Отправка данных профиля", { avatar, ...payload });
    // Пример отправки через fetch (раскомментируйте при интеграции)
    /*
    const res = await fetch("/api/profile/", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        // "Authorization": `Bearer ${accessToken}`,
      },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      throw new Error("Ошибка сохранения данных профиля");
    }
    */
  };

  const logout = () => {
    // Логика выхода из аккаунта (очистка токенов, редирект и т.д.)
    console.log("Выход из аккаунта");
  };

  return {
    avatar,
    name,
    surname,
    email,
    gender,
    musicTastes,
    hobbies,
    interests,
    updateAvatar,
    updateName,
    updateSurname,
    updateEmail,
    updateGender,
    updateMusicTastes,
    updateHobbies,
    updateInterests,
    submitProfileChanges,
    logout,
  };
}
