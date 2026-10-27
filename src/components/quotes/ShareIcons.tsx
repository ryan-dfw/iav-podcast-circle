/**
 * Share-row glyphs, inline so they inherit colour and add no icon dependency.
 * The share mark is the system one — a tray with an arrow leaving it — which
 * is what a share sheet looks like to most people.
 */

const base = {
  width: 20,
  height: 20,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.6,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  'aria-hidden': true,
} as const;

export function ShareIcon() {
  return (
    <svg {...base}>
      <path d="M4 12v7a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-7" />
      <path d="M8 7l4-4 4 4" />
      <path d="M12 3v13" />
    </svg>
  );
}

export function DownloadIcon() {
  return (
    <svg {...base}>
      <path d="M4 15v4a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-4" />
      <path d="M8 11l4 4 4-4" />
      <path d="M12 15V3" />
    </svg>
  );
}

export function LinkIcon() {
  return (
    <svg {...base}>
      <path d="M10 13a5 5 0 0 0 7.1.1l3-3a5 5 0 0 0-7.1-7.1L11.5 4.5" />
      <path d="M14 11a5 5 0 0 0-7.1-.1l-3 3a5 5 0 0 0 7.1 7.1l1.4-1.4" />
    </svg>
  );
}

export function CheckIcon() {
  return (
    <svg {...base}>
      <path d="M20 6L9 17l-5-5" />
    </svg>
  );
}
