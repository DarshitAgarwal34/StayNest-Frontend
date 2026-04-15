import { useMemo, useState } from 'react';

import { fetchProperties } from '../api/api';
import PropertyGrid from '../components/PropertyGrid';
import { useLiveCollections } from '../hooks/useLiveCollections';

function PropertiesPage() {
  const { items: properties, loading, error } = useLiveCollections('properties', fetchProperties);
  const [filters, setFilters] = useState({
    search: '',
    maxRent: '',
    sort: 'latest',
  });

  const filteredProperties = useMemo(() => {
    const normalizedSearch = filters.search.trim().toLowerCase();

    const next = properties.filter((property) => {
      const matchesSearch = normalizedSearch
        ? `${property.title || ''} ${property.location || ''} ${property.description || ''}`
            .toLowerCase()
            .includes(normalizedSearch)
        : true;
      const matchesRent = filters.maxRent ? Number(property.rent || 0) <= Number(filters.maxRent) : true;
      return matchesSearch && matchesRent;
    });

    if (filters.sort === 'rent-asc') {
      return [...next].sort((a, b) => Number(a.rent || 0) - Number(b.rent || 0)).slice(0, 30);
    }

    if (filters.sort === 'rent-desc') {
      return [...next].sort((a, b) => Number(b.rent || 0) - Number(a.rent || 0)).slice(0, 30);
    }

    return next.slice(0, 30);
  }, [filters, properties]);

  return (
    <section className="space-y-8">
      <div className="panel rounded-[2.25rem] px-6 py-8 sm:px-8">
        <p className="eyebrow">Properties</p>
        <div className="mt-4 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <h1 className="display-serif text-5xl sm:text-6xl">
              Find your next stay with clarity, speed, and a refined browsing experience.
            </h1>
            <p className="mt-4 max-w-2xl muted-text">
              Easily navigate curated listings, compare options, and make informed choices with an intuitive interface.
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
                value={filters.maxRent}
                onChange={(event) => setFilters((current) => ({ ...current, maxRent: event.target.value }))}
                placeholder="Max rent"
                className="field"
              />
              <select
                value={filters.sort}
                onChange={(event) => setFilters((current) => ({ ...current, sort: event.target.value }))}
                className="field-select sm:col-span-3"
              >
                <option value="latest">Latest first</option>
                <option value="rent-asc">Rent low to high</option>
                <option value="rent-desc">Rent high to low</option>
              </select>
            </div>
            <p className="mt-4 text-sm muted-text">Showing {filteredProperties.length} of {properties.length} available properties.</p>
          </div>
        </div>
      </div>

      <PropertyGrid properties={filteredProperties} loading={loading} error={error} />
    </section>
  );
}

export default PropertiesPage;
