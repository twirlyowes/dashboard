'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();
  const [discordId, setDiscordId] = useState('');
  const [accessCode, setAccessCode] = useState('');
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ discordId: discordId.trim(), accessCode: accessCode.trim() }),
      });
      const data = await res.json();

      if (!res.ok || !data.ok) {
        setError(data.reason || 'Login failed.');
        setSubmitting(false);
        return;
      }

      router.push('/dashboard');
      router.refresh();
    } catch {
      setError('Something went wrong. Try again.');
      setSubmitting(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8">
          <h1 className="text-lg font-medium text-mist-100">Pixel Villa Staff</h1>
          <p className="mt-1 text-sm text-mist-400">Sign in with your Discord ID and the staff access code.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 rounded border border-ink-600 bg-ink-900 p-6">
          <div>
            <label htmlFor="discordId" className="mb-1.5 block text-xs font-medium text-mist-300">
              Discord ID
            </label>
            <input
              id="discordId"
              type="text"
              inputMode="numeric"
              autoComplete="off"
              value={discordId}
              onChange={(e) => setDiscordId(e.target.value)}
              className="mono w-full rounded border border-ink-600 bg-ink-800 px-3 py-2 text-sm text-mist-100 outline-none focus:border-accent"
              placeholder="e.g. 123456789012345678"
              required
            />
          </div>

          <div>
            <label htmlFor="accessCode" className="mb-1.5 block text-xs font-medium text-mist-300">
              Access code
            </label>
            <input
              id="accessCode"
              type="password"
              autoComplete="off"
              value={accessCode}
              onChange={(e) => setAccessCode(e.target.value)}
              className="w-full rounded border border-ink-600 bg-ink-800 px-3 py-2 text-sm text-mist-100 outline-none focus:border-accent"
              required
            />
          </div>

          {error && <p className="text-sm text-bad">{error}</p>}

          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded bg-accent px-3 py-2 text-sm font-medium text-ink-950 hover:scale-[1.02] hover:bg-accent-dim disabled:opacity-50 disabled:hover:scale-100"
          >
            {submitting ? 'Signing in…' : 'Sign in'}
          </button>
        </form>

        <p className="mt-4 text-center text-xs text-mist-400">
          <a href="/privacy" className="hover:text-mist-200">
            Privacy Policy
          </a>
          <span className="mx-2">·</span>
          <a href="/terms" className="hover:text-mist-200">
            Terms &amp; Conditions
          </a>
        </p>
      </div>
    </main>
  );
}
