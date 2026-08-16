"use client";

// Fond ambiant dégradé sombre + halos rouges flottants (subtils, pas de particules).
export function Background() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-space-deep">
      <div
        className="absolute -left-32 -top-32 h-[42rem] w-[42rem] rounded-full opacity-30 blur-[120px] animate-drift"
        style={{
          background:
            "radial-gradient(circle, rgba(216,0,50,0.55) 0%, rgba(216,0,50,0) 70%)",
        }}
      />
      <div
        className="absolute -bottom-40 -right-24 h-[38rem] w-[38rem] rounded-full opacity-25 blur-[120px] animate-drift"
        style={{
          animationDelay: "4s",
          background:
            "radial-gradient(circle, rgba(239,35,60,0.5) 0%, rgba(239,35,60,0) 70%)",
        }}
      />
      <div
        className="absolute left-1/2 top-1/3 h-[30rem] w-[30rem] -translate-x-1/2 rounded-full opacity-15 blur-[140px]"
        style={{
          background:
            "radial-gradient(circle, rgba(141,153,174,0.4) 0%, rgba(141,153,174,0) 70%)",
        }}
      />
      {/* Grain léger pour la profondeur */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            "radial-gradient(rgba(255,255,255,0.6) 1px, transparent 1px)",
          backgroundSize: "3px 3px",
        }}
      />
    </div>
  );
}
