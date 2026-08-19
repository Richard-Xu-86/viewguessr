import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy policy",
  description:
    "ViewGuessr privacy policy: no account needed, data kept on your device, what multiplayer and payment involve, and how to reach us.",
  alternates: { canonical: "/confidentialite" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
