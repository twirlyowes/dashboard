import { MoonStar } from 'lucide-react';
import PageHeader from '../../../components/PageHeader';
import SearchBox from '../../../components/SearchBox';
import DataTable from '../../../components/DataTable';
import UserTag from '../../../components/UserTag';
import EmptyState from '../../../components/EmptyState';
import { getAfkStatus, getAllAfkUsers } from '../../../lib/data/afk';
import { resolveUsername, resolveUsernames } from '../../../lib/discordUsers';
import { getSession } from '../../../lib/getSession';
import { scopedUserId, isScopeRestricted } from '../../../lib/scope';

export default async function AfkPage({ searchParams }) {
  const session = await getSession();
  const requested = searchParams?.userId?.trim();
  const restricted = isScopeRestricted(session, requested);
  const userId = scopedUserId(session, requested);
  const isAdmin = session?.level === 'admin';

  // Admins with no specific search: show every currently-AFK user automatically,
  // rather than requiring them to search one ID at a time.
  if (isAdmin && !requested) {
    const allAfk = await getAllAfkUsers();
    const userMap = await resolveUsernames(allAfk.map((a) => a.userId));

    const rows = allAfk.map((a) => ({
      id: a.userId,
      user: <UserTag user={userMap.get(a.userId)} />,
      reason: a.reason || 'No reason given.',
      setAt: new Date(a.setupAt).toLocaleString(),
    }));

    return (
      <div>
        <PageHeader title="AFK" description={`Every currently AFK user (${allAfk.length}). Search below to jump to one specifically.`} icon={MoonStar} />
        <SearchBox />
        <DataTable
          columns={[
            { key: 'user', label: 'User' },
            { key: 'reason', label: 'Reason' },
            { key: 'setAt', label: 'Set at', mono: true },
          ]}
          rows={rows}
          emptyTitle="No one is AFK"
          emptyMessage="Every staff member is currently active."
        />
      </div>
    );
  }

  let status = null;
  let user = null;
  if (userId) {
    [status, user] = await Promise.all([getAfkStatus(userId), resolveUsername(userId)]);
  }

  return (
    <div>
      <PageHeader
        title="AFK"
        description={isAdmin ? 'Search for someone to check AFK status.' : 'Your own AFK status.'}
        icon={MoonStar}
      />

      {isAdmin && <SearchBox defaultUser={user} />}
      {restricted && <p className="mb-4 text-sm text-warn">You can only view your own AFK status.</p>}

      {userId && (
        <>
          <div className="mb-4">
            <UserTag user={user} />
          </div>

          {status ? (
            <div className="rounded-md border border-ink-600 bg-ink-900 p-4 shadow-card">
              <p className="text-sm text-mist-100">{status.reason || 'No reason given.'}</p>
              <p className="mono mt-2 text-xs text-mist-400">
                Set at {new Date(status.setupAt).toLocaleString()}
              </p>
            </div>
          ) : (
            <EmptyState title="Not AFK" message="This user is not currently marked as AFK." />
          )}
        </>
      )}
    </div>
  );
}
