function PropertyGrid({ properties = [], loading, error }) {
  if (loading) {
    return (
      <div className="empty-state mt-8 rounded-[1.75rem] p-10 text-center muted-text">
        Loading properties...
      </div>
    );
  }

  if (error) {
    return (
      <div className="message-error mt-8 rounded-[1.75rem] p-8 text-center">
        {error}
      </div>
    );
  }

  if (!properties.length) {
    return (
      <div className="empty-state mt-8 rounded-[1.75rem] p-12 text-center">
        <p className="eyebrow">Properties</p>
        <h2 className="display-serif mt-3 text-4xl">Coming Soon</h2>
        <p className="mt-3 muted-text">
          Listings will appear here once the backend returns live property data.
        </p>
      </div>
    );
  }

  return (
    <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
      {properties.map((property, index) => (
        <article
          key={property.id ?? property.title ?? index}
          className="panel-strong overflow-hidden rounded-[1.75rem]"
        >
          {property.images?.[0]?.image_url?.trim() ? (
            <img
              src={property.images[0].image_url.trim()}
              alt={property.title || 'Property image'}
              className="h-48 w-full object-cover"
              loading="lazy"
              decoding="async"
            />
          ) : (
            <div className="h-48 bg-[var(--surface-muted)]" />
          )}
          <div className="p-5">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-lg font-semibold">{property.title || 'Untitled property'}</p>
                <p className="mt-1 text-sm muted-text">{property.location || 'Location coming soon'}</p>
              </div>
              <span className="rounded-full border border-[var(--border)] px-3 py-1 text-xs font-semibold">
                {property.max_sharing ? `Share ${property.max_sharing}` : 'Ready'}
              </span>
            </div>
            <div className="mt-5 flex items-end justify-between gap-3">
              <p className="display-serif text-3xl">Rs {property.rent || '0'}</p>
              <button className="outline-button rounded-full px-4 py-2 text-sm font-semibold">
                View
              </button>
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}

export default PropertyGrid;
