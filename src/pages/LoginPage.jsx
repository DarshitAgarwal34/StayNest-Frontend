import { Link } from 'react-router-dom';

function LoginPage() {
  const cards = [
    { title: 'Student', href: '/login/student', description: 'Browse rooms and join the community.' },
    { title: 'Renter', href: '/login/renter', description: 'Manage listings and tenant requests.' },
    { title: 'Service Provider', href: '/login/service-provider', description: 'Run your service business.' },
  ];

  return (
    <section className="space-y-8">
      <div className="panel rounded-[2.25rem] px-4 py-6 sm:px-8 sm:py-8 lg:px-10">
        <p className="eyebrow">Login</p>
        <h1 className="display-serif mt-4 text-3xl sm:text-5xl lg:text-6xl">
          Choose your role and continue.
        </h1>
        <p className="mt-4 max-w-2xl muted-text">
          One heading, one clear choice, no extra clutter.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {cards.map((card) => (
          <Link key={card.href} to={card.href} className="panel-strong rounded-[1.75rem] p-5 hover:-translate-y-1">
            <p className="eyebrow">Open</p>
            <h2 className="display-serif mt-3 text-3xl">{card.title}</h2>
            <p className="mt-3 text-sm leading-7 muted-text">{card.description}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}

export default LoginPage;
