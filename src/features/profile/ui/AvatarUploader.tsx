import React from "react";
import Image from "next/image";

interface AvatarUploaderProps {
  avatarUrl?: string;
  onFileChange: (file: File | null) => void;
}

export default function AvatarUploader({
  avatarUrl,
  onFileChange,
}: AvatarUploaderProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onFileChange(e.target.files[0]);
    }
  };

  return (
    <div className="flex flex-col items-center mb-6">
      {avatarUrl ? (
        <Image
          src={avatarUrl}
          alt="Avatar"
          className="w-32 h-32 rounded-full mb-2"
        />
      ) : (
        <div className="w-32 h-32 rounded-full bg-gray-300 flex items-center justify-center mb-2">
          <span className="text-gray-600">Нет фото</span>
        </div>
      )}
      <input
        type="file"
        accept="image/*"
        onChange={handleChange}
        className="mb-2"
      />
    </div>
  );
}
