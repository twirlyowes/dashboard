import Avatar from './Avatar';

// Presentational only — expects an already-resolved user object (see lib/discordUsers.js).
// Resolution happens server-side in each page before render, so this component never
// triggers its own fetch and never shows a loading flicker.
export default function UserTag({ user, size = 'sm' }) {
  if (!user) {
    return (
      <span className="inline-flex items-center gap-2">
        <Avatar url={null} size={size} />
        <span className="text-mist-400">Unknown</span>
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-2">
      <Avatar url={user.avatarURL} size={size} />
      <span className="flex flex-col leading-tight">
        <span className="text-mist-100">{user.globalName || user.username}</span>
        <span className="mono text-xs text-mist-400">{user.id}</span>
      </span>
    </span>
  );
}
