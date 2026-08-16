import { redirect } from "next/navigation";

// Le mode Blitz a été retiré de ViewGuessr — on redirige vers l'accueil.
export default function BlitzRemoved() {
  redirect("/");
}
