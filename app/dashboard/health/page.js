import { HeartPulse, Bot, Server, Users, Radio, RotateCcw } from 'lucide-react';
import PageHeader from '../../../components/PageHeader';
import StatCard from '../../../components/StatCard';
import ErrorState from '../../../components/ErrorState';
import { getLastResetInfo } from '../../../lib/data/activity';
import { config } from '../../../lib/config';

// Plain REST calls, not gateway/presence-based — so this shows real, verifiable
// numbers (member count, approximate online count from Discord's own widget-style
// endpoint) rather than a fabricated "online/offline" status this dashboard has no
// reliable way to actually know.
async function getGuildSnapshot() {
  const res = await fetch(`https://discord.com/api/v10/guilds/${config.guildId}?with_counts=true`, {
    headers: { Authorization: `Bot ${config.botToken}` },
    cache: 'no-store',
  });
  if (!res.ok) return null;
  return res.json();
}

async function getBotAccount() {
  const res = await fetch('https://discord.com/api/v10/users/@me', {
    headers: { Authorization: `Bot ${config.botToken}` },
    cache: 'no-store',
  });
  if (!res.ok) return null;
  return res.json();
}

export default async function HealthPage() {
  const [guild, bot, lastReset] = await Promise.all([getGuildSnapshot(), getBotAccount(), getLastResetInfo()]);

  return (
    <div>
      <PageHeader title="Bot Health" description="Live data pulled directly from Discord's REST API, not cached presence." icon={HeartPulse} />

      {!guild || !bot ? (
        <ErrorState
          title="Could not reach Discord"
          message="The configured bot token didn't return a response. Check DISCORD_BOT_TOKEN and DISCORD_GUILD_ID."
        />
      ) : (
        <>
          <div className="mb-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
            <StatCard label="Bot account" value={bot.username} icon={Bot} />
            <StatCard label="Server" value={guild.name} icon={Server} />
            <StatCard label="Total members" value={guild.approximate_member_count ?? 'Unavailable'} icon={Users} tone="info" />
            <StatCard label="Online now" value={guild.approximate_presence_count ?? 'Unavailable'} icon={Radio} tone="success" />
          </div>

          <div className="rounded-md border border-ink-600 bg-ink-900 p-4 shadow-card">
            <div className="mb-2 flex items-center gap-1.5 text-xs text-mist-400">
              <RotateCcw className="h-3.5 w-3.5" />
              Activity tracking
            </div>
            <p className="mt-1 text-sm text-mist-100">
              Last reset:{' '}
              {lastReset?.lastResetDate ? new Date(lastReset.lastResetDate).toLocaleString() : 'Not yet recorded'}
            </p>
            <p className="text-sm text-mist-100">
              Last report:{' '}
              {lastReset?.lastReportDate ? new Date(lastReset.lastReportDate).toLocaleString() : 'Not yet recorded'}
            </p>
          </div>
        </>
      )}
    </div>
  );
}
