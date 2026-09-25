export function StatCardSkeleton({ count = 4 }) {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="rounded border border-ink-600 bg-ink-900 p-4">
          <Bar width="w-20" height="h-3" />
          <div className="mt-3">
            <Bar width="w-12" height="h-6" />
          </div>
        </div>
      ))}
    </div>
  );
}

/** Generic skeleton for a table, used by loading.js files. */
export function TableSkeleton({ rows = 5, columns = 4 }) {
  return (
    <div className="overflow-hidden rounded border border-ink-600">
      <div className="border-b border-ink-600 bg-ink-900 px-4 py-2.5">
        <Bar width="w-32" height="h-3" />
      </div>
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex gap-6 border-b border-ink-700 px-4 py-3 last:border-b-0">
          {Array.from({ length: columns }).map((_, j) => (
            <Bar key={j} width={j === 0 ? 'w-32' : 'w-20'} height="h-3" />
          ))}
        </div>
      ))}
    </div>
  );
}

export function PageSkeleton() {
  return (
    <div>
      <Bar width="w-40" height="h-5" />
      <div className="mt-2">
        <Bar width="w-72" height="h-3" />
      </div>
      <div className="mt-6">
        <StatCardSkeleton />
      </div>
      <div className="mt-6">
        <TableSkeleton />
      </div>
    </div>
  );
}

// Defined last on purpose: function declarations hoist, so this works identically
// regardless of position, but keeping it below the exported functions means Node's
// module-type sniffer reaches an `export` keyword before it reaches any JSX, which
// avoids a (spurious, ESM-vs-CJS-detection-only) syntax error from `node --check`.
function Bar({ width = 'w-full', height = 'h-4' }) {
  return <div className={`skeleton rounded-sm bg-ink-700 ${width} ${height}`} />;
}
