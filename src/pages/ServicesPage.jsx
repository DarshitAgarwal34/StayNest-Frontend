import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { fetchServices, getStoredUser, requestService } from '../api/api';

function ServicesPage() {
  const navigate = useNavigate();
  const user = getStoredUser();
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [requestingId, setRequestingId] = useState(null);
  const [feedback, setFeedback] = useState('');

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

  return (
    <section className="space-y-8">
      <div className="soft-panel rounded-[2.25rem] px-6 py-8 sm:px-10">
        <p className="text-xs font-bold uppercase tracking-[0.28em] text-[#b45309]">Services</p>
        <div className="mt-4 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h1 className="display-serif text-5xl text-[#102a43] sm:text-6xl">
              Browse services and request the one you need.
            </h1>
            <p className="mt-4 max-w-2xl text-[#52606d]">
              Students can view older service listings, compare offers, and send a live request to the provider.
            </p>
          </div>
          <Link
            to="/dashboard"
            className="rounded-full bg-[#102a43] px-5 py-3 text-sm font-semibold text-[#f7f1e8]"
          >
            Back to Dashboard
          </Link>
        </div>
      </div>

      {feedback ? (
        <p className="rounded-[1.25rem] bg-white px-4 py-3 text-sm font-medium text-[#102a43] shadow-[0_12px_30px_rgba(16,42,67,0.08)]">
          {feedback}
        </p>
      ) : null}

      {loading ? (
        <div className="soft-panel rounded-[1.75rem] p-10 text-center text-[#52606d]">
          Loading services...
        </div>
      ) : !services.length ? (
        <div className="empty-state rounded-[1.75rem] p-12 text-center">
          <p className="text-xs font-bold uppercase tracking-[0.28em] text-[#829ab1]">Services</p>
          <h2 className="display-serif mt-3 text-4xl text-[#102a43]">Coming Soon</h2>
          <p className="mt-3 text-[#52606d]">Service listings will appear here once providers add them.</p>
        </div>
      ) : (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {services.map((service) => (
            <article
              key={service.id}
              className="overflow-hidden rounded-[1.75rem] border border-[#102a43]/8 bg-white shadow-[0_18px_45px_rgba(16,42,67,0.08)]"
            >
              {service.image_url ? (
                <img
                  src={service.image_url}
                  alt={service.title || 'Service image'}
                  className="h-48 w-full bg-[#f7f1e8] object-cover"
                  loading="lazy"
                  decoding="async"
                />
              ) : (
                <div className="h-48 bg-[linear-gradient(135deg,#102a43,#6b8e72)]" />
              )}

              <div className="p-5">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-lg font-semibold text-[#102a43]">{service.title}</p>
                    <p className="mt-1 text-sm text-[#52606d]">{service.location || 'Location pending'}</p>
                  </div>
                  <span className="rounded-full bg-[#f1ece2] px-3 py-1 text-xs font-semibold text-[#102a43]">
                    Rs {service.price || 0}
                  </span>
                </div>

                <p className="mt-4 text-sm text-[#52606d]">
                  {service.description || 'No description added.'}
                </p>

                <button
                  type="button"
                  onClick={() => handleRequest(service.id)}
                  disabled={requestingId === service.id}
                  className="mt-5 w-full rounded-full bg-[#102a43] px-4 py-3 text-sm font-semibold text-[#f7f1e8] transition hover:bg-[#0b1f33] disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {requestingId === service.id ? 'Requesting...' : 'Buy / Request Service'}
                </button>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}

export default ServicesPage;
