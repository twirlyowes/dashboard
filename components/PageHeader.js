/**
 * icon and breadcrumb are optional and additive — every existing
 * `<PageHeader title=... description=... />` call site keeps working unchanged.
 */
export default function PageHeader({ title, description, icon: Icon, breadcrumb }) {
  return (
    <div className="mb-6 border-b border-ink-700 pb-4">
      {breadcrumb && <p className="mb-1 text-xs text-mist-400">{breadcrumb}</p>}
      <div className="flex items-center gap-2.5">
        {Icon && (
          <span className="flex h-7 w-7 items-center justify-center rounded bg-accent/15 text-accent">
            <Icon className="h-4 w-4" />
          </span>
        )}
        <h1 className="text-lg font-medium text-mist-100">{title}</h1>
      </div>
      {description && <p className="mt-1 text-sm text-mist-400">{description}</p>}
    </div>
  );
}
