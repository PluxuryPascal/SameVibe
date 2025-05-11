"use client";

import React, { useRef, useState, useEffect } from "react";
import { CldUploadWidget, CldUploadWidgetProps } from "next-cloudinary";
import { fetchAttachmentSignature } from "../api/signature";

interface AttachmentUploaderProps {
  chatId: number;
  onUploadStart: () => void;
  onUploadEnd: (url: string, resourceType: string) => void;
  onUploadError: (err: string) => void;
  resetSignal: number;
}

export default function AttachmentUploader({
  chatId,
  onUploadStart,
  onUploadEnd,
  onUploadError,
  resetSignal,
}: AttachmentUploaderProps) {
  const openRef = useRef<() => void>();
  const [attached, setAttached] = useState<{
    url: string;
    type: string;
  } | null>(null);

  // Reset attached when parent signals
  useEffect(() => {
    setAttached(null);
  }, [resetSignal]);

  // onSuccess handler
  const handleSuccess: CldUploadWidgetProps["onSuccess"] = (result) => {
    const info = result.info;
    setAttached({ url: info.secure_url, type: info.resource_type });
    onUploadEnd(info.secure_url, info.resource_type);
  };

  // Click “Attach” -> open widget
  const onAttachClick = () => {
    onUploadStart();
    openRef.current?.();
  };

  return (
    <div className="relative inline-block">
      {attached ? (
        <div className="w-10 h-10 flex items-center justify-center bg-green-300 rounded-full mr-2">
          📎
        </div>
      ) : (
        <button
          onClick={onAttachClick}
          className="w-10 h-10 flex items-center justify-center bg-gray-200 rounded mr-2"
          type="button"
        >
          📎
        </button>
      )}

      {/* Always mounted, captures `open()` immediately on mount */}
      <CldUploadWidget
        uploadPreset="chat_attachments"
        options={{
          cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME!,
          apiKey: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY!,
          resourceType: "auto",
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
        // Called just before upload: fetch your signature
        prepareUploadParams={async (callback, { file }) => {
          try {
            const { signature, timestamp, folder } =
              await fetchAttachmentSignature(chatId);
            callback({ signature, timestamp, folder });
          } catch {
            onUploadError("Не удалось получить подпись");
          }
        }}
        onSuccess={handleSuccess}
        onError={() => onUploadError("Ошибка загрузки")}
      >
        {({ open }) => {
          openRef.current = open;
          return null;
        }}
      </CldUploadWidget>
    </div>
  );
}
