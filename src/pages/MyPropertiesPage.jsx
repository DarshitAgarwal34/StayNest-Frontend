import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';

import { deleteProperty, fetchProperties, getStoredUser } from '../api/api';

function MyPropertiesPage() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionError, setActionError] = useState('');
  const user = getStoredUser();

  useEffect(() => {
    const loadProperties = async () => {
      try {
        const response = await fetchProperties();
        setProperties(response?.data || []);
      } catch {
        setProperties([]);
      } finally {
        setLoading(false);
      }
    };

    loadProperties();
  }, []);

  const mine = useMemo(
    () => properties.filter((property) => Number(property.owner_id) === Number(user?.id)),
    [properties, user]
  );

  const handleDelete = async (propertyId) => {
    try {
      await deleteProperty(propertyId);
      setProperties((current) => current.filter((property) => property.id !== propertyId));
    } catch {
      setActionError('Unable to delete property right now.');
    }
  };

  return (
    <section className="space-y-8">
      <div className="soft-panel rounded-[2.25rem] px-6 py-8 sm:px-10">
        <p className="text-xs font-bold uppercase tracking-[0.28em] text-[#b45309]">
          My Properties
        </p>
        <div className="mt-4 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h1 className="display-serif text-5xl text-[#102a43] sm:text-6xl">
              Manage your active listings.
            </h1>
            <p className="mt-4 max-w-2xl text-[#52606d]">
              These are the properties connected to your renter account. Keep them updated and easy to discover.
            </p>
          </div>
          <Link
            to="/properties/new"
            className="rounded-full bg-[#102a43] px-5 py-3 text-sm font-semibold text-[#f7f1e8]"
          >
            Add Property
          </Link>
        </div>
      </div>

      {actionError ? (
        <p className="rounded-[1.25rem] bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700">
          {actionError}
        </p>
      ) : null}

      {loading ? (
        <div className="soft-panel rounded-[1.75rem] p-10 text-center text-[#52606d]">
          Loading properties...
        </div>
      ) : !mine.length ? (
        <div className="empty-state rounded-[1.75rem] p-12 text-center">
          <p className="text-xs font-bold uppercase tracking-[0.28em] text-[#829ab1]">Properties</p>
          <h2 className="display-serif mt-3 text-4xl text-[#102a43]">Coming Soon</h2>
          <p className="mt-3 text-[#52606d]">Create your first listing to see it here.</p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {mine.map((property) => (
            <article key={property.id} className="soft-panel rounded-[1.75rem] p-6">
              {property.images?.[0]?.image_url?.trim() ? (
                <img
                  src={property.images[0].image_url.trim()}
                  alt={property.title || 'Property image'}
                  className="mb-4 h-44 w-full rounded-[1.25rem] bg-[#f7f1e8] object-cover"
                  loading="lazy"
                  decoding="async"
                />
              ) : null}
              <p className="text-lg font-semibold text-[#102a43]">{property.title}</p>
              <p className="mt-2 text-[#52606d]">{property.location}</p>
              <p className="mt-4 text-2xl font-black text-[#b45309]">Rs {property.rent}</p>
              <button
                type="button"
                onClick={() => handleDelete(property.id)}
                className="mt-5 rounded-full bg-[#b45309] px-4 py-2 text-sm font-semibold text-white"
              >
                Delete
              </button>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}

export default MyPropertiesPage;
