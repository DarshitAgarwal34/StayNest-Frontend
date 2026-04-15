import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';

import { deleteService, fetchServices, getStoredUser } from '../api/api';
import { emitCollectionChanged } from '../hooks/useLiveCollections';

function MyServicesPage() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionError, setActionError] = useState('');
  const user = getStoredUser();

  useEffect(() => {
    const loadServices = async () => {
      try {
        const response = await fetchServices();
        setServices(response?.data || []);
      } catch {
        setServices([]);
      } finally {
        setLoading(false);
      }
    };

    loadServices();
  }, []);

  const mine = useMemo(() => services.filter((service) => Number(service.provider_id) === Number(user?.id)), [services, user]);

  const handleDelete = async (serviceId) => {
    try {
      await deleteService(serviceId);
      setServices((current) => current.filter((service) => service.id !== serviceId));
      emitCollectionChanged('services');
    } catch {
      setActionError('Unable to delete service right now.');
    }
  };

  return (
    <section className="space-y-8">
      <div className="panel rounded-[2.25rem] px-6 py-8 sm:px-10">
        <p className="eyebrow">My Services</p>
        <div className="mt-4 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h1 className="display-serif text-5xl sm:text-6xl">Manage your service offerings.</h1>
            <p className="mt-4 max-w-2xl muted-text">Keep your provider listings current so customers can find the right help quickly.</p>
          </div>
          <Link to="/services/new" className="primary-button rounded-full px-5 py-3 text-sm font-semibold">Add Service</Link>
        </div>
      </div>

      {actionError ? <p className="message-error rounded-[1.25rem] px-4 py-3 text-sm font-medium">{actionError}</p> : null}

      {loading ? (
        <div className="panel rounded-[1.75rem] p-10 text-center muted-text">Loading services...</div>
      ) : !mine.length ? (
        <div className="empty-state rounded-[1.75rem] p-12 text-center">
          <p className="eyebrow">Services</p>
          <h2 className="display-serif mt-3 text-4xl">No services yet</h2>
          <p className="mt-3 muted-text">Your service listings will appear here once created.</p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {mine.map((service) => (
            <article key={service.id} className="panel rounded-[1.75rem] p-6">
              {service.image_url ? <img src={service.image_url} alt={service.title || 'Service image'} className="mb-4 h-44 w-full rounded-[1.25rem] object-cover" loading="lazy" decoding="async" /> : null}
              <p className="text-lg font-semibold">{service.title}</p>
              <p className="mt-2 muted-text">{service.description || 'No description added.'}</p>
              <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                <span className="rounded-full border border-[var(--border)] px-3 py-1 text-xs font-semibold">{service.location || 'Location pending'}</span>
                <span className="text-xl font-semibold">Rs {service.price || 0}</span>
              </div>
              <button type="button" onClick={() => handleDelete(service.id)} className="secondary-button mt-5 rounded-full px-4 py-2 text-sm font-semibold">Delete</button>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}

export default MyServicesPage;
