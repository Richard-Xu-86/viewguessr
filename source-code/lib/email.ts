/**
 * Envoi de l'e-mail contenant le code d'accès à vie (via Brevo).
 *
 * Pourquoi ce fichier existe : le code d'accès n'était affiché QUE sur /merci,
 * une seule fois. Un acheteur qui fermait l'onglet avait payé sans aucun moyen
 * de récupérer son achat (/api/restore exige le code, /api/pro-status ne
 * fonctionne que sur le même réseau). D'où support manuel, remboursements et
 * litiges. On envoie donc le code par e-mail dès que le paiement est confirmé.
 *
 * Appelé depuis /api/webhook uniquement — le webhook part que l'acheteur
 * revienne sur le site ou non. Un échec d'envoi ne doit JAMAIS empêcher la
 * création de la licence : toutes les erreurs sont avalées et journalisées.
 *
 * API HTTP simple (aucun SDK) : https://developers.brevo.com/reference/sendtransacemail
 */
import { PUBLISHER } from "./publisher";

const API_KEY = process.env.BREVO_API_KEY ?? "";
const ENDPOINT = "https://api.brevo.com/v3/smtp/email";
/** Format accepté : "Nom <adresse@domaine>" ou juste "adresse@domaine". */
const FROM = process.env.EMAIL_FROM ?? `ViewGuessr <${PUBLISHER.email}>`;
const SITE_URL = "https://view-guessr.com";

export type EmailLocale = "fr" | "en";

/** Sépare "ViewGuessr <contact@x.com>" en { name, email }. */
function parseFrom(v: string): { name: string; email: string } {
  const m = v.match(/^\s*(.*?)\s*<\s*([^>]+)\s*>\s*$/);
  if (m) return { name: m[1] || "ViewGuessr", email: m[2] };
  return { name: "ViewGuessr", email: v.trim() };
}

/** "NTC7ZTQ8EDEL" -> "NTC7-ZTQ8-EDEL" (identique à l'affichage sur /merci). */
function formatCode(code: string): string {
  return code.replace(/(.{4})(.{4})(.{4})/, "$1-$2-$3");
}

const COPY = {
  fr: {
    subject: "Ton code d'accès à vie ViewGuessr",
    heading: "Merci pour ton achat !",
    intro: "Ton accès à vie à ViewGuessr est activé. Voici ton code personnel :",
    codeLabel: "Ton code d'accès à vie",
    howToTitle: "Comment l'utiliser",
    howTo: `Sur un autre navigateur ou un autre appareil, va sur ${SITE_URL}/pro puis clique sur « Déjà acheté mais non détecté ? Restaure-le » et saisis ce code.`,
    keep: "Garde cet e-mail : c'est ce code — et non ton adresse e-mail — qui débloque ton accès ailleurs.",
    cta: "Jouer maintenant",
    help: "Une question ? Réponds simplement à cet e-mail ou écris à",
  },
  en: {
    subject: "Your ViewGuessr lifetime access code",
    heading: "Thanks for your purchase!",
    intro: "Your lifetime access to ViewGuessr is active. Here is your personal code:",
    codeLabel: "Your lifetime access code",
    howToTitle: "How to use it",
    howTo: `On another browser or device, go to ${SITE_URL}/pro, click "Already purchased but not detected? Restore it" and enter this code.`,
    keep: "Keep this email: it is this code — not your email address — that unlocks your access elsewhere.",
    cta: "Play now",
    help: "Any questions? Just reply to this email, or write to",
  },
} as const;

function html(code: string, l: EmailLocale): string {
  const c = COPY[l];
  return `<!doctype html>
<html lang="${l}"><body style="margin:0;padding:24px;background:#FAF7F0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;color:#1a1a1a">
  <div style="max-width:520px;margin:0 auto;background:#fff;border:2px solid #1a1a1a;border-radius:16px;padding:32px">
    <h1 style="margin:0 0 16px;font-size:24px">${c.heading}</h1>
    <p style="margin:0 0 20px;line-height:1.6;color:#444">${c.intro}</p>

    <div style="background:#FAF7F0;border-radius:12px;padding:20px;text-align:center;margin:0 0 24px">
      <div style="font-size:11px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:#777">${c.codeLabel}</div>
      <div style="margin-top:8px;font-size:26px;font-weight:700;letter-spacing:.15em">${formatCode(code)}</div>
    </div>

    <h2 style="margin:0 0 8px;font-size:16px">${c.howToTitle}</h2>
    <p style="margin:0 0 20px;line-height:1.6;color:#444">${c.howTo}</p>
    <p style="margin:0 0 24px;line-height:1.6;color:#444;font-size:14px">${c.keep}</p>

    <a href="${SITE_URL}/play/solo" style="display:inline-block;background:#1a1a1a;color:#fff;text-decoration:none;padding:13px 26px;border-radius:12px;font-weight:700">${c.cta}</a>

    <p style="margin:28px 0 0;font-size:13px;color:#777;line-height:1.6">
      ${c.help} <a href="mailto:${PUBLISHER.email}" style="color:#777">${PUBLISHER.email}</a>.
    </p>
  </div>
</body></html>`;
}

function text(code: string, l: EmailLocale): string {
  const c = COPY[l];
  return [
    c.heading,
    "",
    c.intro,
    "",
    `  ${formatCode(code)}`,
    "",
    `${c.howToTitle}: ${c.howTo}`,
    "",
    c.keep,
    "",
    `${SITE_URL}/play/solo`,
    "",
    `${c.help} ${PUBLISHER.email}`,
  ].join("\n");
}

/**
 * Envoie le code d'accès. Ne lève jamais : renvoie true/false.
 * Sans BREVO_API_KEY, c'est un no-op silencieux (comportement d'avant).
 */
export async function sendLicenseEmail(
  to: string,
  code: string,
  locale: EmailLocale = "en"
): Promise<boolean> {
  if (!API_KEY || !to || !code) return false;
  const sender = parseFrom(FROM);
  try {
    const res = await fetch(ENDPOINT, {
      method: "POST",
      headers: {
        "api-key": API_KEY,
        "content-type": "application/json",
        accept: "application/json",
      },
      body: JSON.stringify({
        sender,
        to: [{ email: to }],
        replyTo: { email: PUBLISHER.email, name: PUBLISHER.tradingName },
        subject: COPY[locale].subject,
        htmlContent: html(code, locale),
        textContent: text(code, locale),
      }),
      cache: "no-store",
    });
    if (!res.ok) {
      console.error(
        "[email] Brevo a refusé l'envoi:",
        res.status,
        await res.text().catch(() => "")
      );
      return false;
    }
    return true;
  } catch (err) {
    console.error("[email] échec de l'envoi du code d'accès:", err);
    return false;
  }
}
