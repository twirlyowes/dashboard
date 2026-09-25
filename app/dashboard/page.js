import { LayoutDashboard, MailQuestion, Inbox, Users, RotateCcw } from 'lucide-react';
import PageHeader from '../../components/PageHeader';
import StatCard from '../../components/StatCard';
import DataTable from '../../components/DataTable';
import UserTag from '../../components/UserTag';
import QuotaPanel from '../../components/QuotaPanel';
import { getOpenTickets, getPendingCount } from '../../lib/data/modmail';
import { getActivityLeaderboard, getLastResetInfo } from '../../lib/data/activity';
import { resolveUsernames } from '../../lib/discordUsers';
import { getSession } from '../../lib/getSession';
import { getQuotaStatus } from '../../lib/quota';

export default async function OverviewPage() {
  const session = await getSession();
  const isAdmin = session?.level === 'admin';

  const [openTickets, pendingCount, leaderboard, lastReset] = await Promise.all([
    getOpenTickets(),
    getPendingCount(),
    getActivityLeaderboard(),
    getLastResetInfo(),
  ]);

  const top5 = leaderboard.slice(0, 5);
  const userMap = await resolveUsernames(top5.map((r) => r.userId));

  const rows = top5.map((r) => ({
    id: r.userId,
    user: <UserTag user={userMap.get(r.userId)} />,
    activeTime: formatMinutes(r.activeTime),
    messages: r.messages || 0,
  }));

  return (
    <div>
      <PageHeader
        title="Overview"
        description="Live snapshot from the support bot's Firebase project."
        icon={LayoutDashboard}
      />

      <div className="mb-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
        <StatCard label="Open ModMail tickets" value={openTickets.length} icon={MailQuestion} tone="info" />
        <StatCard label="Pending DM messages" value={pendingCount} icon={Inbox} tone="warning" />
        <StatCard label="Staff tracked" value={leaderboard.length} icon={Users} tone="success" />
        <StatCard
          label="Last activity reset"
          value={lastReset?.lastResetDate ? new Date(lastReset.lastResetDate).toLocaleDateString() : 'Not yet recorded'}
          icon={RotateCcw}
        />
      </div>

      {isAdmin && (
        <div className="mb-8">
          <QuotaPanel {...getQuotaStatus()} />
        </div>
      )}

      <h2 className="mb-3 text-sm font-medium text-mist-300">Top 5 by active time</h2>
      <DataTable
        columns={[
          { key: 'user', label: 'Staff member' },
          { key: 'activeTime', label: 'Active time', mono: true },
          { key: 'messages', label: 'Messages', mono: true },
        ]}
        rows={rows}
        emptyTitle="No activity data"
        emptyMessage="Staff activity will appear here once the bot starts tracking it."
      />
    </div>
  );
}

function formatMinutes(ms) {
  if (!ms) return '0m';
  const totalMinutes = Math.floor(ms / 60000);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  return hours ? `${hours}h ${minutes}m` : `${minutes}m`;
}
