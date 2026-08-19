import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service",
  description:
    "ViewGuessr terms of service: free play with no sign-up, optional one-time lifetime access at CA$5.99, delivery, refunds and liability.",
  alternates: { canonical: "/cgu" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
