import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "My dashboard",
  description:
    "Your ViewGuessr dashboard: profile, stats, today's free games and resuming a multiplayer game.",
  robots: { index: false, follow: false },
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
