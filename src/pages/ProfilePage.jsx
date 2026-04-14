import { getStoredUser } from '../api/api';

function ProfilePage() {
  const user = getStoredUser();

  return (
    <section className="space-y-8">
      <div className="soft-panel rounded-[2.25rem] px-6 py-8 sm:px-10">
        <p className="text-xs font-bold uppercase tracking-[0.28em] text-[#b45309]">Profile</p>
        <h1 className="display-serif mt-4 text-5xl text-[#102a43] sm:text-6xl">
          Your StayNest identity.
        </h1>
        <p className="mt-4 max-w-2xl text-[#52606d]">
          We keep the public-facing details simple so your account feels clear and easy to use.
        </p>
      </div>

      {!user ? (
        <div className="empty-state rounded-[1.75rem] p-12 text-center">
          <p className="text-xs font-bold uppercase tracking-[0.28em] text-[#829ab1]">Account</p>
          <h2 className="display-serif mt-3 text-4xl text-[#102a43]">Coming Soon</h2>
          <p className="mt-3 text-[#52606d]">Login to view your profile details.</p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {[
            ['Name', user.name || 'N/A'],
            ['Role', (user.role || 'member').replace('_', ' ')],
            ['Email', user.email || 'N/A'],
            ['Phone', user.phone || 'N/A'],
            ['DOB', user.dob || 'N/A'],
            ['Gender', user.gender || 'N/A'],
          ].map(([label, value]) => (
            <article key={label} className="soft-panel rounded-[1.5rem] p-5">
              <p className="text-xs font-bold uppercase tracking-[0.24em] text-[#829ab1]">{label}</p>
              <p className="mt-3 text-lg font-semibold text-[#102a43]">{value}</p>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}

export default ProfilePage;
