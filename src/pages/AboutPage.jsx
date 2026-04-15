function AboutPage() {
  const blocks = [
    {
      title: 'Vision',
      text: 'Build a trusted place where students and renters can discover housing, people, and day-to-day support without clutter.',
    },
    {
      title: 'Mission',
      text: 'Keep listings, services, and community conversations connected in one clear product with real data underneath.',
    },
    {
      title: 'Approach',
      text: 'Minimal design, role-aware workflows, and a calmer user experience that respects how people actually search and decide.',
    },
  ];

  return (
    <section className="space-y-8">
      <div className="panel rounded-[2.25rem] px-6 py-8 sm:px-10">
        <p className="eyebrow">About</p>
        <h1 className="display-serif mt-4 text-5xl sm:text-6xl">
          A housing platform designed to feel quiet, clear, and dependable.
        </h1>
        <p className="mt-4 max-w-3xl text-lg leading-8 muted-text">
          StayNest connects verified places, services, and community activity in a more professional interface that helps people decide faster and with less noise.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {blocks.map((block) => (
          <article key={block.title} className="panel rounded-[1.75rem] p-6">
            <p className="eyebrow">{block.title}</p>
            <p className="mt-4 text-base leading-7">{block.text}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

export default AboutPage;
