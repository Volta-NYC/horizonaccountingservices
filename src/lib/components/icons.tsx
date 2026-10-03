import type { CSSProperties } from "react";
export function Arrow({
  diagonal = false,
  className = "",
}: {
  diagonal?: boolean;
  className?: string;
}) {
  return (
    <svg
      className={className}
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d={diagonal ? "M5 19 19 5M5 5h14v14" : "M4 12h15m-6-6 6 6-6 6"}
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
export function HorizonMark({
  className = "",
  style,
}: {
  className?: string;
  style?: CSSProperties;
}) {
  return (
    <svg
      className={className}
      style={style}
      width="44"
      height="38"
      viewBox="0 0 44 38"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M6 23a16 16 0 0 1 32 0M1 23h42M6 29h32M12 35h20"
        stroke="currentColor"
        strokeWidth="1.6"
      />
    </svg>
  );
}
export function ServiceIcon({ type }: { type: number }) {
  return (
    <svg
      width="56"
      height="56"
      viewBox="0 0 56 56"
      fill="none"
      aria-hidden="true"
      stroke="currentColor"
      strokeWidth="1.25"
    >
      {type === 0 ? (
        <>
          <path d="M11 43V17h25v26M17 17V9h26v34M6 43h42M22 24h7m-7 7h7m-7 7h7M40 11l6-6m-1 12h8" />
        </>
      ) : type === 1 ? (
        <>
          <rect x="12" y="7" width="32" height="42" rx="2" />
          <path d="M20 16h16M20 24h4m8 0h4m-16 8h4m8 0h4m-16 8h4m8 0h4" />
        </>
      ) : type === 2 ? (
        <>
          <path d="M8 45h41M14 39V28h7v11m6 0V21h7v18m6 0V12h7v27M9 22l12-8 9 1L43 5m-9 0h9v9" />
        </>
      ) : (
        <>
          <path d="M8 43 28 8l20 35H8Z" />
          <path d="m18 26 10 6 10-6M28 32v11M8 43l10-17m20 0 10 17" />
          <circle cx="28" cy="8" r="3" fill="var(--paper)" />
        </>
      )}
    </svg>
  );
}
