import { Clock, MessageSquare, Mic, Terminal } from 'lucide-react';
import PageHeader from '../../../components/PageHeader';
import SearchBox from '../../../components/SearchBox';
import DataTable from '../../../components/DataTable';
import StatCard from '../../../components/StatCard';
import UserTag from '../../../components/UserTag';
import EmptyState from '../../../components/EmptyState';
import { getActivityLeaderboard, getActivityForUser } from '../../../lib/data/activity';
import { resolveUsername, resolveUsernames } from '../../../lib/discordUsers';

function formatMinutes(ms) {
  if (!ms) return '0m';
  const totalMinutes = Math.floor(ms / 60000);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  return hours ? `${hours}h ${minutes}m` : `${minutes}m`;
}

export default async function ActivityPage({ searchParams }) {
  const userId = searchParams?.userId?.trim();

  if (userId) {
    const [entry, user] = await Promise.all([getActivityForUser(userId), resolveUsername(userId)]);

    return (
      <div>
        <PageHeader title="Staff Activity" description="Individual lookup." icon={Clock} />
        <SearchBox defaultUser={user} />
        <div className="mb-4">
          <UserTag user={user} />
        </div>

        {entry ? (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            <StatCard label="Active time" value={formatMinutes(entry.activeTime)} icon={Clock} tone="info" />
            <StatCard label="Voice time" value={formatMinutes(entry.voiceTime)} icon={Mic} tone="success" />
            <StatCard label="Messages" value={entry.messages || 0} icon={MessageSquare} />
            <StatCard label="Commands" value={entry.commands || 0} icon={Terminal} />
          </div>
        ) : (
          <EmptyState title="No activity yet" message="This user has no recorded activity." />
        )}
      </div>
    );
  }

  const leaderboard = await getActivityLeaderboard();
  const userMap = await resolveUsernames(leaderboard.map((r) => r.userId));

  const rows = leaderboard.map((r) => ({
    id: r.userId,
    user: <UserTag user={userMap.get(r.userId)} />,
    activeTime: formatMinutes(r.activeTime),
    voiceTime: formatMinutes(r.voiceTime),
    messages: r.messages || 0,
    commands: r.commands || 0,
  }));

  return (
    <div>
      <PageHeader title="Staff Activity" description="Leaderboard, or search for someone specific below." icon={Clock} />
      <SearchBox />
      <DataTable
        columns={[
          { key: 'user', label: 'Staff member' },
          { key: 'activeTime', label: 'Active time', mono: true },
          { key: 'voiceTime', label: 'Voice time', mono: true },
          { key: 'messages', label: 'Messages', mono: true },
          { key: 'commands', label: 'Commands', mono: true },
        ]}
        rows={rows}
        emptyTitle="No activity data"
        emptyMessage="Staff activity will appear here once the bot starts tracking it."
      />
    </div>
  );
}
