'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import UserSearchInput from './UserSearchInput';

export default function SearchBox({ defaultUser = null }) {
  const router = useRouter();
  const [targetId, setTargetId] = useState(defaultUser?.id || '');

  function handleSubmit(e) {
    e.preventDefault();
    if (!targetId) return;
    const url = new URL(window.location.href);
    url.searchParams.set('userId', targetId);
    router.push(`${url.pathname}${url.search}`);
  }

  return (
    <form onSubmit={handleSubmit} className="mb-4 flex items-end gap-2">
      <div className="w-72">
        <UserSearchInput onChange={setTargetId} defaultSelected={defaultUser} />
      </div>
      <button type="submit" className="rounded bg-ink-700 px-3 py-2 text-sm text-mist-100 hover:scale-[1.02] hover:bg-ink-600">
        Search
      </button>
    </form>
  );
}
