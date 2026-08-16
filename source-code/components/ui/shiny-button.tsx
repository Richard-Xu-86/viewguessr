"use client";

// ShinyButton (inspiré de Magic UI / dillionverma), adapté à ViewGuessr :
// pas de dépendance `cn`, et la couleur d'accent shadcn `--primary` est
// remplacée par le rouge « strawberry » du thème. Préfixes -webkit-* ajoutés
// pour que le balayage brillant fonctionne aussi sur Safari.

import { motion, type AnimationProps } from "framer-motion";
import React from "react";

const animationProps = {
  initial: { "--x": "100%", scale: 0.8 },
  animate: { "--x": "-100%", scale: 1 },
  whileTap: { scale: 0.95 },
  transition: {
    repeat: Infinity,
    repeatType: "loop",
    repeatDelay: 1,
    type: "spring",
    stiffness: 20,
    damping: 15,
    mass: 2,
    scale: {
      type: "spring",
      stiffness: 200,
      damping: 5,
      mass: 0.5,
    },
  },
} as AnimationProps;

interface ShinyButtonProps
  extends React.ComponentPropsWithoutRef<typeof motion.button> {
  children: React.ReactNode;
  className?: string;
}

export const ShinyButton = React.forwardRef<
  HTMLButtonElement,
  ShinyButtonProps
>(({ children, className = "", ...props }, ref) => {
  return (
    <motion.button
      ref={ref}
      className={`relative rounded-2xl border border-strawberry/30 bg-strawberry/[0.06] px-7 py-3.5 font-medium backdrop-blur-xl transition-shadow duration-300 ease-in-out hover:shadow-[0_0_22px_rgba(239,35,60,0.22)] ${className}`}
      {...animationProps}
      {...props}
    >
      <span
        className="relative block h-full w-full text-sm uppercase tracking-wide text-strawberry"
        style={{
          WebkitMaskImage:
            "linear-gradient(-75deg,#EF233C calc(var(--x) + 20%),transparent calc(var(--x) + 30%),#EF233C calc(var(--x) + 100%))",
          maskImage:
            "linear-gradient(-75deg,#EF233C calc(var(--x) + 20%),transparent calc(var(--x) + 30%),#EF233C calc(var(--x) + 100%))",
        }}
      >
        {children}
      </span>
      <span
        style={{
          WebkitMask:
            "linear-gradient(rgb(0,0,0), rgb(0,0,0)) content-box, linear-gradient(rgb(0,0,0), rgb(0,0,0))",
          WebkitMaskComposite: "xor",
          mask: "linear-gradient(rgb(0,0,0), rgb(0,0,0)) content-box, linear-gradient(rgb(0,0,0), rgb(0,0,0))",
          maskComposite: "exclude",
        }}
        className="absolute inset-0 z-10 block rounded-[inherit] bg-[linear-gradient(-75deg,rgba(239,35,60,0.1)_calc(var(--x)+20%),rgba(239,35,60,0.5)_calc(var(--x)+25%),rgba(239,35,60,0.1)_calc(var(--x)+100%))] p-px"
      />
    </motion.button>
  );
});

ShinyButton.displayName = "ShinyButton";
