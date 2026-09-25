export const metadata = {
  title: 'Terms & Conditions | Pixel Villa Staff Dashboard',
};

export default function TermsPage() {
  return (
    <main className="mx-auto max-w-2xl px-6 py-12">
      <h1 className="text-lg font-medium text-mist-100">Terms &amp; Conditions</h1>
      <p className="mt-1 text-sm text-mist-400">Last updated: check the date of your most recent edit to this page.</p>

      <div className="mt-8 space-y-6 text-sm leading-relaxed text-mist-200">
        <section>
          <h2 className="mb-2 font-medium text-mist-100">Purpose</h2>
          <p>
            This dashboard exists to help Pixel Villa staff view moderation, activity, and support-ticket
            information already collected by the support bot. It is a viewing tool, not a moderation-action tool.
            It does not ban, kick, mute, or otherwise act on any user.
          </p>
        </section>

        <section>
          <h2 className="mb-2 font-medium text-mist-100">Who may use this</h2>
          <p>
            Access is limited to Discord accounts holding a recognized Pixel Villa staff role, or explicitly
            listed as an admin. The shared access code is confidential. Do not share it outside the staff team,
            and do not attempt to access this dashboard if you do not currently hold a staff role.
          </p>
        </section>

        <section>
          <h2 className="mb-2 font-medium text-mist-100">Acceptable use</h2>
          <ul className="list-inside list-disc space-y-1">
            <li>Use this dashboard only for legitimate Pixel Villa staff duties.</li>
            <li>Do not attempt to access data belonging to another user beyond what your access level permits.</li>
            <li>Do not attempt to circumvent, brute-force, or abuse the login or rate-limiting systems.</li>
            <li>Do not share screenshots or exports of staff-only data (warnings, activity, tickets) outside the staff team without a legitimate reason.</li>
          </ul>
        </section>

        <section>
          <h2 className="mb-2 font-medium text-mist-100">Accuracy of information</h2>
          <p>
            Data shown here is read directly from the support bot's own records. If something looks wrong, it
            most likely reflects the underlying bot data, not an error introduced by the dashboard itself. Flag
            it to an admin either way.
          </p>
        </section>

        <section>
          <h2 className="mb-2 font-medium text-mist-100">Access can be revoked</h2>
          <p>
            Staff-role or admin access to this dashboard can be revoked at any time, for any reason, at the
            discretion of Pixel Villa's admin team, for example if a staff role is removed or the access code is
            rotated.
          </p>
        </section>

        <section>
          <h2 className="mb-2 font-medium text-mist-100">No warranty</h2>
          <p>
            This dashboard is provided as an internal tool without any warranty of uptime, accuracy, or fitness
            for a particular purpose. It may be changed, taken offline, or have its data sources altered at any
            time.
          </p>
        </section>

        <section>
          <h2 className="mb-2 font-medium text-mist-100">Changes to these terms</h2>
          <p>These terms may be updated as the dashboard changes. Continued use after an update means you accept the current version.</p>
        </section>
      </div>
    </main>
  );
}
