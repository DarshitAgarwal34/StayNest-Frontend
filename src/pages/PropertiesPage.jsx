import { useEffect, useState } from 'react';

import { fetchProperties } from '../api/api';
import PropertyGrid from '../components/PropertyGrid';

function PropertiesPage() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadProperties = async () => {
      try {
        const response = await fetchProperties();
        setProperties(response?.data || []);
      } catch (apiError) {
        setError(apiError.response?.data?.message || 'Unable to load properties right now.');
      } finally {
        setLoading(false);
      }
    };

    loadProperties();
  }, []);

  return (
    <section className="space-y-8">
      <div className="soft-panel rounded-[2.25rem] px-6 py-8 sm:px-10">
        <p className="text-xs font-bold uppercase tracking-[0.28em] text-[#6b8e72]">
          Properties
        </p>
        <div className="mt-4 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h1 className="display-serif text-5xl text-[#102a43] sm:text-6xl">
              Verified spaces designed for student living.
            </h1>
            <p className="mt-4 max-w-2xl text-[#52606d]">
              Filter through rooms, rental homes, and shared stays without the old clutter.
            </p>
          </div>
          <div className="page-chip rounded-[1.5rem] px-5 py-4 text-sm font-semibold text-[#102a43]">
            Images, amenities, and live pricing from the database
          </div>
        </div>
      </div>

      <PropertyGrid properties={properties} loading={loading} error={error} />
    </section>
  );
}

export default PropertiesPage;
