import React from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";

export interface FriendCardProps {
  name: string;
  avatar?: string;
  /**
   * Тип заявки:
   * - incoming: входящая заявка (от другого пользователя)
   * - outgoing: исходящая заявка (от текущего пользователя)
   * - accepted: уже друзья
   */
  friendshipType: "incoming" | "outgoing" | "accepted";
  /**
   * Вызывается при принятии входящей заявки (только для incoming)
   */
  onAccept?: () => void;
  /**
   * Вызывается при отклонении входящей заявки или отмене исходящей заявки,
   * а также при удалении друга (для accepted)
   */
  onRejectOrCancel?: () => void;
  /**
   * Вызывается при нажатии на кнопку «Написать» (только для accepted)
   */
  onWrite?: () => void;
}

export default function FriendCard({
  name,
  avatar,
  friendshipType,
  onAccept,
  onRejectOrCancel,
  onWrite,
}: FriendCardProps) {
  const t = useTranslations("");

  return (
    <div className="flex items-center p-4 bg-white rounded shadow mb-4">
      <div className="relative w-16 h-16">
        <Image
          src={avatar || "/assets/profile-placeholder.png"}
          alt={name}
          width={64}
          height={64}
          className="rounded-full"
        />
        <span
        // className={`absolute bottom-0 right-0 w-4 h-4 rounded-full border-2 border-white ${
        //   status === "online" ? "bg-green-500" : "bg-gray-500"
        // }`}
        />
      </div>
      <div className="ml-4">
        <h3 className="text-xl font-semibold">{name}</h3>
        {/* <p className="text-sm text-gray-600">
          {status === "online" ? "Онлайн" : "Оффлайн"}
        </p> */}
      </div>
      <div className="ml-auto flex flex-col items-end space-y-2">
        {friendshipType === "incoming" && (
          <>
            <button
              onClick={onAccept}
              className="text-blue-500 hover:underline"
            >
              {t("friends_button_accept")}
            </button>
            <button
              onClick={onRejectOrCancel}
              className="text-red-500 hover:underline"
            >
              {t("friends_button_reject")}
            </button>
          </>
        )}
        {friendshipType === "outgoing" && (
          <button
            onClick={onRejectOrCancel}
            className="text-red-500 hover:underline"
          >
            {t("friends_button_cancel")}
          </button>
        )}
        {friendshipType === "accepted" && (
          <>
            <button onClick={onWrite} className="text-blue-500 hover:underline">
              {t("friends_button_write")}
            </button>
            <button
              onClick={onRejectOrCancel}
              className="text-red-500 hover:underline"
            >
              {t("friends_button_remove")}
            </button>
          </>
        )}
      </div>
    </div>
  );
}
