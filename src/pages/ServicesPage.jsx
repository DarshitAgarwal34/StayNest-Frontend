import { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { fetchServices, getStoredUser, requestService } from '../api/api';
import { ServiceCard } from '../components/ShowcaseSections';
import { useLiveCollections } from '../hooks/useLiveCollections';

function ServicesPage() {
  const navigate = useNavigate();
  const user = getStoredUser();
  const { items: services, loading } = useLiveCollections('services', fetchServices);
  const [requestingId, setRequestingId] = useState(null);
  const [feedback, setFeedback] = useState('');
  const [filters, setFilters] = useState({
    search: '',
    maxPrice: '',
    sort: 'latest',
  });

  const handleRequest = async (serviceId) => {
    if (!user) {
      navigate('/login');
      return;
    }

    setRequestingId(serviceId);
    setFeedback('');

    try {
      await requestService(serviceId);
      setFeedback('Service request sent. The provider has been notified.');
    } catch (apiError) {
      setFeedback(apiError.response?.data?.message || 'Unable to request this service right now.');
    } finally {
      setRequestingId(null);
    }
  };

  const filteredServices = useMemo(() => {
    const normalizedSearch = filters.search.trim().toLowerCase();

    const next = services.filter((service) => {
      const matchesSearch = normalizedSearch
        ? `${service.title || ''} ${service.location || ''} ${service.description || ''}`
            .toLowerCase()
            .includes(normalizedSearch)
        : true;
      const matchesPrice = filters.maxPrice ? Number(service.price || 0) <= Number(filters.maxPrice) : true;
      return matchesSearch && matchesPrice;
    });

    if (filters.sort === 'price-asc') {
      return [...next].sort((a, b) => Number(a.price || 0) - Number(b.price || 0)).slice(0, 30);
    }

    if (filters.sort === 'price-desc') {
      return [...next].sort((a, b) => Number(b.price || 0) - Number(a.price || 0)).slice(0, 30);
    }

    return next.slice(0, 30);
  }, [filters, services]);

  return (
    <section className="space-y-8">
      <div className="panel rounded-[2.25rem] px-4 py-6 sm:px-8 sm:py-8 lg:px-10">
        <p className="eyebrow">Services</p>
        <div className="mt-4 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <h1 className="display-serif text-3xl sm:text-5xl lg:text-6xl">
              Explore trusted services with a seamless and thoughtfully designed interface.
            </h1>
            <p className="mt-4 max-w-2xl muted-text">
              Compare options effortlessly, review key details, and connect with the right service in just a few steps.
            </p>
          </div>
          <div className="panel-muted rounded-[1.75rem] p-5">
            <div className="grid gap-4 sm:grid-cols-3">
              <input
                value={filters.search}
                onChange={(event) => setFilters((current) => ({ ...current, search: event.target.value }))}
                placeholder="Search title or location"
                className="field sm:col-span-2"
              />
              <input
                type="number"
                value={filters.maxPrice}
                onChange={(event) => setFilters((current) => ({ ...current, maxPrice: event.target.value }))}
                placeholder="Max price"
                className="field"
              />
              <select
                value={filters.sort}
                onChange={(event) => setFilters((current) => ({ ...current, sort: event.target.value }))}
                className="field-select sm:col-span-3"
              >
                <option value="latest">Latest first</option>
                <option value="price-asc">Price low to high</option>
                <option value="price-desc">Price high to low</option>
              </select>
            </div>
            <div className="mt-4 flex items-center justify-between gap-4">
              <p className="text-sm muted-text">Showing {filteredServices.length} of {services.length} available services.</p>
              <Link
                to={user ? '/dashboard' : '/'}
                className="outline-button rounded-full px-4 py-2 text-sm font-semibold"
              >
                {user ? 'Back to Dashboard' : 'Back Home'}
              </Link>
            </div>
          </div>
        </div>
      </div>

      {feedback ? (
        <p className="panel rounded-[1.25rem] px-4 py-3 text-sm font-medium">
          {feedback}
        </p>
      ) : null}

      {loading ? (
        <div className="panel rounded-[1.75rem] p-10 text-center muted-text">
          Loading services...
        </div>
      ) : !filteredServices.length ? (
        <div className="empty-state rounded-[1.75rem] p-12 text-center">
          <p className="eyebrow">Services</p>
          <h2 className="display-serif mt-3 text-4xl">No matches found</h2>
          <p className="mt-3 muted-text">Try adjusting the filters to see more services.</p>
        </div>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {filteredServices.map((service) => (
            <ServiceCard
              key={service.id}
              service={service}
              action={
                <button
                  type="button"
                  onClick={() => handleRequest(service.id)}
                  disabled={requestingId === service.id}
                  className="primary-button w-full rounded-full px-4 py-3 text-sm font-semibold disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {requestingId === service.id ? 'Requesting...' : 'Buy / Request Service'}
                </button>
              }
            />
          ))}
        </div>
      )}
    </section>
  );
}

export default ServicesPage;
