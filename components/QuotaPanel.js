function formatWindowStart(ms) {
  const hours = Math.floor((Date.now() - ms) / (1000 * 60 * 60));
  if (hours < 1) return 'less than an hour ago';
  return `${hours}h ago`;
}

export default function QuotaPanel({ used, budget, windowStartedAt }) {
  const percent = Math.min(100, Math.round((used / budget) * 100));
  const color = percent >= 100 ? 'text-bad' : percent >= 75 ? 'text-warn' : 'text-good';
  const barColor = percent >= 100 ? 'bg-bad' : percent >= 75 ? 'bg-warn' : 'bg-good';

  return (
    <div className="rounded-md border border-ink-600 bg-ink-900 p-4 shadow-card hover:scale-[1.02] hover:border-ink-500 hover:shadow-card-hover">
      <div className="flex items-baseline justify-between">
        <p className="text-xs text-mist-400">Firestore requests today</p>
        <span className={`mono text-xs ${color}`}>{percent}%</span>
      </div>
      <p className="mono mt-1 text-lg text-mist-100">
        {used.toLocaleString()} <span className="text-sm text-mist-400">/ {budget.toLocaleString()}</span>
      </p>
      <div className="mt-2 h-1.5 w-full overflow-hidden rounded bg-ink-700">
        <div className={`h-full ${barColor}`} style={{ width: `${percent}%` }} />
      </div>
      <p className="mt-2 text-xs text-mist-400">
        Counter started {formatWindowStart(windowStartedAt)}. Resets every 24h, or on server restart, whichever
        comes first. This tracks the current server instance, not a persisted historical total.
      </p>
    </div>
  );
}
