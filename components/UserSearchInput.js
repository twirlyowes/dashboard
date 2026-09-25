'use client';

import { useState, useEffect, useRef } from 'react';

const ID_PATTERN = /^\d{17,20}$/;

/**
 * Search-as-you-type against Discord's own member search, with a raw-ID fallback
 * for users who've left the server (search only finds current members) or when
 * staff already has the ID handy and typing a name is slower.
 *
 * onChange(id) fires whenever the effective target ID changes — either from
 * clicking a search result or typing a valid-looking raw ID directly.
 */
export default function UserSearchInput({
  label,
  placeholder = 'Search by username, or paste a Discord ID…',
  onChange,
  required,
  defaultSelected = null, // pre-resolved { id, globalName, avatarURL } — e.g. the user a page is already showing
}) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [selected, setSelected] = useState(defaultSelected);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const debounceRef = useRef(null);

  useEffect(() => {
    if (selected) return; // don't search once something's picked
    if (query.trim().length < 2) {
      setResults([]);
      return;
    }

    if (ID_PATTERN.test(query.trim())) {
      // Looks like a raw ID already — no need to search, just let the user submit it.
      setResults([]);
      return;
    }

    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/discord/search-members?query=${encodeURIComponent(query.trim())}`);
        const data = await res.json();
        setResults(data.ok ? data.members : []);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(debounceRef.current);
  }, [query, selected]);

  function selectMember(member) {
    setSelected(member);
    setOpen(false);
    setResults([]);
    onChange(member.id);
  }

  function clearSelection() {
    setSelected(null);
    setQuery('');
    onChange('');
  }

  function handleInputChange(e) {
    const val = e.target.value;
    setQuery(val);
    setOpen(true);
    // A directly-typed raw ID counts as the value immediately, no click needed.
    if (ID_PATTERN.test(val.trim())) onChange(val.trim());
    else onChange('');
  }

  return (
    <div className="relative">
      {label && <label className="mb-1 block text-xs text-mist-400">{label}</label>}

      {selected ? (
        <div className="flex items-center justify-between rounded border border-ink-600 bg-ink-800 px-3 py-2">
          <span className="flex items-center gap-2 text-sm text-mist-100">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            {selected.avatarURL && <img src={selected.avatarURL} alt="" className="h-5 w-5 rounded" />}
            {selected.globalName}
            <span className="mono text-xs text-mist-400">{selected.id}</span>
          </span>
          <button type="button" onClick={clearSelection} className="text-xs text-mist-400 hover:text-bad">
            Change
          </button>
        </div>
      ) : (
        <>
          <input
            type="text"
            required={required}
            value={query}
            onChange={handleInputChange}
            onFocus={() => setOpen(true)}
            onBlur={() => setTimeout(() => setOpen(false), 150)}
            placeholder={placeholder}
            className="mono w-full rounded border border-ink-600 bg-ink-800 px-3 py-2 text-sm text-mist-100 outline-none focus:border-accent"
          />

          {open && (loading || results.length > 0) && (
            <div className="absolute z-10 mt-1 w-full rounded border border-ink-600 bg-ink-900 shadow-lg">
              {loading && <p className="px-3 py-2 text-xs text-mist-400">Searching…</p>}
              {!loading &&
                results.map((member) => (
                  <button
                    key={member.id}
                    type="button"
                    onClick={() => selectMember(member)}
                    className="flex w-full origin-left items-center gap-2 px-3 py-2 text-left text-sm text-mist-100 hover:scale-[1.02] hover:bg-ink-700"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    {member.avatarURL && <img src={member.avatarURL} alt="" className="h-5 w-5 rounded" />}
                    {member.globalName}
                    <span className="mono text-xs text-mist-400">{member.id}</span>
                  </button>
                ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
