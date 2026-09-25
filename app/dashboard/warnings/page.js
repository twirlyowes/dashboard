import { ShieldAlert } from 'lucide-react';
import PageHeader from '../../../components/PageHeader';
import SearchBox from '../../../components/SearchBox';
import DataTable from '../../../components/DataTable';
import UserTag from '../../../components/UserTag';
import { getWarningsForUser } from '../../../lib/data/warnings';
import { resolveUsername } from '../../../lib/discordUsers';
import { formatCommand } from '../../../lib/commands';
import { getSession } from '../../../lib/getSession';
import { scopedUserId, isScopeRestricted } from '../../../lib/scope';

export default async function WarningsPage({ searchParams }) {
  const session = await getSession();
  const requested = searchParams?.userId?.trim();
  const restricted = isScopeRestricted(session, requested);
  const userId = scopedUserId(session, requested);
  const isAdmin = session?.level === 'admin';

  let warnings = [];
  let user = null;
  if (userId) {
    [warnings, user] = await Promise.all([getWarningsForUser(userId), resolveUsername(userId)]);
  }

  const rows = warnings.map((w) => ({
    id: w.id,
    reason: w.reason,
    moderator: w.moderator,
    timestamp: new Date(w.timestamp).toLocaleString(),
  }));

  return (
    <div>
      <PageHeader
        title="Warnings"
        description={
          isAdmin
            ? `Search by username or Discord ID. Sourced from ${formatCommand('warn')} on the support bot.`
            : `Your own warning history, sourced from ${formatCommand('warn')} on the support bot.`
        }
        icon={ShieldAlert}
      />

      {isAdmin && <SearchBox defaultUser={user} />}
      {restricted && <p className="mb-4 text-sm text-warn">You can only view your own warning history.</p>}

      {userId && (
        <>
          <div className="mb-4">
            <UserTag user={user} />
          </div>
          <DataTable
            columns={[
              { key: 'reason', label: 'Reason' },
              { key: 'moderator', label: 'Moderator' },
              { key: 'timestamp', label: 'When', mono: true },
            ]}
            rows={rows}
            emptyTitle="No warnings found"
            emptyMessage="There are no warning records for this user."
          />
        </>
      )}
    </div>
  );
}
