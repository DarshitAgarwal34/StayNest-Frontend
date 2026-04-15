import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';

import { deleteProperty, fetchProperties, getStoredUser } from '../api/api';
import { emitCollectionChanged } from '../hooks/useLiveCollections';

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

  const mine = useMemo(() => properties.filter((property) => Number(property.owner_id) === Number(user?.id)), [properties, user]);

  const handleDelete = async (propertyId) => {
    try {
      await deleteProperty(propertyId);
      setProperties((current) => current.filter((property) => property.id !== propertyId));
      emitCollectionChanged('properties');
    } catch {
      setActionError('Unable to delete property right now.');
    }
  };

  return (
    <section className="space-y-8">
      <div className="panel rounded-[2.25rem] px-6 py-8 sm:px-10">
        <p className="eyebrow">My Properties</p>
        <div className="mt-4 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h1 className="display-serif text-5xl sm:text-6xl">Manage your active listings.</h1>
            <p className="mt-4 max-w-2xl muted-text">These are the properties connected to your renter account.</p>
          </div>
          <Link to="/properties/new" className="primary-button rounded-full px-5 py-3 text-sm font-semibold">Add Property</Link>
        </div>
      </div>

      {actionError ? <p className="message-error rounded-[1.25rem] px-4 py-3 text-sm font-medium">{actionError}</p> : null}

      {loading ? (
        <div className="panel rounded-[1.75rem] p-10 text-center muted-text">Loading properties...</div>
      ) : !mine.length ? (
        <div className="empty-state rounded-[1.75rem] p-12 text-center">
          <p className="eyebrow">Properties</p>
          <h2 className="display-serif mt-3 text-4xl">No properties yet</h2>
          <p className="mt-3 muted-text">Create your first listing to see it here.</p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {mine.map((property) => (
            <article key={property.id} className="panel rounded-[1.75rem] p-6">
              {property.images?.[0]?.image_url?.trim() ? <img src={property.images[0].image_url.trim()} alt={property.title || 'Property image'} className="mb-4 h-44 w-full rounded-[1.25rem] object-cover" loading="lazy" decoding="async" /> : null}
              <p className="text-lg font-semibold">{property.title}</p>
              <p className="mt-2 muted-text">{property.location}</p>
              <p className="mt-4 text-2xl font-semibold">Rs {property.rent}</p>
              <button type="button" onClick={() => handleDelete(property.id)} className="secondary-button mt-5 rounded-full px-4 py-2 text-sm font-semibold">Delete</button>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}

export default MyPropertiesPage;
