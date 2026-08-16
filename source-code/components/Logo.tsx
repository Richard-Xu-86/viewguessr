"use client";

// Logo ViewGuessr image officielle, identique au pixel près à celle de l'app iOS
// (même fichier AppLogo.png). Le PNG contient déjà la tuile blanche arrondie.
export function Logo({ size = 44 }: { size?: number; tile?: boolean }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src="/logo.png"
      alt="ViewGuessr"
      width={size}
      height={size}
      draggable={false}
      className="select-none"
      style={{ width: size, height: size }}
    />
  );
}

export function Wordmark({ className = "" }: { className?: string }) {
  return (
    <span className={`font-display font-bold tracking-tight ${className}`}>
      View<span className="text-strawberry">Guessr</span>
    </span>
  );
}
