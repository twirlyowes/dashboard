import { MailQuestion, Inbox, Archive } from 'lucide-react';
import PageHeader from '../../../components/PageHeader';
import StatCard from '../../../components/StatCard';
import DataTable from '../../../components/DataTable';
import UserTag from '../../../components/UserTag';
import Badge from '../../../components/Badge';
import { getOpenTickets, getRecentClosedTickets, getPendingCount } from '../../../lib/data/modmail';
import { resolveUsernames } from '../../../lib/discordUsers';

const CATEGORY_LABELS = {
  minecraft: 'Minecraft',
  discord: 'Discord',
  others: 'Others',
};

export default async function ModMailPage() {
  const [openTickets, closedTickets, pendingCount] = await Promise.all([
    getOpenTickets(),
    getRecentClosedTickets(25),
    getPendingCount(),
  ]);

  const allUserIds = [...openTickets, ...closedTickets].map((t) => t.userId);
  const userMap = await resolveUsernames(allUserIds);

  const buildRows = (tickets) =>
    tickets.map((t) => ({
      id: t.channelId,
      ticket: `#${t.ticketId}`,
      user: <UserTag user={userMap.get(t.userId)} />,
      category: <Badge variant="neutral">{CATEGORY_LABELS[t.category] || t.category}</Badge>,
      claimedBy: t.claimedBy ? <UserTag user={userMap.get(t.claimedBy)} /> : <Badge variant="warning">Unclaimed</Badge>,
      createdAt: new Date(t.createdAt).toLocaleString(),
      closedAt: t.closedAt ? new Date(t.closedAt).toLocaleString() : null,
    }));

  return (
    <div>
      <PageHeader title="ModMail" description="Support tickets from the support bot's DM-based ModMail system." icon={MailQuestion} />

      <div className="mb-8 grid grid-cols-3 gap-4">
        <StatCard label="Open tickets" value={openTickets.length} icon={MailQuestion} tone="info" />
        <StatCard label="Pending DM messages" value={pendingCount} icon={Inbox} tone="warning" />
        <StatCard label="Recently closed shown" value={closedTickets.length} icon={Archive} />
      </div>

      <h2 className="mb-3 text-sm font-medium text-mist-300">Open tickets</h2>
      <DataTable
        columns={[
          { key: 'ticket', label: 'Ticket', mono: true },
          { key: 'user', label: 'User' },
          { key: 'category', label: 'Category' },
          { key: 'claimedBy', label: 'Claimed by' },
          { key: 'createdAt', label: 'Opened', mono: true },
        ]}
        rows={buildRows(openTickets)}
        emptyTitle="No open tickets"
        emptyMessage="Everything's handled right now."
      />

      <h2 className="mb-3 mt-8 text-sm font-medium text-mist-300">Recently closed</h2>
      <DataTable
        columns={[
          { key: 'ticket', label: 'Ticket', mono: true },
          { key: 'user', label: 'User' },
          { key: 'category', label: 'Category' },
          { key: 'closedAt', label: 'Closed', mono: true },
        ]}
        rows={buildRows(closedTickets)}
        emptyTitle="No closed tickets"
        emptyMessage="Closed tickets will show up here once any exist."
      />
    </div>
  );
}
