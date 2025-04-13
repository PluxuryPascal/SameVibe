"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { CldUploadWidget } from "next-cloudinary";
import { useQuery } from "@tanstack/react-query";
import api from "src/shared/lib/axios";

interface SignatureParams {
  signature: string;
  timestamp: number;
  folder: string;
  cloud_name: string; // Важно: точное совпадение с названием поля из API
  api_key: string;
  transformation: string;
}

interface AvatarUploaderProps {
  avatarUrl?: string;
  onUploadStart: () => void;
  onUploadEnd: (url: string) => void;
  onUploadError: (error: string) => void;
}

export default function AvatarUploader({
  avatarUrl,
  onUpload,
}: AvatarUploaderProps) {
  const [preview, setPreview] = useState<string | undefined>(avatarUrl);
  const [widgetOpen, setWidgetOpen] = useState(false);

  const {
    data: signParams,
    refetch: fetchSignature,
    isFetching: signing,
    error: signatureError,
  } = useQuery<SignatureParams>({
    queryKey: ["avatar-signature"],
    queryFn: async () => {
      const token = localStorage.getItem("accessToken");
      const res = await api.get<SignatureParams>("/users/avatar-signature/", {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log("Received signature params:", res.data); // Добавлено логирование
      return res.data;
    },
    enabled: false,
    retry: false,
  });

  useEffect(() => {
    if (signatureError) {
      console.error("Signature error:", signatureError);
      alert("Ошибка подготовки загрузки");
      setWidgetOpen(false);
    }
  }, [signatureError]);

  const handleUploadClick = () => {
    if (!widgetOpen) {
      fetchSignature();
      setWidgetOpen(true);
    }
  };

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

      <button
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
        onClick={handleUploadClick}
        disabled={signing}
      >
        {signing ? "Подготавливаем..." : "Загрузить аватар"}
      </button>

      {signParams && widgetOpen && (
        <CldUploadWidget
          options={{
            cloudName: signParams.cloud_name, // Используем поле из API ответа
            apiKey: signParams.api_key,
            uploadSignature: signParams.signature,
            uploadSignatureTimestamp: signParams.timestamp,
            folder: signParams.folder,
            cropping: true,
            croppingAspectRatio: 1,
            showAdvancedOptions: false,
            resourceType: "image",
            maxFileSize: 2097152,
            clientAllowedFormats: ["jpg", "jpeg", "png"],
            transformation: signParams.transformation,
          }}
          onSuccess={(result) => {
            const info = result.info as { secure_url?: string };
            if (info?.secure_url) {
              setPreview(info.secure_url);
              onUpload(info.secure_url);
            }
            setWidgetOpen(false);
          }}
          onError={(error) => {
            console.error("Upload error:", error);
            alert("Ошибка загрузки изображения");
            setWidgetOpen(false);
          }}
          onClose={() => setWidgetOpen(false)}
        >
          {({ open }) => {
            useEffect(() => {
              if (signParams && widgetOpen) {
                try {
                  // Добавляем проверку наличия обязательных полей
                  if (
                    !signParams.cloud_name ||
                    !signParams.api_key ||
                    !signParams.signature
                  ) {
                    throw new Error("Missing Cloudinary credentials");
                  }
                  open();
                } catch (error) {
                  console.error("Widget open error:", error);
                  setWidgetOpen(false);
                }
              }
            }, [signParams, widgetOpen, open]);

            return null;
          }}
        </CldUploadWidget>
      )}
    </div>
  );
}
