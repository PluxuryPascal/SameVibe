import React from "react";
import Image from "next/image";

interface SearchResultCardProps {
  name: string;
  description: string;
  avatar?: string;
}

export default function SearchResultCard({
  name,
  description,
  avatar,
}: SearchResultCardProps) {
  return (
    <div className="flex items-center p-4 bg-white rounded shadow mb-4 cursor-pointer hover:bg-gray-50 transition-colors">
      <div className="relative w-16 h-16">
        <Image
          src={avatar || "/assets/profile-placeholder.png"}
          alt={name}
          width={64}
          height={64}
          className="rounded-full"
        />
      </div>
      <div className="ml-4">
        <h3 className="text-xl font-semibold">{name}</h3>
        <p className="text-gray-600">{description}</p>
      </div>
    </div>
  );
}
