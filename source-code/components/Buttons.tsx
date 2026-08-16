"use client";

import { motion } from "framer-motion";
import { ButtonHTMLAttributes, forwardRef } from "react";

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "glass" | "ghost";
};

const base =
  "group/btn relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-2xl font-bold transition-all disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus-visible:ring-2 focus-visible:ring-strawberry/60";

// DA « print » : encre + ombres dures (cohérent avec la landing).
const variants: Record<string, string> = {
  primary:
    "border-2 border-platinum bg-platinum text-white shadow-[4px_4px_0_0_#D80032] hover:shadow-[6px_6px_0_0_#D80032]",
  glass:
    "border-2 border-platinum bg-white text-platinum shadow-[4px_4px_0_0_#15171F] hover:bg-[#FAF7F0] hover:shadow-[6px_6px_0_0_#15171F]",
  ghost: "text-lavender hover:text-platinum",
};

export const Button = forwardRef<HTMLButtonElement, Props>(function Button(
  { variant = "primary", className = "", children, ...rest },
  ref
) {
  return (
    <motion.button
      ref={ref}
      whileTap={{ scale: 0.96 }}
      whileHover={{ scale: 1.03 }}
      transition={{ type: "spring", stiffness: 400, damping: 22 }}
      className={`${base} ${variants[variant]} ${className}`}
      {...(rest as any)}
    >
      <span className="relative z-10 inline-flex items-center gap-2">
        {children}
      </span>
    </motion.button>
  );
});

// Carte cliquable avec enfoncement tactile.
export function PressableCard({
  onClick,
  className = "",
  children,
}: {
  onClick?: () => void;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <motion.button
      onClick={onClick}
      whileTap={{ scale: 0.97 }}
      whileHover={{ scale: 1.015 }}
      transition={{ type: "spring", stiffness: 380, damping: 24 }}
      className={`relative block w-full rounded-3xl text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-strawberry/60 ${className}`}
    >
      {children}
    </motion.button>
  );
}
