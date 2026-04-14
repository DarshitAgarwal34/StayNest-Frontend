import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';

import { deleteService, fetchServices, getStoredUser } from '../api/api';

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

  const mine = useMemo(
    () => services.filter((service) => Number(service.provider_id) === Number(user?.id)),
    [services, user]
  );

  const handleDelete = async (serviceId) => {
    try {
      await deleteService(serviceId);
      setServices((current) => current.filter((service) => service.id !== serviceId));
    } catch {
      setActionError('Unable to delete service right now.');
    }
  };

  return (
    <section className="space-y-8">
      <div className="soft-panel rounded-[2.25rem] px-6 py-8 sm:px-10">
        <p className="text-xs font-bold uppercase tracking-[0.28em] text-[#b45309]">
          My Services
        </p>
        <div className="mt-4 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h1 className="display-serif text-5xl text-[#102a43] sm:text-6xl">
              Manage your service offerings.
            </h1>
            <p className="mt-4 max-w-2xl text-[#52606d]">
              Keep your provider listings current so customers can find the right help quickly.
            </p>
          </div>
          <Link
            to="/services/new"
            className="rounded-full bg-[#102a43] px-5 py-3 text-sm font-semibold text-[#f7f1e8]"
          >
            Add Service
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
          Loading services...
        </div>
      ) : !mine.length ? (
        <div className="empty-state rounded-[1.75rem] p-12 text-center">
          <p className="text-xs font-bold uppercase tracking-[0.28em] text-[#829ab1]">
            Services
          </p>
          <h2 className="display-serif mt-3 text-4xl text-[#102a43]">Coming Soon</h2>
          <p className="mt-3 text-[#52606d]">
            Your service listings will appear here once created.
          </p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {mine.map((service) => (
            <article key={service.id} className="soft-panel rounded-[1.75rem] p-6">
              {service.image_url ? (
                <img
                  src={service.image_url}
                  alt={service.title || 'Service image'}
                  className="mb-4 h-44 w-full rounded-[1.25rem] bg-[#f7f1e8] object-cover"
                  loading="lazy"
                  decoding="async"
                />
              ) : null}
              <p className="text-lg font-semibold text-[#102a43]">{service.title}</p>
              <p className="mt-2 text-[#52606d]">{service.description || 'No description added.'}</p>
              <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-[#102a43]">
                  {service.location || 'Location pending'}
                </span>
                <span className="text-xl font-black text-[#b45309]">Rs {service.price || 0}</span>
              </div>
              <button
                type="button"
                onClick={() => handleDelete(service.id)}
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

export default MyServicesPage;
