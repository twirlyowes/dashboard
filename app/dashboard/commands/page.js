import { Terminal } from 'lucide-react';
import PageHeader from '../../../components/PageHeader';
import { COMMAND_CATEGORIES } from '../../../lib/commands';

export default function CommandsPage() {
  return (
    <div>
      <PageHeader
        title="Commands"
        description="Every command the support bot offers, straight from its actual source. Not the premium bot."
        icon={Terminal}
      />

      <div className="space-y-8">
        {COMMAND_CATEGORIES.map((category) => (
          <div key={category.label}>
            <h2 className="mb-3 text-sm font-medium text-mist-300">{category.label}</h2>
            <div className="overflow-hidden rounded-md border border-ink-600 shadow-card">
              {category.commands.map((cmd, i) => (
                <div
                  key={cmd.name}
                  className={`flex flex-col gap-1 px-4 py-3 sm:flex-row sm:items-center sm:gap-4 ${
                    i !== category.commands.length - 1 ? 'border-b border-ink-700' : ''
                  } hover:bg-ink-800/50`}
                >
                  <code className="mono shrink-0 rounded bg-ink-800 px-2 py-1 text-xs text-accent sm:w-56">
                    {cmd.usage}
                  </code>
                  <p className="text-sm text-mist-300">{cmd.description}</p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
