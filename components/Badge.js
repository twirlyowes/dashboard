const VARIANTS = {
  // access levels
  admin: 'bg-accent/15 text-accent border-accent/30',
  staff: 'bg-ink-700 text-mist-200 border-ink-600',
  // status/semantic
  success: 'bg-good/15 text-good border-good/30',
  warning: 'bg-warn/15 text-warn border-warn/30',
  danger: 'bg-bad/15 text-bad border-bad/30',
  info: 'bg-accent/15 text-accent border-accent/30',
  neutral: 'bg-ink-700 text-mist-300 border-ink-600',
};

/**
 * Consistent small status label used across warnings, moderation results, ModMail
 * ticket status, AFK indicators, and bot health — subtle tinted background, never a
 * bright filled pill.
 */
export default function Badge({ children, variant = 'neutral' }) {
  return (
    <span className={`inline-flex items-center rounded-sm border px-2 py-0.5 text-xs font-medium ${VARIANTS[variant] || VARIANTS.neutral}`}>
      {children}
    </span>
  );
}
