import React from "react";
import Link from "next/link";
import Logo from "src/components/ui/Logo";
import Button from "src/components/ui/Button";
import "bootstrap/dist/css/bootstrap.min.css";
import { useTranslations } from "next-intl";

export default function HomePage() {
  const t = useTranslations("");
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4">
      <Logo width={500} height={500} />
      <h1 className="text-3xl font-bold mb-8">{t("home_title")}</h1>
      <div className=" flex  items-center justify-center space-x-4 w-full max-w-xs ">
        <Link href="/auth/login" className="flex-1 " passHref>
          <Button>{t("home_login")}</Button>
        </Link>
        <Link href="/auth/register" className="flex-1 " passHref>
          <Button>{t("home_register")}</Button>
        </Link>
      </div>
    </div>
  );
}
