"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { CldUploadWidget } from "next-cloudinary";
import api from "src/shared/lib/axios";

interface AvatarUploaderProps {
  avatarUrl?: string;
  onUploadStart: () => void;
  onUploadEnd: (url: string) => void;
  onUploadError: (error: string) => void;
}

export default function AvatarUploader({
  avatarUrl,
  onUploadStart,
  onUploadEnd,
  onUploadError,
}: AvatarUploaderProps) {
  const [preview, setPreview] = useState<string | undefined>(avatarUrl);
  const [userId, setUserId] = useState<string>("");

  // Получаем user_id с бэкенда (через axios-интерцепторы рефрешат токен при 401)
  useEffect(() => {
    api
      .get<{ id: number }>("/users/userid/")
      .then((res) => setUserId(String(res.data.id)))
      .catch((err) => console.error("Не удалось получить user_id:", err));
  }, []);

  // Monkey‑patch fetch для подстановки и автоматического рефреша JWT
  useEffect(() => {
    const originalFetch = window.fetch.bind(window);
    window.fetch = async (input, init: RequestInit = {}) => {
      // Подстановка accessToken из localStorage
      const token = localStorage.getItem("accessToken");
      init.headers = {
        ...(init.headers || {}),
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      };

      let response = await originalFetch(input, init);

      // При 401 — пробуем обновить токен
      if (response.status === 401) {
        try {
          const refreshToken = localStorage.getItem("refreshToken");
          const refreshRes = await originalFetch(
            "http://127.0.0.1:8000/api/v1/token/refresh/",
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ refresh: refreshToken }),
            },
          );
          const data = await refreshRes.json();
          const newAccess = data.access;
          localStorage.setItem("accessToken", newAccess);

          // Повторяем исходный запрос с новым токеном
          init.headers = {
            ...(init.headers || {}),
            Authorization: `Bearer ${newAccess}`,
          };
          response = await originalFetch(input, init);
        } catch {
          // если рефреш не удался — возвращаем первоначальный response
        }
      }
      return response;
    };
    return () => {
      window.fetch = originalFetch;
    };
  }, []);

  return (
    <div className="flex flex-col items-center mb-6">
      {preview ? (
        <Image
          src={preview}
          alt="Avatar preview"
          width={128}
          height={128}
          className="rounded-full object-cover mb-2"
          priority
        />
      ) : (
        <div className="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center mb-2">
          <span className="text-gray-500">Нет фото</span>
        </div>
      )}

      <CldUploadWidget
        signatureEndpoint="http://127.0.0.1:8000/api/v1/users/avatar-signature/"
        options={{
          cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME!,
          apiKey: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY!,
          folder: userId ? `avatars/${userId}` : undefined,
          resourceType: "image",
          cropping: true,
          croppingAspectRatio: 1,
          maxFileSize: 2097152,
          clientAllowedFormats: ["jpg", "jpeg", "png"],
          transformation: "c_fill,g_face,w_200,h_200,q_auto,f_auto,r_20",
        }}
        onSuccess={(result, { widget }) => {
          const url = result.info.secure_url;
          setPreview(url);
          onUploadEnd(url);
          widget.close();
        }}
        onError={(error) => {
          console.error("Upload error:", error);
          onUploadError("Ошибка загрузки изображения");
        }}
      >
        {({ open }) => (
          <button
            onClick={() => {
              onUploadStart();
              open(); // здесь fetch(signatureEndpoint) с JWT и авто‑рефрешем
            }}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Загрузить аватар
          </button>
        )}
      </CldUploadWidget>
    </div>
  );
}
