import { Link } from 'react-router-dom';

function AuthShell({
  badge = 'StayNest Access',
  title,
  description,
  accent = 'student',
  footer,
  children,
}) {
  const accentStyles = {
    student: 'from-[#102a43] via-[#1f4e5f] to-[#6b8e72]',
    renter: 'from-[#102a43] via-[#b45309] to-[#d97706]',
    service: 'from-[#102a43] via-[#7c3aed] to-[#2563eb]',
  };

  return (
    <section className="grid gap-6 lg:grid-cols-[0.92fr_1.08fr]">
      <aside className={`soft-panel overflow-hidden rounded-[2.25rem] bg-gradient-to-br ${accentStyles[accent] || accentStyles.student} p-6 text-[#f7f1e8] shadow-[0_30px_70px_rgba(16,42,67,0.2)] sm:p-8`}>
        <div className="inline-flex rounded-full border border-white/20 bg-white/10 px-4 py-1 text-[11px] font-bold uppercase tracking-[0.28em] text-white/85">
          {badge}
        </div>
        <h1 className="display-serif mt-6 text-3xl leading-[0.95] sm:text-5xl lg:text-6xl">
          {title}
        </h1>
        <p className="mt-5 max-w-xl text-sm leading-7 text-white/78 sm:text-base">
          {description}
        </p>

        <div className="mt-8 space-y-3">
          {[
            'JWT-authenticated sessions with role aware access',
            'Clean profile data for renters, students, and service providers',
            'Socket powered updates without page refreshes',
          ].map((item) => (
            <div key={item} className="rounded-[1.25rem] border border-white/12 bg-white/8 px-4 py-4">
              <p className="text-sm font-semibold">{item}</p>
            </div>
          ))}
        </div>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Link
            to="/"
            className="rounded-full bg-white px-5 py-3 text-center text-sm font-semibold text-[#102a43] transition hover:-translate-y-0.5"
          >
            Back home
          </Link>
          <Link
            to="/community"
            className="rounded-full border border-white/20 bg-white/10 px-5 py-3 text-center text-sm font-semibold text-white transition hover:-translate-y-0.5"
          >
            Explore community
          </Link>
        </div>
      </aside>

      <div className="soft-panel rounded-[2.25rem] p-5 sm:p-8">
        <div className="max-w-xl">
          <p className="text-xs font-bold uppercase tracking-[0.28em] text-[#b45309]">
            {badge}
          </p>
          <h2 className="display-serif mt-3 text-2xl text-[#102a43] sm:text-4xl">{title}</h2>
          <p className="mt-3 text-sm leading-7 text-[#52606d]">{description}</p>
        </div>

        <div className="mt-8">{children}</div>

        {footer ? <div className="mt-8 text-sm text-[#52606d]">{footer}</div> : null}
      </div>
    </section>
  );
}

export default AuthShell;
