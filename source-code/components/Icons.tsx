// Icônes SVG line propres et neutres (remplacent les emojis).
import type { ReactNode } from "react";

type Props = { name: string; className?: string };

const paths: Record<string, ReactNode> = {
  target: (
    <>
      <circle cx="12" cy="12" r="9" />
      <circle cx="12" cy="12" r="5" />
      <circle cx="12" cy="12" r="1.4" fill="currentColor" stroke="none" />
    </>
  ),
  bolt: <path d="M13 2 4 14h7l-1 8 9-12h-7l1-8Z" />,
  grid: (
    <>
      <rect x="3" y="3" width="7.5" height="7.5" rx="1.5" />
      <rect x="13.5" y="3" width="7.5" height="7.5" rx="1.5" />
      <rect x="3" y="13.5" width="7.5" height="7.5" rx="1.5" />
      <rect x="13.5" y="13.5" width="7.5" height="7.5" rx="1.5" />
    </>
  ),
  users: (
    <>
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </>
  ),
  monitor: (
    <>
      <rect x="3" y="4" width="18" height="12" rx="2" />
      <line x1="8" y1="20" x2="16" y2="20" />
      <line x1="12" y1="16" x2="12" y2="20" />
    </>
  ),
  sliders: (
    <>
      <line x1="4" y1="9" x2="20" y2="9" />
      <circle cx="9" cy="9" r="2.3" fill="currentColor" stroke="none" />
      <line x1="4" y1="15" x2="20" y2="15" />
      <circle cx="15" cy="15" r="2.3" fill="currentColor" stroke="none" />
    </>
  ),
  award: (
    <>
      <circle cx="12" cy="8" r="5" />
      <path d="M9 12.5 8 21l4-2.2L16 21l-1-8.5" />
    </>
  ),
  video: (
    <>
      <rect x="2" y="6" width="14" height="12" rx="2" />
      <path d="M16 10.5 21 7.5v9l-5-3Z" />
    </>
  ),
  sparkle: <path d="M12 3l1.9 4.7L18.6 9.6l-4.7 1.7L12 16l-1.9-4.7L5.4 9.6l4.7-1.9L12 3Z" />,
  play: <path d="M7 4.5 19 12 7 19.5Z" fill="currentColor" stroke="none" />,
};

export function Icon({ name, className = "h-6 w-6" }: Props) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {paths[name] ?? null}
    </svg>
  );
}
