import { Link } from 'react-router-dom';

const roles = [
  {
    role: 'student',
    title: 'Student',
    description: 'Find rooms, join community threads, and manage your preferences.',
    login: '/login/student',
    signup: '/signup/student',
  },
  {
    role: 'renter',
    title: 'Renter',
    description: 'List properties, answer requests, and track your tenants.',
    login: '/login/renter',
    signup: '/signup/renter',
  },
  {
    role: 'service_provider',
    title: 'Service Provider',
    description: 'Publish services, manage demand, and keep offers fresh.',
    login: '/login/service-provider',
    signup: '/signup/service-provider',
  },
  {
    role: 'admin',
    title: 'Admin',
    description: 'Moderate content, manage users, and review platform health.',
    login: '/login/admin',
    signup: '/signup/admin',
  },
];

function RoleChoicePage({ mode = 'login' }) {
  return (
    <section className="space-y-8">
      <div className="soft-panel rounded-[2.25rem] px-4 py-6 sm:px-8 sm:py-8 lg:px-10">
        <p className="text-xs font-bold uppercase tracking-[0.28em] text-[#b45309]">
          {mode === 'login' ? 'Login' : 'Signup'}
        </p>
        <h1 className="display-serif mt-4 text-3xl text-[#102a43] sm:text-5xl lg:text-6xl">
          Choose your path.
        </h1>
        <p className="mt-4 max-w-2xl text-[#52606d]">
          Pick the account type that matches what you want to do in StayNest. Each card opens a dedicated role-based flow.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {roles.map((role) => (
          <article
            key={role.role}
            className="group rounded-[1.75rem] border border-[#102a43]/8 bg-white p-5 shadow-[0_16px_40px_rgba(16,42,67,0.06)] transition hover:-translate-y-1 hover:border-[#b45309]/40 hover:shadow-[0_24px_60px_rgba(180,83,9,0.12)]"
          >
            <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-[#829ab1]">
              {role.role.replace('_', ' ')}
            </p>
            <h2 className="display-serif mt-3 text-3xl text-[#102a43]">{role.title}</h2>
            <p className="mt-3 text-sm leading-7 text-[#52606d]">{role.description}</p>
            <div className="mt-5 flex flex-col gap-2 sm:flex-row">
              <Link
                to={role.login}
                className="rounded-full bg-[#102a43] px-4 py-2 text-center text-sm font-semibold text-[#f7f1e8]"
              >
                Login
              </Link>
              <Link
                to={role.signup}
                className="rounded-full border border-[#102a43]/10 bg-[#f7f1e8] px-4 py-2 text-center text-sm font-semibold text-[#102a43]"
              >
                Signup
              </Link>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

export default RoleChoicePage;
