import { config } from './config';
import { createSessionToken, SESSION_MAX_AGE_MS } from './session';

/**
 * Constant-time-ish string comparison to avoid trivial timing attacks on the access code.
 * Not cryptographically bulletproof, but meaningfully better than `===` for a shared secret.
 */
function safeCompare(a, b) {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i += 1) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

/**
 * Calls Discord's REST API directly to check guild membership + roles. No gateway
 * connection, no bot process dependency, no Firestore round-trip — just one HTTPS call.
 */
async function fetchGuildMember(discordId) {
  const res = await fetch(`https://discord.com/api/v10/guilds/${config.guildId}/members/${discordId}`, {
    headers: { Authorization: `Bot ${config.botToken}` },
  });

  if (res.status === 404) return null; // not a member
  if (!res.ok) throw new Error(`Discord API error checking membership: ${res.status}`);
  return res.json();
}

function resolveAccessLevel(discordId, member) {
  if (config.adminUserIds.includes(discordId)) return 'admin';
  const hasStaffRole = member.roles.some((roleId) => config.staffRoleIds.includes(roleId));
  return hasStaffRole ? 'staff' : null;
}

/**
 * Full login flow. Returns { ok: true, token } or { ok: false, reason }.
 * `reason` is safe to show the user — never leaks whether the code or ID was the
 * specific problem, so this can't be used to enumerate valid Discord IDs.
 */
export async function login(discordId, accessCode) {
  if (!discordId || !accessCode) {
    return { ok: false, reason: 'Enter your Discord ID and the access code.' };
  }

  if (!safeCompare(accessCode, config.accessCode)) {
    return { ok: false, reason: 'Invalid Discord ID or access code.' };
  }

  const member = await fetchGuildMember(discordId);
  if (!member) {
    return { ok: false, reason: 'Invalid Discord ID or access code.' };
  }

  const level = resolveAccessLevel(discordId, member);
  if (!level) {
    return { ok: false, reason: 'Invalid Discord ID or access code.' };
  }

  const token = await createSessionToken(
    {
      discordId,
      level,
      expiresAt: Date.now() + SESSION_MAX_AGE_MS,
    },
    config.sessionSecret,
  );

  console.log(`[dashboard-auth] Login: ${discordId} (${level}) at ${new Date().toISOString()}`);

  return { ok: true, token, level };
}
