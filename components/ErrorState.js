import { AlertTriangle } from 'lucide-react';

/**
 * Intentional-looking error block for when a fetch fails (e.g. Discord API
 * unreachable on Bot Health) — never a raw stack trace, just a clear title and a
 * useful, specific message the caller provides.
 */
export default function ErrorState({ title = 'Something went wrong', message }) {
  return (
    <div className="flex items-start gap-3 rounded border border-bad/30 bg-bad/10 p-4">
      <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-bad" />
      <div>
        <p className="text-sm font-medium text-bad">{title}</p>
        {message && <p className="mt-1 text-sm text-mist-300">{message}</p>}
      </div>
    </div>
  );
}
