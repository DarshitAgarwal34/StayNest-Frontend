function NeedHelpPage() {
  const faqs = [
    'How do I find verified properties?',
    'How does roommate matching work?',
    'Can I contact the property owner directly?',
    'How do I get support for a listing or account issue?',
  ];

  return (
    <section className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
      <div className="soft-panel rounded-[2.25rem] p-8 text-[#102a43]">
        <p className="text-xs font-bold uppercase tracking-[0.28em] text-[#b45309]">Need Help</p>
        <h1 className="display-serif mt-4 text-5xl text-[#102a43]">
          Support should feel clear, not frustrating.
        </h1>
        <p className="mt-4 max-w-xl text-[#52606d]">
          Browse common questions, send suggestions, or reach the StayNest support team directly.
        </p>

        <div className="mt-8 space-y-3">
          {faqs.map((faq) => (
            <div key={faq} className="rounded-[1.25rem] bg-white px-4 py-4">
              <p className="text-sm font-semibold text-[#102a43]">{faq}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="soft-panel rounded-[2.25rem] p-8">
        <p className="text-xs font-bold uppercase tracking-[0.28em] text-[#b45309]">
          Contact Support
        </p>
        <div className="mt-6 space-y-3 text-[#52606d]">
          <p>
            <span className="font-semibold text-[#102a43]">Phone:</span> 236547891
          </p>
          <p>
            <span className="font-semibold text-[#102a43]">Email:</span> staynest@gmail.com
          </p>
          <p>
            <span className="font-semibold text-[#102a43]">Location:</span> IIIT Kota
          </p>
        </div>

        <div className="mt-8 rounded-[1.5rem] bg-white p-6">
          <p className="text-xs font-bold uppercase tracking-[0.24em] text-[#829ab1]">
            Suggestion box
          </p>
          <textarea
            rows="6"
            placeholder="Tell us what needs improvement..."
            className="mt-4 w-full rounded-[1.25rem] border border-[#102a43]/10 bg-[#f7f1e8] px-4 py-3 outline-none transition focus:border-[#b45309]"
          />
          <button className="mt-4 rounded-full bg-[#102a43] px-5 py-3 text-sm font-semibold text-[#f7f1e8] transition hover:bg-[#0b1f33]">
            Send Suggestion
          </button>
        </div>
      </div>
    </section>
  );
}

export default NeedHelpPage;
