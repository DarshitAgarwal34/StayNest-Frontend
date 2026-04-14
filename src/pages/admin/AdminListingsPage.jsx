import { useEffect, useState } from 'react';

import {
  deleteAdminProperty,
  deleteAdminService,
  fetchAdminProperties,
  fetchAdminServices,
} from '../../api/api';

function AdminListingsPage() {
  const [properties, setProperties] = useState([]);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = async () => {
    try {
      const [propertiesResponse, servicesResponse] = await Promise.all([
        fetchAdminProperties(),
        fetchAdminServices(),
      ]);

      setProperties(propertiesResponse?.data || []);
      setServices(servicesResponse?.data || []);
    } catch {
      setError('Unable to load listings right now.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleDeleteProperty = async (propertyId) => {
    await deleteAdminProperty(propertyId);
    setProperties((current) => current.filter((property) => property.id !== propertyId));
  };

  const handleDeleteService = async (serviceId) => {
    await deleteAdminService(serviceId);
    setServices((current) => current.filter((service) => service.id !== serviceId));
  };

  return (
    <section className="space-y-8">
      <div className="soft-panel rounded-[2.25rem] px-6 py-8 sm:px-10">
        <p className="text-xs font-bold uppercase tracking-[0.28em] text-[#b45309]">Admin</p>
        <h1 className="display-serif mt-4 text-5xl text-[#102a43] sm:text-6xl">
          Total listings
        </h1>
        <p className="mt-4 max-w-2xl text-[#52606d]">
          Review and remove properties or services from the platform.
        </p>
      </div>

      {loading ? (
        <div className="soft-panel rounded-[1.75rem] p-10 text-center text-[#52606d]">
          Loading listings...
        </div>
      ) : error ? (
        <div className="empty-state rounded-[1.75rem] p-12 text-center">{error}</div>
      ) : (
        <div className="grid gap-6 xl:grid-cols-2">
          <div className="soft-panel rounded-[1.75rem] p-6">
            <h2 className="display-serif text-3xl text-[#102a43]">Properties</h2>
            <div className="mt-5 space-y-3">
              {properties.length ? (
                properties.map((property) => (
                  <article key={property.id} className="rounded-[1.25rem] bg-white p-4">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="font-semibold text-[#102a43]">{property.title}</p>
                        <p className="mt-1 text-sm text-[#52606d]">{property.location}</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleDeleteProperty(property.id)}
                        className="rounded-full bg-[#b45309] px-4 py-2 text-sm font-semibold text-white"
                      >
                        Delete
                      </button>
                    </div>
                  </article>
                ))
              ) : (
                <p className="text-sm text-[#52606d]">No properties found.</p>
              )}
            </div>
          </div>

          <div className="soft-panel rounded-[1.75rem] p-6">
            <h2 className="display-serif text-3xl text-[#102a43]">Services</h2>
            <div className="mt-5 space-y-3">
              {services.length ? (
                services.map((service) => (
                  <article key={service.id} className="rounded-[1.25rem] bg-white p-4">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="font-semibold text-[#102a43]">{service.title}</p>
                        <p className="mt-1 text-sm text-[#52606d]">{service.location}</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleDeleteService(service.id)}
                        className="rounded-full bg-[#b45309] px-4 py-2 text-sm font-semibold text-white"
                      >
                        Delete
                      </button>
                    </div>
                  </article>
                ))
              ) : (
                <p className="text-sm text-[#52606d]">No services found.</p>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

export default AdminListingsPage;
