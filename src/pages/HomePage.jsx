import { Link } from 'react-router-dom';

import { fetchPosts, fetchProperties, fetchServices } from '../api/api';
import {
  CarouselSection,
  EmptyPanel,
  PostCard,
  PropertyCard,
  ServiceCard,
} from '../components/ShowcaseSections';
import { useLiveCollections } from '../hooks/useLiveCollections';

function HomePage() {
  const { items: properties, loading: propertiesLoading } = useLiveCollections('properties', fetchProperties, { limit: 9 });
  const { items: services, loading: servicesLoading } = useLiveCollections('services', fetchServices, { limit: 9 });
  const { items: posts, loading: postsLoading } = useLiveCollections('posts', fetchPosts, { limit: 9 });

  return (
    <section className="space-y-8">
      <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <section className="panel rounded-[2.4rem] px-6 py-8 sm:px-8 sm:py-10 lg:px-10">
          <p className="eyebrow">Welcome</p>
          <h1 className="display-serif mt-4 max-w-4xl text-4xl sm:text-5xl lg:text-6xl">
            Find places to stay, people to connect with, and services that actually help.
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-8 muted-text sm:text-lg">
            StayNest now opens with a cleaner catalog-first home. Live listings, live services, and live community posts stay visible in one minimal workspace.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link to="/properties" className="primary-button rounded-full px-6 py-3 text-center text-sm font-semibold">
              Explore properties
            </Link>
            <Link to="/services" className="outline-button rounded-full px-6 py-3 text-center text-sm font-semibold">
              Browse services
            </Link>
          </div>
        </section>

        <section className="panel rounded-[2.4rem] p-6 sm:p-8">
          <p className="eyebrow">Platform snapshot</p>
          <div className="mt-5 space-y-4">
            {[
              ['Available listings', properties.length, 'Live backend listings shown on the site.'],
              ['Available services', services.length, 'Provider services ready to request.'],
              ['Available posts', posts.length, 'Community updates in the shared feed.'],
            ].map(([label, value, text]) => (
              <article key={label} className="panel-muted rounded-[1.4rem] p-4">
                <p className="text-sm muted-text">{label}</p>
                <p className="display-serif mt-2 text-4xl">{String(value).padStart(2, '0')}</p>
                <p className="mt-2 text-sm muted-text">{text}</p>
              </article>
            ))}
          </div>
        </section>
      </div>

      <CarouselSection
        eyebrow="Listings"
        title="Available properties"
        description="Up to 9 live properties from the platform."
        action={<Link to="/properties" className="text-sm font-semibold text-[var(--accent-strong)]">View all properties</Link>}
      >
        {propertiesLoading ? (
          <EmptyPanel title="Loading" description="Fetching available properties." />
        ) : properties.length ? (
          <div className="scroll-row">
            {properties.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
        ) : (
          <EmptyPanel title="No listings yet" description="Property listings will appear here as soon as they are available." />
        )}
      </CarouselSection>

      <CarouselSection
        eyebrow="Services"
        title="Available services"
        description="Up to 9 live services from the platform."
        action={<Link to="/services" className="text-sm font-semibold text-[var(--accent-strong)]">View all services</Link>}
      >
        {servicesLoading ? (
          <EmptyPanel title="Loading" description="Fetching available services." />
        ) : services.length ? (
          <div className="scroll-row">
            {services.map((service) => (
              <ServiceCard key={service.id} service={service} />
            ))}
          </div>
        ) : (
          <EmptyPanel title="No services yet" description="Service listings will appear here once providers add them." />
        )}
      </CarouselSection>

      <CarouselSection
        eyebrow="Community"
        title="Available posts"
        description="Up to 9 recent community posts."
        action={<Link to="/community" className="text-sm font-semibold text-[var(--accent-strong)]">Open community</Link>}
      >
        {postsLoading ? (
          <EmptyPanel title="Loading" description="Fetching community posts." />
        ) : posts.length ? (
          <div className="scroll-row">
            {posts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        ) : (
          <EmptyPanel title="No posts yet" description="Community posts will appear here as soon as they are shared." />
        )}
      </CarouselSection>
    </section>
  );
}

export default HomePage;
