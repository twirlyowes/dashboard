import { config } from './config';

const API = 'https://discord.com/api/v10';

function authHeaders() {
  return { Authorization: `Bot ${config.botToken}`, 'Content-Type': 'application/json' };
}

async function discordFetch(path, options = {}) {
  const res = await fetch(`${API}${path}`, { ...options, headers: { ...authHeaders(), ...options.headers } });
  if (!res.ok) {
    const body = await res.text().catch(() => '');
    throw new Error(`Discord API ${res.status} on ${path}: ${body.slice(0, 200)}`);
  }
  if (res.status === 204) return null;
  return res.json();
}

/**
 * Discord's own guild-member-search endpoint — matches on username/nickname prefix.
 * Not cached (search-as-you-type by nature means near-unique queries), but the
 * calling API route rate-limits per IP and the client debounces, so this stays well
 * within Discord's own rate limits without needing a local cache layer.
 */
export async function searchGuildMembers(query, limit = 8) {
  if (!query || query.trim().length === 0) return [];
  const params = new URLSearchParams({ query: query.trim(), limit: String(limit) });
  const members = await discordFetch(`/guilds/${config.guildId}/members/search?${params}`);

  return members.map((m) => ({
    id: m.user.id,
    username: m.user.username,
    globalName: m.user.global_name || m.nick || m.user.username,
    avatarURL: m.user.avatar
      ? `https://cdn.discordapp.com/avatars/${m.user.id}/${m.user.avatar}.png?size=64`
      : `https://cdn.discordapp.com/embed/avatars/${Number(BigInt(m.user.id) >> 22n) % 6}.png`,
  }));
}
