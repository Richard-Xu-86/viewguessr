"use client";

import { YTVideo } from "@/lib/types";
import { useT, useLocale, compactViewsL } from "@/lib/i18n";

export function VideoThumb({
  video,
  showQuestion = false,
}: {
  video: YTVideo;
  showQuestion?: boolean;
}) {
  const t = useT();
  const { locale } = useLocale();
  const subs =
    typeof video.subscriberCount === "number" && video.subscriberCount > 0
      ? `${compactViewsL(video.subscriberCount, locale)} ${t("pm.subs")}`
      : null;

  return (
    <div className="overflow-hidden rounded-2xl glass-strong">
      <div className="relative aspect-video max-h-[34vh] w-full bg-black/80">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={video.thumbnailURL}
          alt={video.title}
          className="h-full w-full object-contain"
          loading="eager"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        {showQuestion && (
          <div className="absolute bottom-3 right-3 rounded-full bg-black/70 px-3 py-1 text-sm font-bold text-strawberry backdrop-blur">
            ? {t("common.views")}
          </div>
        )}
      </div>
      <div className="px-4 py-3">
        <h3 className="line-clamp-1 text-base font-bold leading-snug text-platinum">
          {video.title}
        </h3>
        {/* Chaîne + nombre d'abonnés : un indice de plus pour estimer les vues. */}
        <div className="mt-1.5 flex items-center gap-2">
          {video.channelThumb ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={video.channelThumb}
              alt=""
              width={20}
              height={20}
              className="h-5 w-5 flex-shrink-0 rounded-full bg-black/10 object-cover"
              loading="lazy"
            />
          ) : (
            <span className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-black/[0.07] text-[10px] font-bold uppercase text-lavender">
              {(video.channel[0] ?? "?").toUpperCase()}
            </span>
          )}
          <p className="min-w-0 truncate text-sm font-medium text-lavender">
            {video.channel}
            {subs && (
              <span className="text-lavender/80">
                {" "}
                · <span className="font-semibold text-platinum/80">{subs}</span>
              </span>
            )}
          </p>
        </div>
      </div>
    </div>
  );
}
