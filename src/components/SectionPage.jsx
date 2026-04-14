function SectionPage({ title, description, points = [] }) {
  return (
    <section className="space-y-8">
      <div className="soft-panel rounded-[2.25rem] px-4 py-6 sm:px-8 sm:py-8 lg:px-10">
        <p className="text-xs font-bold uppercase tracking-[0.28em] text-[#b45309]">StayNest</p>
        <h1 className="display-serif mt-4 text-3xl text-[#102a43] sm:text-5xl lg:text-6xl">{title}</h1>
        <p className="mt-4 max-w-2xl text-[#52606d]">{description}</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {points.map((point) => (
          <article key={point.title} className="soft-panel rounded-[1.75rem] p-6">
            <p className="text-xs font-bold uppercase tracking-[0.24em] text-[#829ab1]">
              {point.label || 'Preview'}
            </p>
            <h2 className="display-serif mt-3 text-3xl text-[#102a43]">{point.title}</h2>
            <p className="mt-3 text-sm leading-7 text-[#52606d]">{point.text}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

export default SectionPage;
