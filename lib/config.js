// Central place for reading env vars, so nothing else reaches into process.env directly.
// Support-bot-only for now — one Firebase project, one bot token.

function required(name) {
  const value = process.env[name];
  if (!value) throw new Error(`Missing required environment variable: ${name}`);
  return value;
}

function csvIds(name) {
  const raw = process.env[name] || '';
  return raw.split(',').map((s) => s.trim()).filter(Boolean);
}

// Matches the support bot's own convention exactly: one env var holding the entire
// downloaded service account JSON file as a single-line value.
function parseServiceAccountJSON(name) {
  const raw = required(name);
  try {
    return JSON.parse(raw);
  } catch (err) {
    throw new Error(`${name} is not valid JSON. Paste the whole service account file contents as one line.`);
  }
}

export const config = {
  get accessCode() {
    return required('DASHBOARD_ACCESS_CODE');
  },
  get botToken() {
    // The support bot's own token — used server-side only, to verify guild
    // membership/roles for login and to resolve Discord user IDs into usernames.
    return required('DISCORD_BOT_TOKEN');
  },
  get guildId() {
    return required('DISCORD_GUILD_ID');
  },
  get staffRoleIds() {
    return csvIds('STAFF_ROLE_IDS');
  },
  get adminUserIds() {
    // Comma-separated Discord user IDs, not usernames — usernames can be changed at
    // any time, which would silently break or misassign admin access. IDs are stable.
    return csvIds('DC_ADMINS');
  },
  get sessionSecret() {
    return required('SESSION_SECRET');
  },
  get firebaseKey() {
    return parseServiceAccountJSON('FIREBASE_KEY');
  },
  // Soft daily Firestore read/write budget. Not a hard enforced cutoff (that would
  // just break the dashboard once hit) — see lib/quota.js for how this is tracked
  // and surfaced instead.
  get dailyRequestBudget() {
    return Number(process.env.FIREBASE_DAILY_REQUEST_BUDGET || 30000);
  },
};
