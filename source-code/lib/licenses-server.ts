// Helper SERVEUR pour les codes d'accès à vie (table Supabase `licenses`).
// Utilisé par /api/verify (retour navigateur) ET /api/webhook (notification Stripe)
// → la licence est créée de façon fiable, quel que soit le chemin.
import { randomBytes } from "crypto";

const SUPA_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY ?? "";
const CODE_ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // sans 0/O ni 1/I

function svcHeaders(prefer?: string): Record<string, string> {
  const h: Record<string, string> = {
    apikey: SERVICE_KEY,
    Authorization: `Bearer ${SERVICE_KEY}`,
    "Content-Type": "application/json",
  };
  if (prefer) h.Prefer = prefer;
  return h;
}

function genCode(): string {
  const b = randomBytes(12);
  let s = "";
  for (let i = 0; i < 12; i++) s += CODE_ALPHABET[b[i] % CODE_ALPHABET.length];
  return s;
}

/** Récupère le code d'accès lié à une session payée, ou le crée (idempotent). */
export async function getOrCreateLicenseCode(
  sessionId: string
): Promise<string | null> {
  if (!SUPA_URL || !SERVICE_KEY) return null;
  const base = `${SUPA_URL}/rest/v1/licenses`;
  try {
    const g = await fetch(
      `${base}?session_id=eq.${encodeURIComponent(sessionId)}&select=code`,
      { headers: svcHeaders(), cache: "no-store" }
    );
    const rows = g.ok ? await g.json() : [];
    if (Array.isArray(rows) && rows[0]?.code) return rows[0].code as string;

    const code = genCode();
    await fetch(`${base}?on_conflict=session_id`, {
      method: "POST",
      headers: svcHeaders("resolution=ignore-duplicates,return=minimal"),
      body: JSON.stringify([{ session_id: sessionId, code }]),
    });
    // Relit le code autoritatif (au cas où une requête concurrente a écrit avant).
    const g2 = await fetch(
      `${base}?session_id=eq.${encodeURIComponent(sessionId)}&select=code`,
      { headers: svcHeaders(), cache: "no-store" }
    );
    const rows2 = g2.ok ? await g2.json() : [];
    return Array.isArray(rows2) && rows2[0]?.code
      ? (rows2[0].code as string)
      : code;
  } catch {
    return null;
  }
}
