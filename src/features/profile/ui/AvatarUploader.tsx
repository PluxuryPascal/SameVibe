"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { CldUploadWidget } from "next-cloudinary";

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

  // userId берётся из localStorage
  const userId =
    typeof window !== "undefined"
      ? localStorage.getItem("currentUserId") || ""
      : "";

  // 1) Патчим глобальный fetch и window.fetch
  useEffect(() => {
    const originalFetch = globalThis.fetch;
    const patchedFetch = async (input: RequestInfo, init: RequestInit = {}) => {
      // каждый раз читаем актуальный токен из localStorage
      const token = localStorage.getItem("accessToken") || "";

      init.credentials = "same-origin"; // для куки, если понадобятся
      init.headers = {
        ...(init.headers || {}),
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      };

      return originalFetch(input, init);
    };

    globalThis.fetch = patchedFetch;
    window.fetch = patchedFetch;
    return () => {
      globalThis.fetch = originalFetch;
      window.fetch = originalFetch;
    };
  }, []);

  return (
    <div className="flex flex-col items-center mb-6">
      {/* 2) Превью */}
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

      {/* 3) Виджет */}
      {userId && (
        <CldUploadWidget
          signatureEndpoint="/api/avatar-signature"
          options={{
            cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME!,
            apiKey: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY!,
            folder: `avatars/${userId}`,
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
          onError={(err) => {
            console.error("Upload error:", err);
            onUploadError("Ошибка загрузки изображения");
          }}
        >
          {({ open }) => (
            <button
              onClick={() => {
                onUploadStart();
                open(); // внутри будет fetch("/api/avatar-signature", ...)
              }}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Загрузить аватар
            </button>
          )}
        </CldUploadWidget>
      )}
    </div>
  );
}
