const SIZES = { xs: 'h-5 w-5', sm: 'h-6 w-6', md: 'h-8 w-8', lg: 'h-10 w-10' };

/**
 * Small, consistent avatar rendering wherever a Discord user is shown. Purely
 * presentational — takes whatever avatarURL the caller already resolved (via
 * lib/discordUsers.js), never fetches anything itself.
 */
export default function Avatar({ url, size = 'sm' }) {
  const dimension = SIZES[size] || SIZES.sm;
  if (!url) {
    return <div className={`${dimension} shrink-0 rounded-full bg-ink-700`} aria-hidden="true" />;
  }
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={url} alt="" className={`${dimension} shrink-0 rounded-full border border-ink-600 object-cover`} />
  );
}
