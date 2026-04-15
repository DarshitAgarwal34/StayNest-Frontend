import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { createService } from '../api/api';
import { emitCollectionChanged } from '../hooks/useLiveCollections';

function AddServicePage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ title: '', description: '', price: '', location: '', image: null });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [preview, setPreview] = useState('');
  const [imageName, setImageName] = useState('');

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const handleImageChange = (event) => {
    const file = event.target.files?.[0] || null;
    setForm((current) => ({ ...current, image: file }));
    setImageName(file?.name || '');
    setPreview((currentPreview) => {
      if (currentPreview) {
        URL.revokeObjectURL(currentPreview);
      }
      return file ? URL.createObjectURL(file) : '';
    });
  };

  useEffect(() => () => {
    if (preview) {
      URL.revokeObjectURL(preview);
    }
  }, [preview]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError('');

    try {
      await createService({ ...form, price: Number(form.price) });
      emitCollectionChanged('services');
      navigate('/my-services');
    } catch (apiError) {
      setError(apiError.response?.data?.message || 'Unable to create service right now.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <section className="space-y-8">
      <div className="panel rounded-[2.25rem] px-6 py-8 sm:px-10">
        <p className="eyebrow">Service Listing</p>
        <h1 className="display-serif mt-4 text-5xl sm:text-6xl">Add a service listing.</h1>
        <p className="mt-4 max-w-2xl muted-text">Create a real service entry with price, location, description, and a cover image.</p>
      </div>

      <form className="panel-strong grid gap-5 rounded-[2rem] p-6" onSubmit={handleSubmit}>
        <div className="grid gap-4 md:grid-cols-2">
          <input name="title" value={form.title} onChange={handleChange} placeholder="Service title" className="field" required />
          <input name="location" value={form.location} onChange={handleChange} placeholder="Location" className="field" required />
          <input name="price" type="number" value={form.price} onChange={handleChange} placeholder="Price" className="field" required />
        </div>

        <textarea name="description" value={form.description} onChange={handleChange} placeholder="Service description" rows="5" className="field-area" />

        <label className="panel-muted block rounded-[1.25rem] px-4 py-4">
          <span className="mb-2 block text-sm font-semibold">Service image</span>
          <input type="file" accept="image/*" onChange={handleImageChange} className="block w-full text-sm" />
          <p className="mt-2 text-xs muted-text">Upload one clear image. It will be shown in the preview below.</p>
        </label>

        {preview ? (
          <div className="panel-muted rounded-[1.5rem] p-3">
            <p className="mb-3 text-sm font-semibold">Selected image{imageName ? `: ${imageName}` : ''}</p>
            <img src={preview} alt="Service preview" className="max-h-[28rem] w-full rounded-[1.25rem] object-contain" />
          </div>
        ) : null}

        {error ? <p className="message-error rounded-[1.25rem] px-4 py-3 text-sm">{error}</p> : null}

        <button type="submit" disabled={saving} className="primary-button rounded-full px-5 py-3 text-sm font-semibold">
          {saving ? 'Publishing...' : 'Publish Service'}
        </button>
      </form>
    </section>
  );
}

export default AddServicePage;
