import { Link } from 'react-router-dom';

export function SectionIntro({ eyebrow, title, description, action }) {
  return (
    <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
      <div className="max-w-3xl">
        {eyebrow ? <p className="eyebrow">{eyebrow}</p> : null}
        <h2 className="display-serif mt-3 text-3xl sm:text-4xl">{title}</h2>
        {description ? <p className="mt-3 text-base leading-7 muted-text">{description}</p> : null}
      </div>
      {action}
    </div>
  );
}

export function CarouselSection({ eyebrow, title, description, action, children }) {
  return (
    <section className="panel rounded-[2rem] p-5 sm:p-7">
      <SectionIntro eyebrow={eyebrow} title={title} description={description} action={action} />
      <div className="mt-6">{children}</div>
    </section>
  );
}

export function PropertyCard({ property }) {
  return (
    <article className="panel-strong flex h-full flex-col overflow-hidden rounded-[1.6rem]">
      {property.images?.[0]?.image_url?.trim() ? (
        <img
          src={property.images[0].image_url.trim()}
          alt={property.title || 'Property image'}
          className="h-52 w-full object-cover"
          loading="lazy"
          decoding="async"
        />
      ) : (
        <div className="h-52 bg-[var(--surface-muted)]" />
      )}
      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-lg font-semibold">{property.title || 'Untitled property'}</p>
            <p className="mt-1 text-sm muted-text">{property.location || 'Location coming soon'}</p>
          </div>
          <span className="rounded-full border border-[var(--border)] px-3 py-1 text-xs font-semibold faint-text">
            {property.max_sharing ? `${property.max_sharing} sharing` : 'Ready'}
          </span>
        </div>
        <p className="mt-4 min-h-[4.5rem] overflow-hidden text-sm leading-6 muted-text">
          {property.description || 'A verified stay option listed on StayNest.'}
        </p>
        <div className="mt-5 flex items-center justify-between gap-3">
          <p className="display-serif text-3xl">Rs {property.rent || 0}</p>
          <span className="eyebrow !tracking-[0.16em]">Listing</span>
        </div>
      </div>
    </article>
  );
}

export function ServiceCard({ service, action }) {
  return (
    <article className="panel-strong flex h-full flex-col overflow-hidden rounded-[1.6rem]">
      {service.image_url ? (
        <img
          src={service.image_url}
          alt={service.title || 'Service image'}
          className="h-52 w-full object-cover"
          loading="lazy"
          decoding="async"
        />
      ) : (
        <div className="h-52 bg-[var(--surface-muted)]" />
      )}
      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-lg font-semibold">{service.title || 'Untitled service'}</p>
            <p className="mt-1 text-sm muted-text">{service.location || 'Location pending'}</p>
          </div>
          <span className="rounded-full border border-[var(--border)] px-3 py-1 text-xs font-semibold">
            Rs {service.price || 0}
          </span>
        </div>
        <p className="mt-4 min-h-[4.5rem] overflow-hidden text-sm leading-6 muted-text">
          {service.description || 'Professional support listed on StayNest.'}
        </p>
        {action ? <div className="mt-5">{action}</div> : null}
      </div>
    </article>
  );
}

export function PostCard({ post }) {
  return (
    <article className="panel-strong flex h-full flex-col rounded-[1.6rem] p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="eyebrow">{post.type || 'Community'}</p>
          <p className="mt-2 text-base font-semibold">{post.user?.name || post.user_name || 'StayNest member'}</p>
        </div>
        <span className="rounded-full border border-[var(--border)] px-3 py-1 text-xs font-semibold faint-text">
          Post
        </span>
      </div>
      <p className="mt-4 min-h-[9rem] overflow-hidden text-sm leading-7 muted-text">
        {post.content || 'A community update was shared.'}
      </p>
    </article>
  );
}

export function EmptyPanel({ title, description }) {
  return (
    <div className="empty-state rounded-[1.5rem] p-10 text-center">
      <h3 className="display-serif text-3xl">{title}</h3>
      <p className="mt-3 text-sm muted-text">{description}</p>
    </div>
  );
}

export function FooterNavLink({ to, children }) {
  return (
    <Link to={to} className="text-sm muted-text hover:text-[var(--accent-strong)]">
      {children}
    </Link>
  );
}
