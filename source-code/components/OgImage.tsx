import { ImageResponse } from "next/og";
import { readFileSync } from "fs";
import { join } from "path";

/** Réglages partagés par opengraph-image et twitter-image. */
export const ogAlt = "ViewGuessr — Guess the YouTube Views Game";
export const ogSize = { width: 1200, height: 630 };
export const ogContentType = "image/png";

/** Logo officiel (public/logo.png) encodé en data-URI pour l'intégrer à l'image. */
function logoDataUri(): string {
  try {
    const buf = readFileSync(join(process.cwd(), "public", "logo.png"));
    return `data:image/png;base64,${buf.toString("base64")}`;
  } catch {
    return "";
  }
}

/**
 * Carte de marque minimaliste (1200×630) : UNIQUEMENT le logo + le nom, sans
 * illustration. Sert au partage et aux aperçus ; le favicon Google = même logo.
 */
export function renderBrandImage() {
  const logo = logoDataUri();
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#F2F3F8",
          fontFamily: "sans-serif",
        }}
      >
        {logo ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={logo} width={216} height={216} alt="" />
        ) : null}

        <div
          style={{
            display: "flex",
            marginTop: "40px",
            fontSize: "96px",
            fontWeight: 800,
            letterSpacing: "-0.04em",
            backgroundImage: "linear-gradient(135deg, #EF233C, #D80032)",
            backgroundClip: "text",
            WebkitBackgroundClip: "text",
            color: "transparent",
          }}
        >
          ViewGuessr
        </div>

        <div
          style={{
            display: "flex",
            marginTop: "10px",
            fontSize: "34px",
            fontWeight: 600,
            color: "#5B6478",
          }}
        >
          view-guessr.com
        </div>
      </div>
    ),
    { ...ogSize }
  );
}
