"use client";

// Fond « papier » de ViewGuessr (DA print) : crème + pointillés discrets.
// 100 % CSS et STATIQUE (aucune animation, aucun flou) → aucun impact perf.
export function Aurora() {
  return (
    <div
      className="pointer-events-none fixed inset-0 -z-10"
      style={{ background: "#FAF7F0" }}
    >
      <div
        className="absolute inset-0 opacity-60"
        style={{
          backgroundImage:
            "radial-gradient(rgba(21,23,31,0.07) 1px, transparent 1px)",
          backgroundSize: "22px 22px",
          maskImage:
            "radial-gradient(ellipse 90% 70% at 50% 0%, #000 30%, transparent 100%)",
          WebkitMaskImage:
            "radial-gradient(ellipse 90% 70% at 50% 0%, #000 30%, transparent 100%)",
        }}
      />
    </div>
  );
}
