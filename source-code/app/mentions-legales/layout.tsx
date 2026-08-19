import type { Metadata } from "next";
import { PUBLISHER } from "@/lib/publisher";

export const metadata: Metadata = {
  title: "Legal notice",
  description: `Legal notice for ${PUBLISHER.tradingName}: publisher, hosting, intellectual property and contact.`,
  alternates: { canonical: "/mentions-legales" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
