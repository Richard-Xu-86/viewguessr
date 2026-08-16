"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Logo } from "@/components/Logo";
import { Button } from "@/components/Buttons";
import { ResetCountdown } from "@/components/ResetCountdown";
import { useT } from "@/lib/i18n";

// Écran affiché quand un joueur gratuit atteint une limite ou tente d'accéder à
// une fonctionnalité réservée à l'accès à vie.
export function PaywallNotice({
  title,
  message,
  showReset = false,
}: {
  title: string;
  message: string;
  showReset?: boolean;
}) {
  const t = useT();
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      className="mx-auto flex min-h-[60vh] max-w-md flex-col items-center justify-center text-center"
    >
      <div className="w-full rounded-2xl glass-strong p-8">
        <div className="mx-auto mb-5 w-fit">
          <Logo size={52} />
        </div>
        <h1 className="font-display text-2xl font-bold text-platinum">{title}</h1>
        <p className="mt-3 text-lavender">{message}</p>
        {showReset && (
          <p className="mt-4 text-sm font-medium text-strawberry">
            <ResetCountdown prefix={t("paywall.renewIn")} />
          </p>
        )}
        <div className="mt-7 flex flex-col gap-3">
          <Link href="/pro">
            <Button className="w-full py-3.5">{t("paywall.toLife")}</Button>
          </Link>
          <Link href="/">
            <Button variant="glass" className="w-full py-3.5">
              {t("common.backToHome")}
            </Button>
          </Link>
        </div>
      </div>
    </motion.div>
  );
}
