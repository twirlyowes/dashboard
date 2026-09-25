import { Inbox } from 'lucide-react';

/**
 * message: kept as the sole required prop so every existing call site
 * (`<EmptyState message="..." />`) keeps working unchanged — title is optional and
 * purely additive.
 */
export default function EmptyState({ title, message }) {
  return (
    <div className="flex flex-col items-center gap-2 rounded-md border border-dashed border-ink-600 px-8 py-10 text-center">
      <Inbox className="h-5 w-5 text-mist-400" />
      {title && <p className="text-sm font-medium text-mist-200">{title}</p>}
      <p className="text-sm text-mist-400">{message}</p>
    </div>
  );
}
