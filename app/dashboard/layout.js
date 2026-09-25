import { redirect } from 'next/navigation';
import { getSession } from '../../lib/getSession';
import { resolveUsername } from '../../lib/discordUsers';
import Sidebar from '../../components/Sidebar';

export default async function DashboardLayout({ children }) {
  const session = await getSession();
  // Middleware already redirects unauthenticated requests away from /dashboard, but
  // this covers the direct-render case too (e.g. a stale build) rather than trusting
  // middleware alone.
  if (!session) redirect('/login');

  // Reuses the same cached username-resolution path every other page already relies
  // on — not a new API call, just applying the existing utility to the logged-in
  // user too, for the sidebar footer avatar.
  const user = await resolveUsername(session.discordId);

  return (
    <div className="flex min-h-screen flex-col md:flex-row">
      <Sidebar user={user} level={session.level} />
      <main className="min-h-screen flex-1 overflow-x-hidden px-4 py-6 md:px-8">{children}</main>
    </div>
  );
}
