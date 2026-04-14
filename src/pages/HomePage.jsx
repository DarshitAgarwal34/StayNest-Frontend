import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import { fetchPosts, fetchProperties, fetchServices } from '../api/api';

function HomePage() {
  const [featured, setFeatured] = useState({
    properties: [],
    posts: [],
    services: [],
  });

  useEffect(() => {
    const load = async () => {
      try {
        const [propertiesResponse, postsResponse, servicesResponse] = await Promise.all([
          fetchProperties(),
          fetchPosts(),
          fetchServices(),
        ]);

        setFeatured({
          properties: (propertiesResponse?.data || []).slice(0, 3),
          posts: (postsResponse?.data || []).slice(0, 3),
          services: (servicesResponse?.data || []).slice(0, 3),
        });
      } catch {
        setFeatured({
          properties: [],
          posts: [],
          services: [],
        });
      }
    };

    load();
  }, []);

  return (
    <section className="space-y-10">
      <div className="grid items-stretch gap-6 lg:grid-cols-[1.15fr_0.85fr]">
        <div className="soft-panel relative overflow-hidden rounded-[2.25rem] px-4 py-6 sm:px-8 sm:py-10 lg:px-10 lg:py-12">
          <div className="absolute right-0 top-0 h-44 w-44 rounded-full bg-[#d97706]/10 blur-3xl" />
          <p className="inline-flex rounded-full bg-white px-4 py-1 text-[11px] font-bold uppercase tracking-[0.28em] text-[#b45309]">
            StayNest Atlas
          </p>
          <h1 className="display-serif mt-6 max-w-3xl text-3xl leading-[0.95] text-[#102a43] sm:text-5xl lg:text-7xl">
            Find a room, a rhythm, and the people who fit your life.
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-8 text-[#52606d] sm:text-lg">
            StayNest brings rentals, roommates, services, and real conversations into one calm
            editorial workspace for students and renters.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <Link
              to="/properties"
              className="rounded-full bg-[#102a43] px-6 py-3 text-center text-sm font-semibold text-[#f7f1e8] transition hover:-translate-y-0.5 hover:bg-[#0b1f33]"
            >
              Explore listings
            </Link>
            <Link
              to="/community"
              className="rounded-full border border-[#102a43]/10 bg-white px-6 py-3 text-center text-sm font-semibold text-[#102a43] transition hover:-translate-y-0.5"
            >
              Open community
            </Link>
          </div>
        </div>

        <div className="grid gap-4">
          <div className="soft-panel rounded-[2.25rem] p-5 sm:p-6">
            <p className="text-xs font-bold uppercase tracking-[0.28em] text-[#b45309]">
              Platform Snapshot
            </p>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <div className="rounded-[1.5rem] bg-[#102a43] p-5 text-[#f7f1e8]">
                <p className="text-[11px] uppercase tracking-[0.24em] text-white/60">
                  Listings
                </p>
                <p className="mt-4 text-4xl font-black">{String(featured.properties.length).padStart(2, '0')}</p>
                <p className="mt-2 text-sm text-white/70">featured properties from the backend.</p>
              </div>
              <div className="rounded-[1.5rem] bg-[#d97706] p-5 text-[#fffaf2]">
                <p className="text-[11px] uppercase tracking-[0.24em] text-white/70">
                  Posts
                </p>
                <p className="mt-4 text-4xl font-black">{String(featured.posts.length).padStart(2, '0')}</p>
                <p className="mt-2 text-sm text-white/75">fresh community updates and chatter.</p>
              </div>
            </div>
          </div>

          <div className="soft-panel rounded-[2.25rem] p-5 sm:p-6">
            <p className="text-xs font-bold uppercase tracking-[0.28em] text-[#6b8e72]">
              Why it works
            </p>
            <div className="mt-5 space-y-3">
              {[
                'Verified living options with cleaner discovery',
                'Messaging and community in one shared layer',
                'Services, preferences, and support without app hopping',
              ].map((item) => (
                <div key={item} className="rounded-[1.25rem] bg-white px-4 py-4">
                  <p className="font-semibold text-[#102a43]">{item}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <section className="grid gap-6 lg:grid-cols-3">
        <div className="soft-panel rounded-[2rem] p-5 sm:p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.28em] text-[#6b8e72]">
                Featured properties
              </p>
              <h2 className="display-serif mt-2 text-2xl text-[#102a43] sm:text-3xl">
                Latest rooms on the board
              </h2>
            </div>
            <Link to="/properties" className="text-sm font-semibold text-[#b45309]">
              View all
            </Link>
          </div>
          {!featured.properties.length ? (
            <div className="empty-state mt-6 rounded-[1.5rem] p-8 text-center">
              <h3 className="display-serif text-2xl sm:text-3xl">Coming Soon</h3>
              <p className="mt-2 text-sm text-[#52606d]">
                Property cards will appear here once the backend returns live data.
              </p>
            </div>
          ) : (
            <div className="mt-6 space-y-4">
              {featured.properties.map((property) => (
                <article key={property.id} className="rounded-[1.5rem] bg-white p-5">
                  <p className="font-semibold text-[#102a43]">{property.title}</p>
                  <p className="mt-1 text-sm text-[#52606d]">{property.location}</p>
                  <p className="mt-4 text-2xl font-black text-[#b45309]">Rs {property.rent}</p>
                </article>
              ))}
            </div>
          )}
        </div>

        <div className="soft-panel rounded-[2rem] p-5 sm:p-6">
          <p className="text-xs font-bold uppercase tracking-[0.28em] text-[#6b8e72]">
            Community preview
          </p>
          {!featured.posts.length ? (
            <div className="empty-state mt-6 rounded-[1.5rem] p-8 text-center">
              <h3 className="display-serif text-2xl sm:text-3xl">Coming Soon</h3>
              <p className="mt-2 text-sm text-[#52606d]">
                Posts will appear here as soon as the feed is active.
              </p>
            </div>
          ) : (
            <div className="mt-6 space-y-4">
              {featured.posts.map((post) => (
                <article key={post.id} className="rounded-[1.5rem] bg-white p-5">
                  <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#829ab1]">
                    {post.user?.name || 'StayNest member'}
                  </p>
                  <p className="mt-2 text-[#102a43]">{post.content}</p>
                </article>
              ))}
            </div>
          )}
        </div>

        <div className="soft-panel rounded-[2rem] p-5 sm:p-6">
          <p className="text-xs font-bold uppercase tracking-[0.28em] text-[#b45309]">
            Services
          </p>
          {!featured.services.length ? (
            <div className="empty-state mt-6 rounded-[1.5rem] p-8 text-center">
              <h3 className="display-serif text-2xl sm:text-3xl">Coming Soon</h3>
              <p className="mt-2 text-sm text-[#52606d]">
                Service providers will show here when they are listed.
              </p>
            </div>
          ) : (
            <div className="mt-6 space-y-4">
              {featured.services.map((service) => (
                <article key={service.id} className="rounded-[1.5rem] bg-white p-5">
                  {service.image_url ? (
                    <img
                      src={service.image_url}
                      alt={service.title || 'Service image'}
                      className="mb-4 h-36 w-full rounded-[1rem] bg-[#f7f1e8] object-cover"
                      loading="lazy"
                      decoding="async"
                    />
                  ) : null}
                  <div className="flex items-center justify-between gap-3">
                    <p className="font-semibold text-[#102a43]">{service.title}</p>
                    <span className="font-black text-[#b45309]">Rs {service.price}</span>
                  </div>
                  <p className="mt-2 text-sm text-[#52606d]">{service.location}</p>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>
    </section>
  );
}

export default HomePage;
