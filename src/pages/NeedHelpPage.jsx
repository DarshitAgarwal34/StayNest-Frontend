function NeedHelpPage() {
  const faqs = [
    'How do I find verified properties?',
    'How does roommate matching work?',
    'Can I contact the property owner directly?',
    'How do I get support for a listing or account issue?',
  ];

  return (
    <section className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
      <div className="panel rounded-[2.25rem] p-8">
        <p className="eyebrow">Need Help</p>
        <h1 className="display-serif mt-4 text-5xl">
          Support should feel direct and easy to trust.
        </h1>
        <p className="mt-4 max-w-xl muted-text">
          Browse common questions, reach the support team, or leave a suggestion for the product.
        </p>

        <div className="mt-8 space-y-3">
          {faqs.map((faq) => (
            <div key={faq} className="panel-muted rounded-[1.25rem] px-4 py-4">
              <p className="text-sm font-semibold">{faq}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="panel rounded-[2.25rem] p-8">
        <p className="eyebrow">Contact Support</p>
        <div className="mt-6 space-y-3 muted-text">
          <p><span className="font-semibold text-[var(--text)]">Phone:</span> 236547891</p>
          <p><span className="font-semibold text-[var(--text)]">Email:</span> staynest@gmail.com</p>
          <p><span className="font-semibold text-[var(--text)]">Location:</span> IIIT Kota</p>
        </div>

        <div className="panel-muted mt-8 rounded-[1.5rem] p-6">
          <p className="eyebrow">Suggestion box</p>
          <textarea
            rows="6"
            placeholder="Tell us what needs improvement..."
            className="field-area mt-4"
          />
          <button className="primary-button mt-4 rounded-full px-5 py-3 text-sm font-semibold">
            Send Suggestion
          </button>
        </div>
      </div>
    </section>
  );
}

export default NeedHelpPage;
