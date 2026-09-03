import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Daily challenge",
  description:
    "The ViewGuessr daily challenge: 5 YouTube videos, the same for everyone, one attempt per day. Beat your score, keep your streak and share your result.",
  alternates: { canonical: "/defi" },
};

export default function DefiLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
