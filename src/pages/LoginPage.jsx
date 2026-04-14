import { Link } from 'react-router-dom';

function LoginPage() {
  const cards = [
    { title: 'Student', href: '/login/student', description: 'Browse rooms and join the community.' },
    { title: 'Renter', href: '/login/renter', description: 'Manage listings and tenant requests.' },
    { title: 'Service Provider', href: '/login/service-provider', description: 'Run your service business.' },
  ];

  return (
    <section className="space-y-8">
      <div className="soft-panel rounded-[2.25rem] px-4 py-6 sm:px-8 sm:py-8 lg:px-10">
        <p className="text-xs font-bold uppercase tracking-[0.28em] text-[#b45309]">Login</p>
        <h1 className="display-serif mt-4 text-3xl text-[#102a43] sm:text-5xl lg:text-6xl">
          Choose a role to continue.
        </h1>
        <p className="mt-4 max-w-2xl text-[#52606d]">
          Hover a card and jump into the matching experience for your account type.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((card) => (
          <Link
            key={card.href}
            to={card.href}
            className="group rounded-[1.75rem] border border-[#102a43]/8 bg-white p-5 shadow-[0_16px_40px_rgba(16,42,67,0.06)] transition hover:-translate-y-1 hover:border-[#b45309]/40 hover:shadow-[0_24px_60px_rgba(180,83,9,0.12)]"
          >
            <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-[#829ab1]">
              Click to open
            </p>
            <h2 className="display-serif mt-3 text-3xl text-[#102a43]">{card.title}</h2>
            <p className="mt-3 text-sm leading-7 text-[#52606d]">{card.description}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}

export default LoginPage;
