"use client";

import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "src/shared/lib/axios";
import { useRouter } from "next/navigation";
import Header from "src/components/layout/Header";
import InputField from "src/components/ui/InputField";
import SearchResultCard from "src/features/search/ui/SearchResultCard";
import SearchFilterTabs, {
  SearchCategory,
} from "src/features/search/ui/SearchFilterTabs";
import { useTranslations } from "next-intl";

type UserData = {
  id: number;
  first_name: string;
  last_name: string;
  avatar: string | null;
  gender: boolean | null; // true = male, false = female
  percentage: number;
  status: "incoming" | "outgoing" | "accepted" | null;
};

export default function SearchPage() {
  const qc = useQueryClient();
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [genderFilter, setGenderFilter] = useState<"" | "male" | "female">("");
  const [currentCategory, setCurrentCategory] =
    useState<SearchCategory>("interests");

  const endpointMap: Record<SearchCategory, string> = {
    interests: "interest-search",
    hobbies: "hobby-search",
    music: "music-search",
  };
  const endpoint = endpointMap[currentCategory];
  const t = useTranslations("");

  // GET один раз при смене категории
  const { data = [], isLoading } = useQuery<UserData[]>({
    queryKey: ["search", currentCategory],
    queryFn: async () => {
      const token = localStorage.getItem("accessToken");
      const res = await api.get(`/users/${endpoint}/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data;
    },
  });

  // сначала фильтрация по query, потом по полу, потом сортировка
  const filtered = data
    .filter((u) => {
      const full = `${u.first_name} ${u.last_name}`.toLowerCase();
      return full.includes(query.toLowerCase());
    })
    .filter((u) => {
      if (genderFilter === "male") return u.gender === true;
      if (genderFilter === "female") return u.gender === false;
      return true;
    })
    .sort((a, b) => b.percentage - a.percentage);

  // мутации дружбы
  const addMut = useMutation({
    mutationFn: (id: number) =>
      api.post(
        "/friends/friendshiplist/",
        { to_user: id },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        },
      ),
    onSuccess: () => qc.invalidateQueries(["search", currentCategory]),
  });
  const cancelMut = useMutation({
    mutationFn: (id: number) =>
      api.delete("/friends/friendship/", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
        data: { other_user_id: id },
      }),
    onSuccess: () => qc.invalidateQueries(["search", currentCategory]),
  });
  const acceptMut = useMutation({
    mutationFn: (id: number) =>
      api.patch(
        "/friends/friendship/",
        { other_user_id: id },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        },
      ),
    onSuccess: () => qc.invalidateQueries(["search", currentCategory]),
  });

  // Мутация для создания (или получения уже существующего) чата
  const chatMut = useMutation({
    mutationFn: async (otherId: number) => {
      return api.post(
        "/chat/chats/",
        { to_user: otherId },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        },
      );
    },
    onSuccess: (response) => {
      const chatId = response.data.id;
      router.push(`/chats/${chatId}`);
    },
    onError: (err) => {
      console.error("Ошибка создания чата:", err);
    },
  });

  if (isLoading)
    return <div className="p-10 text-center">{t("chats_loading")}</div>;

  return (
    <div className="min-h-screen bg-gray-100 relative">
      <Header />
      <div className="max-w-2xl mx-auto py-10 px-4">
        <h2 className="text-3xl font-bold mb-4 text-center">
          {t("search_title")}
        </h2>

        <SearchFilterTabs
          currentCategory={currentCategory}
          onSelectCategory={setCurrentCategory}
        />
        <div className="sticky top-0 bg-gray-100 z-10 pt-4">
          {/* Поиск */}
          <div>
            <InputField
              label={t("search_label")}
              type="text"
              placeholder={t("search_placeholder")}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>

          {/* Фильтр по полу */}
          <div>
            <select
              className="w-full p-2 border rounded mb-2"
              value={genderFilter}
              onChange={(e) => setGenderFilter(e.target.value as any)}
            >
              <option value="">{t("search_filter_gender_all")}</option>
              <option value="male">{t("search_filter_gender_male")}</option>
              <option value="female">{t("search_filter_gender_female")}</option>
            </select>
          </div>
        </div>

        {/* Список */}
        <div>
          {filtered.map((u) => (
            <SearchResultCard
              key={u.id}
              name={`${u.first_name} ${u.last_name}`}
              description={`${t("search_description")} ${u.percentage}%`}
              avatar={u.avatar || undefined}
              status={u.status}
              onAddFriend={() => addMut.mutate(u.id)}
              onCancel={() => cancelMut.mutate(u.id)}
              onAccept={() => acceptMut.mutate(u.id)}
              onWrite={() => chatMut.mutate(u.id)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
