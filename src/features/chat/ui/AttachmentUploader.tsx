"use client";
import React, { useState } from "react";
import { CldUploadWidget } from "next-cloudinary";
import { fetchAttachmentSignature, SignatureParams } from "../api/signature";

interface AttachmentUploaderProps {
  chatId: number;
  onUploadStart: () => void;
  onUploadEnd: (url: string, resourceType: string) => void;
  onUploadError: (err: string) => void;
}

export default function AttachmentUploader({
  chatId,
  onUploadStart,
  onUploadEnd,
  onUploadError,
}: AttachmentUploaderProps) {
  const [signParams, setSignParams] = useState<SignatureParams | null>(null);

  const prepareUpload = async () => {
    onUploadStart();
    try {
      const params = await fetchAttachmentSignature(chatId);
      setSignParams(params);
    } catch {
      onUploadError("Не удалось получить подпись");
    }
  };

  // Если подписи нет — показываем кнопку подготовки
  if (!signParams) {
    return (
      <button onClick={prepareUpload} className="px-2 py-1 bg-gray-200 rounded">
        📎 Прикрепить файл
      </button>
    );
  }

  return (
    <CldUploadWidget
      uploadPreset="chat_attachments"
      options={{
        cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME!,
        apiKey: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY!,
        folder: signParams.folder,
        uploadSignature: signParams.signature,
        uploadSignatureTimestamp: signParams.timestamp,
        resourceType: "auto", // auto позволит загружать image/video/raw :contentReference[oaicite:4]{index=4}
        clientAllowedFormats: [
          "jpg",
          "jpeg",
          "png",
          "mp4",
          "webm",
          "pdf",
          "docx",
        ],
        maxFileSize: 50_000_000,
      }}
      onSuccess={(result) => {
        const info = result.info;
        onUploadEnd(info.secure_url, info.resource_type);
        setSignParams(null);
      }}
      onError={() => {
        onUploadError("Ошибка загрузки");
        setSignParams(null);
      }}
    >
      {({ open }) => (
        <button onClick={open} className="px-2 py-1 bg-blue-200 rounded ml-2">
          Выбрать файл
        </button>
      )}
    </CldUploadWidget>
  );
}
