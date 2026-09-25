export const metadata = {
  title: 'Privacy Policy | Pixel Villa Staff Dashboard',
};

export default function PrivacyPage() {
  return (
    <main className="mx-auto max-w-2xl px-6 py-12">
      <h1 className="text-lg font-medium text-mist-100">Privacy Policy</h1>
      <p className="mt-1 text-sm text-mist-400">Last updated: check the date of your most recent edit to this page.</p>

      <div className="mt-8 space-y-6 text-sm leading-relaxed text-mist-200">
        <section>
          <h2 className="mb-2 font-medium text-mist-100">Who this applies to</h2>
          <p>
            This dashboard is an internal tool for Pixel Villa staff only. It is not a public website and is not
            intended for use by general server members. Access requires a Discord ID that holds a recognized staff
            role, plus a shared access code.
          </p>
        </section>

        <section>
          <h2 className="mb-2 font-medium text-mist-100">What we collect</h2>
          <ul className="list-inside list-disc space-y-1">
            <li>Your Discord user ID, entered when you log in, used to check your role and identity.</li>
            <li>
              A signed session cookie, valid for 12 hours, that keeps you logged in. It contains your Discord ID and
              access level and nothing else.
            </li>
            <li>
              Your IP address, held in memory only (never written to a database) for a few minutes at a time, used
              solely to rate-limit login attempts and prevent abuse.
            </li>
          </ul>
          <p className="mt-2">
            We do not collect anything beyond this. No analytics, no tracking scripts, no third-party ad or
            marketing tools.
          </p>
        </section>

        <section>
          <h2 className="mb-2 font-medium text-mist-100">What this dashboard displays</h2>
          <p>
            This dashboard reads data that the Pixel Villa support bot already collects during normal server
            operation. It does not gather anything new. That includes: moderation warnings, staff voice/message
            activity, AFK status, and support ticket (ModMail) records. All of this data already exists in the
            bot's own database before the dashboard ever reads it; the dashboard is a viewer, not a separate
            collection point.
          </p>
        </section>

        <section>
          <h2 className="mb-2 font-medium text-mist-100">Who can see what</h2>
          <p>
            Access is role-based and enforced on the server, not just hidden in the interface. Admins (a specific,
            small list of Discord user IDs) can view data for any user. Non-admin staff can only view their own
            warnings, activity, and AFK status, never another person's, even if they know that person's Discord
            ID.
          </p>
        </section>

        <section>
          <h2 className="mb-2 font-medium text-mist-100">Discord usernames and avatars</h2>
          <p>
            When a Discord ID is shown, we resolve it to a username and avatar via Discord's own API so the
            interface is readable instead of a list of numbers. These are cached briefly (up to 24 hours) to avoid
            repeatedly querying Discord's API, then refreshed.
          </p>
        </section>

        <section>
          <h2 className="mb-2 font-medium text-mist-100">Data retention</h2>
          <p>
            Session cookies expire automatically after 12 hours. Username/avatar cache entries expire after 24
            hours. We don't independently retain warnings, activity, AFK, or ticket data; that data's retention is
            governed by the support bot itself, not by this dashboard.
          </p>
        </section>

        <section>
          <h2 className="mb-2 font-medium text-mist-100">Questions</h2>
          <p>Reach out to a Pixel Villa admin directly if you have questions about this policy or your data.</p>
        </section>
      </div>
    </main>
  );
}
