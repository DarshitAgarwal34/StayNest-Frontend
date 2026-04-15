import { getStoredUser } from '../api/api';

function ProfilePage() {
  const user = getStoredUser();

  return (
    <section className="space-y-8">
      <div className="panel rounded-[2.25rem] px-6 py-8 sm:px-10">
        <p className="eyebrow">Profile</p>
        <h1 className="display-serif mt-4 text-5xl sm:text-6xl">Your StayNest profile.</h1>
        <p className="mt-4 max-w-2xl muted-text">Profile data is now presented in a cleaner role-aware layout for students, renters, and service providers.</p>
      </div>

      {!user ? (
        <div className="empty-state rounded-[1.75rem] p-12 text-center">
          <p className="eyebrow">Account</p>
          <h2 className="display-serif mt-3 text-4xl">Login required</h2>
          <p className="mt-3 muted-text">Login to view your profile details.</p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {[
            ['Name', user.name || 'N/A'],
            ['Role', (user.role || 'member').replace('_', ' ')],
            ['Email', user.email || 'N/A'],
            ['Phone', user.phone || 'N/A'],
            ['DOB', user.dob || 'N/A'],
            ['Gender', user.gender || 'N/A'],
          ].map(([label, value]) => (
            <article key={label} className="panel rounded-[1.5rem] p-5">
              <p className="eyebrow">{label}</p>
              <p className="mt-3 text-lg font-semibold">{value}</p>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}

export default ProfilePage;
