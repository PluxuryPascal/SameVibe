import { redirect } from "next/navigation";

export default function Page() {
  // Перенаправить на defaultLocale
  redirect("/ru");
}
