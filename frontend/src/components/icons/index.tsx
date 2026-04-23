// src/components/icons/index.tsx
// Unified SVG icon system for WattWatch.
// All icons use a 24×24 viewBox, consistent 2px stroke, round caps.
// Props: size (default 20), color (default "currentColor"), style, className, onClick, title.

import React from "react";

export interface IconProps {
  size?: number;
  color?: string;
  style?: React.CSSProperties;
  className?: string;
  onClick?: React.MouseEventHandler<SVGSVGElement>;
  title?: string;
}

function base(
  props: IconProps,
  children: React.ReactNode
): React.ReactElement {
  const { size = 20, color = "currentColor", style, className, onClick, title } = props;
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="none"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ flexShrink: 0, ...style }}
      className={className}
      onClick={onClick}
      aria-hidden={title ? undefined : true}
      role={title ? "img" : undefined}
    >
      {title && <title>{title}</title>}
      {children}
    </svg>
  );
}

// ── Chevrons ────────────────────────────────────────────────────────────────

export const ChevronDownIcon: React.FC<IconProps> = (p) =>
  base(p, <path d="M6 9l6 6 6-6" />);

export const ChevronUpIcon: React.FC<IconProps> = (p) =>
  base(p, <path d="M18 15l-6-6-6 6" />);

export const ChevronLeftIcon: React.FC<IconProps> = (p) =>
  base(p, <path d="M15 6l-6 6 6 6" />);

export const ChevronRightIcon: React.FC<IconProps> = (p) =>
  base(p, <path d="M9 6l6 6-6 6" />);

// ── Actions ─────────────────────────────────────────────────────────────────

export const PlusIcon: React.FC<IconProps> = (p) =>
  base(p, <path d="M12 5v14M5 12h14" />);

export const CloseIcon: React.FC<IconProps> = (p) =>
  base(p, <path d="M6 6l12 12M18 6L6 18" />);

export const UploadIcon: React.FC<IconProps> = (p) =>
  base(
    p,
    <>
      <path d="M12 3v13" />
      <path d="M8 8l4-5 4 5" />
      <path d="M3 18v2a1 1 0 0 0 1 1h16a1 1 0 0 0 1-1v-2" />
    </>
  );

// ── Media / event controls ───────────────────────────────────────────────────

export const PlayIcon: React.FC<IconProps> = (p) => {
  const { color = "currentColor", ...rest } = p;
  return base(
    { ...rest, color },
    <>
      <circle cx="12" cy="12" r="10" />
      <polygon
        points="9.5,8 9.5,16 17,12"
        fill={color}
        stroke="none"
      />
    </>
  );
};

export const StopIcon: React.FC<IconProps> = (p) => {
  const { color = "currentColor", ...rest } = p;
  return base(
    { ...rest, color },
    <>
      <circle cx="12" cy="12" r="10" />
      <rect
        x="8.5"
        y="8.5"
        width="7"
        height="7"
        rx="1"
        fill={color}
        stroke="none"
      />
    </>
  );
};

// ── Informational ────────────────────────────────────────────────────────────

export const InfoIcon: React.FC<IconProps> = (p) => {
  const { color = "currentColor", ...rest } = p;
  return base(
    { ...rest, color },
    <>
      <circle cx="12" cy="12" r="10" />
      <circle cx="12" cy="8.5" r="1" fill={color} stroke="none" />
      <path d="M12 11.5v5" />
    </>
  );
};

// ── User / account ────────────────────────────────────────────────────────────

export const UserIcon: React.FC<IconProps> = (p) =>
  base(
    p,
    <>
      <circle cx="12" cy="8" r="4" />
      <path d="M4 20c0-4.4 3.6-8 8-8s8 3.6 8 8" />
    </>
  );

export const LogOutIcon: React.FC<IconProps> = (p) =>
  base(
    p,
    <>
      <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
      <path d="M10 17l5-5-5-5" />
      <path d="M15 12H3" />
    </>
  );
