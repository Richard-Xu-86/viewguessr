import { redirect } from "next/navigation";

// Le mode Thèmes a été retiré on redirige vers l'accueil.
export default function ThemesRemoved() {
  redirect("/");
}
