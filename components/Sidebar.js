'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  ShieldAlert,
  Clock,
  MailQuestion,
  MoonStar,
  Terminal,
  HeartPulse,
  LogOut,
  Menu,
  X,
} from 'lucide-react';
import Avatar from './Avatar';
import Badge from './Badge';

const NAV_GROUPS = [
  {
    label: 'Overview',
    items: [{ href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard }],
  },
  {
    label: 'Management',
    items: [
      { href: '/dashboard/warnings', label: 'Warnings', icon: ShieldAlert },
      { href: '/dashboard/afk', label: 'AFK', icon: MoonStar },
      { href: '/dashboard/activity', label: 'Active Time', icon: Clock },
      { href: '/dashboard/modmail', label: 'ModMail', icon: MailQuestion },
    ],
  },
  {
    label: 'System',
    items: [
      { href: '/dashboard/commands', label: 'Commands', icon: Terminal },
      { href: '/dashboard/health', label: 'Bot Health', icon: HeartPulse },
    ],
  },
];

function SidebarContent({ user, level, onNavigate }) {
  const pathname = usePathname();
  const router = useRouter();

  async function handleLogout() {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/login');
    router.refresh();
  }

  return (
    <div className="flex h-full flex-col bg-ink-900">
      <div className="flex items-center gap-2.5 border-b border-ink-700 px-4 py-4">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/pixel-villa-icon.png" alt="" className="h-8 w-8 rounded-md border border-ink-600" />
        <div>
          <p className="text-sm font-semibold leading-tight text-mist-100">Pixel Villa</p>
          <p className="text-xs leading-tight text-mist-400">Staff Dashboard</p>
        </div>
      </div>

      <nav className="flex-1 space-y-5 overflow-y-auto px-2 py-4">
        {NAV_GROUPS.map((group) => (
          <div key={group.label}>
            <p className="mb-1.5 px-3 text-[11px] font-semibold uppercase tracking-wider text-mist-400">{group.label}</p>
            <div className="space-y-0.5">
              {group.items.map((item) => {
                const Icon = item.icon;
                const active = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={onNavigate}
                    className={`group relative flex origin-left items-center gap-2.5 rounded px-3 py-2 text-sm hover:scale-[1.02] ${
                      active ? 'bg-accent/10 text-accent' : 'text-mist-300 hover:bg-ink-800 hover:text-mist-100'
                    }`}
                  >
                    {active && <span className="absolute left-0 top-1/2 h-4 w-0.5 -translate-y-1/2 rounded-full bg-accent" />}
                    <Icon className={`h-4 w-4 ${active ? 'text-accent' : 'text-mist-400 group-hover:text-mist-200'}`} />
                    {item.label}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      <div className="border-t border-ink-700 p-3">
        <div className="flex items-center gap-2.5 rounded px-1 py-1.5">
          <Avatar url={user?.avatarURL} size="md" />
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm text-mist-100">{user?.globalName || 'Staff member'}</p>
            <Badge variant={level === 'admin' ? 'admin' : 'staff'}>{level === 'admin' ? 'Admin' : 'Staff'}</Badge>
          </div>
          <button
            type="button"
            onClick={handleLogout}
            title="Sign out"
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded text-mist-400 hover:scale-110 hover:bg-ink-800 hover:text-bad"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

/**
 * Desktop: fixed sidebar, always visible. Mobile: off-canvas drawer toggled by a
 * hamburger button, since there's no room for a persistent 224px rail on a phone.
 */
export default function Sidebar({ user, level }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      {/* Mobile top bar */}
      <div className="flex items-center justify-between border-b border-ink-700 bg-ink-900 px-4 py-3 md:hidden">
        <div className="flex items-center gap-2">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/pixel-villa-icon.png" alt="" className="h-6 w-6 rounded border border-ink-600" />
          <span className="text-sm font-semibold text-mist-100">Pixel Villa</span>
        </div>
        <button
          type="button"
          onClick={() => setMobileOpen(true)}
          className="flex items-center gap-1.5 rounded border border-ink-600 px-3 py-1.5 text-sm text-mist-200 hover:scale-105 hover:border-ink-500 hover:bg-ink-800"
        >
          <Menu className="h-4 w-4" />
          Menu
        </button>
      </div>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="absolute inset-0 bg-ink-950/70" onClick={() => setMobileOpen(false)} />
          <div className="absolute inset-y-0 left-0 w-64 shadow-popover">
            <div className="flex justify-end p-2">
              <button
                type="button"
                onClick={() => setMobileOpen(false)}
                className="flex h-8 w-8 items-center justify-center rounded text-mist-300 hover:scale-110 hover:bg-ink-800"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="h-[calc(100%-3rem)]">
              <SidebarContent user={user} level={level} onNavigate={() => setMobileOpen(false)} />
            </div>
          </div>
        </div>
      )}

      {/* Desktop rail */}
      <aside className="hidden w-56 shrink-0 border-r border-ink-700 md:block">
        <div className="sticky top-0 h-screen">
          <SidebarContent user={user} level={level} />
        </div>
      </aside>
    </>
  );
}
