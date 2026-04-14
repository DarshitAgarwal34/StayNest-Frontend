function PropertyGrid({ properties = [], loading, error }) {
  if (loading) {
    return (
      <div className="empty-state mt-8 rounded-[1.75rem] p-10 text-center text-[#52606d]">
        Loading properties...
      </div>
    );
  }

  if (error) {
    return (
      <div className="mt-8 rounded-[1.75rem] border border-rose-200 bg-rose-50 p-8 text-center text-rose-700">
        {error}
      </div>
    );
  }

  if (!properties.length) {
    return (
      <div className="empty-state mt-8 rounded-[1.75rem] p-12 text-center">
        <p className="text-xs font-bold uppercase tracking-[0.28em] text-[#829ab1]">
          Properties
        </p>
        <h2 className="display-serif mt-3 text-4xl text-[#102a43]">Coming Soon</h2>
        <p className="mt-3 text-[#52606d]">
          Listings will appear here once the backend returns live property data.
        </p>
      </div>
    );
  }

  return (
    <div className="mt-8 grid gap-5 lg:grid-cols-3">
      {properties.map((property, index) => (
        <article
          key={property.id ?? property.title ?? index}
          className="overflow-hidden rounded-[1.75rem] border border-[#102a43]/8 bg-white shadow-[0_18px_45px_rgba(16,42,67,0.08)]"
        >
          {property.images?.[0]?.image_url?.trim() ? (
            <img
              src={property.images[0].image_url.trim()}
              alt={property.title || 'Property image'}
              className="h-48 w-full bg-[#f7f1e8] object-cover"
              loading="lazy"
              decoding="async"
            />
          ) : (
            <div
              className={`h-48 ${
                index % 3 === 0
                  ? 'bg-[#102a43]'
                  : index % 3 === 1
                    ? 'bg-[#d97706]'
                    : 'bg-[#6b8e72]'
              }`}
            />
          )}
          <div className="p-5">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-lg font-semibold text-[#102a43]">{property.title || 'Untitled property'}</p>
                <p className="mt-1 text-sm text-[#52606d]">{property.location || 'Location coming soon'}</p>
              </div>
              <span className="rounded-full bg-[#f1ece2] px-3 py-1 text-xs font-semibold text-[#102a43]">
                {property.max_sharing ? `Share ${property.max_sharing}` : 'Ready'}
              </span>
            </div>
            <div className="mt-5 flex items-end justify-between gap-3">
              <p className="display-serif text-3xl text-[#b45309]">Rs {property.rent || '0'}</p>
              <button className="rounded-full bg-[#102a43] px-4 py-2 text-sm font-semibold text-[#f7f1e8]">
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
