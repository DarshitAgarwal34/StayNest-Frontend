import { Link } from 'react-router-dom';

function SignupPage() {
  const cards = [
    { title: 'Student', href: '/signup/student', description: 'Set up your student profile.' },
    { title: 'Renter', href: '/signup/renter', description: 'Publish and manage properties.' },
    { title: 'Service Provider', href: '/signup/service-provider', description: 'List services and reach users.' },
  ];

  return (
    <section className="space-y-8">
      <div className="panel rounded-[2.25rem] px-6 py-8 sm:px-10">
        <p className="eyebrow">Signup</p>
        <h1 className="display-serif mt-4 text-5xl sm:text-6xl">
          Pick the account you want to create.
        </h1>
        <p className="mt-4 max-w-2xl muted-text">
          Each role keeps its own signup flow with only the information that matters.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
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

export default SignupPage;
