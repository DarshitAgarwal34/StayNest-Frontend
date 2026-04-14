import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { createProperty, fetchAmenities } from '../api/api';

function AddPropertyPage() {
  const navigate = useNavigate();
  const [amenities, setAmenities] = useState([]);
  const [form, setForm] = useState({
    title: '',
    description: '',
    location: '',
    rent: '',
    max_sharing: '1',
    amenity_ids: [],
    images: [],
  });
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const loadAmenities = async () => {
      try {
        const response = await fetchAmenities();
        setAmenities(response?.data || []);
      } catch {
        setAmenities([]);
      } finally {
        setLoading(false);
      }
    };

    loadAmenities();
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const handleAmenityToggle = (amenityId) => {
    setForm((current) => {
      const exists = current.amenity_ids.includes(amenityId);
      return {
        ...current,
        amenity_ids: exists
          ? current.amenity_ids.filter((id) => id !== amenityId)
          : [...current.amenity_ids, amenityId],
      };
    });
  };

  const handleFiles = (event) => {
    setForm((current) => ({
      ...current,
      images: Array.from(event.target.files || []),
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError('');
    setSuccess('');

    try {
      await createProperty({
        ...form,
        rent: Number(form.rent),
        max_sharing: Number(form.max_sharing),
      });
      setSuccess('Property published successfully.');
      navigate('/my-properties');
    } catch (apiError) {
      setError(apiError.response?.data?.message || 'Unable to publish property right now.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <section className="space-y-8">
      <div className="soft-panel rounded-[2.25rem] px-6 py-8 sm:px-10">
        <p className="text-xs font-bold uppercase tracking-[0.28em] text-[#b45309]">Renter</p>
        <h1 className="display-serif mt-4 text-5xl text-[#102a43] sm:text-6xl">
          Add a property listing.
        </h1>
        <p className="mt-4 max-w-2xl text-[#52606d]">
          Publish a real property with images, rent, sharing limits, and amenities.
        </p>
      </div>

      <form
        className="grid gap-5 rounded-[2rem] border border-[#102a43]/8 bg-white p-6 shadow-[0_16px_40px_rgba(16,42,67,0.06)]"
        onSubmit={handleSubmit}
      >
        <div className="grid gap-4 md:grid-cols-2">
          <input
            name="title"
            value={form.title}
            onChange={handleChange}
            placeholder="Property title"
            className="w-full rounded-[1.25rem] border border-[#102a43]/10 px-4 py-3"
            required
          />
          <input
            name="location"
            value={form.location}
            onChange={handleChange}
            placeholder="Location"
            className="w-full rounded-[1.25rem] border border-[#102a43]/10 px-4 py-3"
            required
          />
          <input
            name="rent"
            type="number"
            value={form.rent}
            onChange={handleChange}
            placeholder="Rent"
            className="w-full rounded-[1.25rem] border border-[#102a43]/10 px-4 py-3"
            required
          />
          <input
            name="max_sharing"
            type="number"
            min="1"
            value={form.max_sharing}
            onChange={handleChange}
            placeholder="Max sharing"
            className="w-full rounded-[1.25rem] border border-[#102a43]/10 px-4 py-3"
          />
        </div>

        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          placeholder="Property description"
          rows="5"
          className="w-full rounded-[1.25rem] border border-[#102a43]/10 px-4 py-3"
        />

        <label className="block rounded-[1.25rem] border border-dashed border-[#102a43]/20 bg-[#f7f1e8] px-4 py-4">
          <span className="mb-2 block text-sm font-semibold text-[#102a43]">Property images</span>
          <input type="file" multiple accept="image/*" onChange={handleFiles} />
        </label>

        <div>
          <p className="mb-3 text-sm font-semibold text-[#102a43]">Amenities</p>
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            {loading ? (
              <div className="text-sm text-[#52606d]">Loading amenities...</div>
            ) : amenities.length ? (
              amenities.map((amenity) => (
                <label
                  key={amenity.id}
                  className="flex items-center gap-3 rounded-[1rem] border border-[#102a43]/10 px-4 py-3"
                >
                  <input
                    type="checkbox"
                    checked={form.amenity_ids.includes(Number(amenity.id))}
                    onChange={() => handleAmenityToggle(Number(amenity.id))}
                  />
                  <span>{amenity.name}</span>
                </label>
              ))
            ) : (
              <div className="text-sm text-[#52606d]">No amenities found.</div>
            )}
          </div>
        </div>

        {error ? <p className="rounded-[1.25rem] bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</p> : null}
        {success ? <p className="rounded-[1.25rem] bg-emerald-50 px-4 py-3 text-sm text-emerald-700">{success}</p> : null}

        <button
          type="submit"
          disabled={saving}
          className="rounded-full bg-[#102a43] px-5 py-3 text-sm font-semibold text-[#f7f1e8]"
        >
          {saving ? 'Publishing...' : 'Publish Property'}
        </button>
      </form>
    </section>
  );
}

export default AddPropertyPage;
