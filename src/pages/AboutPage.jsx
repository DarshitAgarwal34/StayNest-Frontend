function AboutPage() {
  const blocks = [
    {
      title: 'Vision',
      text: 'Build the most trusted student accommodation platform for finding rooms, people, and support without broker stress.',
    },
    {
      title: 'Mission',
      text: 'Make student living simpler through verified listings, preference-based matching, and a community-led experience.',
    },
    {
      title: 'Why StayNest',
      text: 'StayNest connects housing, roommate discovery, services, and community in one system instead of scattered tabs.',
    },
  ];

  return (
    <section className="space-y-8">
      <div className="soft-panel rounded-[2.25rem] px-6 py-8 sm:px-10">
        <p className="text-xs font-bold uppercase tracking-[0.28em] text-[#b45309]">About</p>
        <h1 className="display-serif mt-4 text-5xl text-[#102a43] sm:text-6xl">
          A housing product with a calmer point of view.
        </h1>
        <p className="mt-4 max-w-3xl text-lg leading-8 text-[#52606d]">
          StayNest exists to help students discover rooms, connect with compatible people, and manage life around housing with less chaos and more trust.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {blocks.map((block) => (
          <article key={block.title} className="soft-panel rounded-[1.75rem] p-6">
            <p className="text-xs font-bold uppercase tracking-[0.24em] text-[#829ab1]">
              {block.title}
            </p>
            <p className="mt-4 text-base leading-7 text-[#102a43]">{block.text}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

export default AboutPage;
