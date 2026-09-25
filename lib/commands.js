// Reference list of every command the support bot actually offers, verified against
// its real source (PREFIX + `command === "..."` matching in warn.js/mod.js/misc.js/
// index.js/afk.js/badwords.js/voicesystem.js/verify.js) — nothing here is guessed.
// This is display-only data for the /dashboard/commands page; it doesn't run anything.

export const PREFIX = '.';

export const COMMAND_CATEGORIES = [
  {
    label: 'Moderation',
    commands: [
      { name: 'warn', usage: '.warn @user [reason]', description: 'Issue a warning to a user.' },
      { name: 'wlist', usage: '.wlist @user', description: "List a user's warnings." },
      { name: 'wremove', usage: '.wremove @user', description: 'Remove a specific warning.' },
      { name: 'wreset', usage: '.wreset @user', description: "Clear a user's warnings." },
      { name: 'mute', usage: '.mute @user [time] [reason]', description: 'Timeout a user for a duration.' },
      { name: 'unmute', usage: '.unmute @user', description: "Remove a user's timeout." },
      { name: 'kick', usage: '.kick @user [reason]', description: 'Kick a user from the server.' },
      { name: 'ban', usage: '.ban @user [reason]', description: 'Ban a user from the server.' },
      { name: 'unban', usage: '.unban [user ID]', description: 'Unban a user by ID.' },
      { name: 'nick', usage: '.nick @user [nickname]', description: "Change a user's nickname." },
      { name: 'lock', usage: '.lock', description: 'Lock the current channel.' },
      { name: 'unlock', usage: '.unlock', description: 'Unlock the current channel.' },
      { name: 'hide', usage: '.hide', description: 'Hide the current channel.' },
      { name: 'unhide', usage: '.unhide', description: 'Unhide the current channel.' },
    ],
  },
  {
    label: 'Utility',
    commands: [
      { name: 'help', usage: '.help', description: 'Show the bot\'s command list.' },
      { name: 'ping', usage: '.ping', description: 'Show bot/WebSocket latency.' },
      { name: 'uptime', usage: '.uptime', description: 'Show how long the bot has been running.' },
      { name: 'purge', usage: '.purge [1-100]', description: 'Bulk-delete recent messages.' },
      { name: 'c', usage: '.c [1-100]', description: 'Shorthand alias for purge.' },
      { name: 'role', usage: '.role @user [role]', description: 'Toggle a role on a member.' },
      { name: 'avatar', usage: '.av / .avatar [@user]', description: "Show a user's avatar." },
      { name: 'userinfo', usage: '.ui / .userinfo [@user]', description: 'Show info about a user.' },
      { name: 'serverinfo', usage: '.si / .serverinfo', description: 'Show info about the server.' },
      { name: 'wiki', usage: '.wiki [search]', description: 'Search the wiki.' },
      { name: 'calculate', usage: '.calculate [expression]', description: 'Evaluate a math expression.' },
      { name: 'say', usage: '.say [message]', description: 'Have the bot repeat a message.' },
      { name: 'dm', usage: '.dm @user [message]', description: 'DM a user through the bot.' },
      { name: 'botinfo', usage: '.botinfo', description: 'Show bot statistics.' },
      { name: 'sticky', usage: '.sticky [message] / .sticky off', description: 'Set or clear a sticky message in a channel.' },
      { name: 'testembed', usage: '.testembed', description: 'Preview an embed.' },
      { name: 'snipe', usage: '.snipe [number]', description: 'Show a recently deleted message.' },
    ],
  },
  {
    label: 'Minigames',
    commands: [
      { name: 'minigames', usage: '.minigames', description: 'Start a minigame.' },
      { name: 'stopgame', usage: '.stopgame', description: 'Stop the current minigame.' },
    ],
  },
  {
    label: 'Temporary Voice Channels',
    commands: [
      { name: 'vclock', usage: '.vclock', description: 'Lock your temp voice channel.' },
      { name: 'vcunlock', usage: '.vcunlock', description: 'Unlock your temp voice channel.' },
      { name: 'vchide', usage: '.vchide', description: 'Hide your temp voice channel.' },
      { name: 'vcunhide', usage: '.vcunhide', description: 'Unhide your temp voice channel.' },
      { name: 'vcname', usage: '.vcname [name]', description: 'Rename your temp voice channel.' },
      { name: 'vclimit', usage: '.vclimit [0-99]', description: 'Set a user limit on your channel.' },
      { name: 'vcadd', usage: '.vcadd @user', description: 'Allow a user into your locked channel.' },
      { name: 'vcremove', usage: '.vcremove @user', description: "Remove a user's access to your channel." },
      { name: 'vckick', usage: '.vckick @user', description: 'Kick a user from your voice channel.' },
      { name: 'vcowner', usage: '.vcowner @user', description: 'Transfer channel ownership.' },
      { name: 'vcsync', usage: '.vcsync', description: 'Sync channel permissions to the category.' },
    ],
  },
  {
    label: 'Verification',
    commands: [
      { name: 'setup verify role', usage: '.setup verify role', description: 'Configure the verified role.' },
      { name: 'setup unverify role', usage: '.setup unverify role', description: 'Configure the unverified role.' },
      { name: 'setupverify', usage: '.setupverify', description: 'Post the verification panel.' },
    ],
  },
  {
    label: 'Bad Word Filter',
    commands: [
      { name: 'addbadword', usage: '.addbadword [word]', description: 'Add a word to the filter.' },
      { name: 'removebadword', usage: '.removebadword [word]', description: 'Remove a word from the filter.' },
      { name: 'badwordslist', usage: '.badwordslist', description: 'List filtered words.' },
    ],
  },
  {
    label: 'Slash Commands',
    commands: [
      { name: 'ping', usage: '/ping', description: 'Show bot/WebSocket latency.' },
    ],
  },
];

export function formatCommand(name) {
  for (const category of COMMAND_CATEGORIES) {
    const found = category.commands.find((c) => c.name === name);
    if (found) return found.usage.split(' ')[0];
  }
  return `${PREFIX}${name}`;
}
