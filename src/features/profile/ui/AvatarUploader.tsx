"use client";

import React, { useState } from "react";
import Image from "next/image";
import { CldUploadWidget } from "next-cloudinary";
import api from "src/shared/lib/axios";

interface SignatureParams {
  signature: string;
  timestamp: number;
  folder: string;
}

export default function AvatarUploader({
  avatarUrl,
  onUploadStart,
  onUploadEnd,
  onUploadError,
}: {
  avatarUrl?: string;
  onUploadStart: () => void;
  onUploadEnd: (url: string) => void;
  onUploadError: (error: string) => void;
}) {
  const [preview, setPreview] = useState<string | undefined>(avatarUrl);
  const [signParams, setSignParams] = useState<SignatureParams | null>(null);

  // 1) Запрашиваем подпись у своего бэкенда через api (интерцепторы добавят JWT)
  const prepareUpload = async () => {
    try {
      onUploadStart();
      const { data } = await api.get<SignatureParams>(
        "/users/avatar-signature/",
      );
      setSignParams(data);
    } catch (err: any) {
      console.error("Signature fetch error:", err);
      onUploadError("Не удалось получить подпись для загрузки");
    }
  };

  return (
    <div className="flex flex-col items-center mb-6">
      {/* Превью аватара */}
      {preview ? (
        <Image
          src={preview}
          alt="Avatar preview"
          width={200}
          height={200}
          className="rounded-full border-2 object-cover mb-2"
          priority
        />
      ) : (
        <div className="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center mb-2">
          <span className="text-gray-500">Нет фото</span>
        </div>
      )}

      {/* 2) Если подписи нет — кнопка «Подготовить загрузку» */}
      {!signParams ? (
        <button
          onClick={prepareUpload}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Подготовить загрузку
        </button>
      ) : (
        /* 3) Если подпись есть — рендерим виджет с переданными параметрами */
        <CldUploadWidget
          uploadPreset="samevibe"
          options={{
            cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME!,
            apiKey: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY!,
            folder: signParams.folder,
            uploadSignature: signParams.signature,
            uploadSignatureTimestamp: signParams.timestamp,
            resourceType: "image",
            cropping: true,
            croppingAspectRatio: 1,
            maxFileSize: 2097152 * 2,
            clientAllowedFormats: ["jpg", "jpeg", "png"],
          }}
          onSuccess={(result, { widget }) => {
            const url = result.info.secure_url;
            setPreview(url);
            onUploadEnd(url);
            widget.close();
            setSignParams(null);
          }}
          onError={(error) => {
            console.error("Upload error:", error);
            onUploadError("Ошибка загрузки изображения");
            setSignParams(null);
          }}
        >
          {({ open }) => (
            <button
              onClick={() => {
                onUploadStart();
                open();
              }}
              className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
              type="button"
            >
              Загрузить
            </button>
          )}
        </CldUploadWidget>
      )}
    </div>
  );
}
