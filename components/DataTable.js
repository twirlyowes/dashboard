import EmptyState from './EmptyState';

/**
 * columns: [{ key, label, mono?: boolean }]
 * rows: array of objects; each column's value rendered via row[key], or a custom
 * render function passed as columns[].render(row).
 * emptyTitle/emptyMessage: passed straight through to EmptyState.
 */
export default function DataTable({ columns, rows, emptyMessage = 'Nothing here yet.', emptyTitle }) {
  if (!rows || rows.length === 0) return <EmptyState title={emptyTitle} message={emptyMessage} />;

  return (
    <div className="scroll-thin overflow-x-auto rounded-md border border-ink-600 shadow-card">
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b border-ink-600 bg-ink-900">
            {columns.map((col) => (
              <th key={col.key} className="whitespace-nowrap px-4 py-2.5 text-xs font-medium uppercase tracking-wide text-mist-400">
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr
              key={row.id || i}
              className="origin-center border-b border-ink-700 last:border-b-0 hover:scale-[1.01] hover:bg-ink-800/50"
            >
              {columns.map((col) => (
                <td key={col.key} className={`px-4 py-3 text-mist-200 ${col.mono ? 'mono' : ''}`}>
                  {col.render ? col.render(row) : row[col.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
