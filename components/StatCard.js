const TONE_ICON_BG = {
  info: 'bg-accent/15 text-accent',
  success: 'bg-good/15 text-good',
  warning: 'bg-warn/15 text-warn',
  danger: 'bg-bad/15 text-bad',
  neutral: 'bg-ink-700 text-mist-300',
};

/**
 * icon and tone are optional and additive — every existing
 * `<StatCard label=... value=... sublabel=... />` call site keeps working unchanged.
 */
export default function StatCard({ label, value, sublabel, icon: Icon, tone = 'neutral' }) {
  return (
    <div className="group rounded-md border border-ink-600 bg-ink-900 p-4 shadow-card hover:scale-[1.02] hover:border-ink-500 hover:shadow-card-hover">
      <div className="flex items-center justify-between">
        <p className="text-xs text-mist-400">{label}</p>
        {Icon && (
          <span className={`flex h-7 w-7 items-center justify-center rounded ${TONE_ICON_BG[tone] || TONE_ICON_BG.neutral}`}>
            <Icon className="h-3.5 w-3.5" />
          </span>
        )}
      </div>
      <p className="mono mt-2 text-2xl font-medium text-mist-100">{value}</p>
      {sublabel && <p className="mt-1 text-xs text-mist-400">{sublabel}</p>}
    </div>
  );
}
