import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { signupUser } from '../../api/api';
import AuthShell from '../../components/AuthShell';
import { connectSocket } from '../../socket';

function SignupService() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    dob: '',
    gender: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError('');

    try {
      await signupUser({
        ...form,
        role: 'service_provider',
      });
      connectSocket();
      navigate('/dashboard');
    } catch (apiError) {
      setError(apiError.response?.data?.message || 'Signup failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell
      badge="Service signup"
      title="List your services and manage incoming requests with less friction."
      description="Create a provider account to publish offerings, reply quickly, and stay connected to the StayNest community."
      accent="service"
      footer={
        <p>
          Already have an account?{' '}
          <Link className="font-semibold text-[#b45309]" to="/login/service-provider">
            Sign in here
          </Link>
        </p>
      }
    >
      <form className="grid gap-4 md:grid-cols-2" onSubmit={handleSubmit}>
        <div className="md:col-span-2">
          <label className="mb-2 block text-sm font-semibold text-[#102a43]">Name</label>
          <input
            required
            value={form.name}
            onChange={(e) => setForm((current) => ({ ...current, name: e.target.value }))}
            className="w-full rounded-[1.25rem] border border-[#102a43]/10 bg-white px-4 py-3 outline-none transition focus:border-[#b45309]"
            placeholder="Your business or personal name"
          />
        </div>
        <div>
          <label className="mb-2 block text-sm font-semibold text-[#102a43]">Email</label>
          <input
            type="email"
            required
            value={form.email}
            onChange={(e) => setForm((current) => ({ ...current, email: e.target.value }))}
            className="w-full rounded-[1.25rem] border border-[#102a43]/10 bg-white px-4 py-3 outline-none transition focus:border-[#b45309]"
            placeholder="provider@staynest.com"
          />
        </div>
        <div>
          <label className="mb-2 block text-sm font-semibold text-[#102a43]">Phone</label>
          <input
            value={form.phone}
            onChange={(e) => setForm((current) => ({ ...current, phone: e.target.value }))}
            className="w-full rounded-[1.25rem] border border-[#102a43]/10 bg-white px-4 py-3 outline-none transition focus:border-[#b45309]"
            placeholder="Phone number"
          />
        </div>
        <div>
          <label className="mb-2 block text-sm font-semibold text-[#102a43]">Date of birth</label>
          <input
            type="date"
            value={form.dob}
            onChange={(e) => setForm((current) => ({ ...current, dob: e.target.value }))}
            className="w-full rounded-[1.25rem] border border-[#102a43]/10 bg-white px-4 py-3 outline-none transition focus:border-[#b45309]"
          />
        </div>
        <div>
          <label className="mb-2 block text-sm font-semibold text-[#102a43]">Gender</label>
          <select
            value={form.gender}
            onChange={(e) => setForm((current) => ({ ...current, gender: e.target.value }))}
            className="w-full rounded-[1.25rem] border border-[#102a43]/10 bg-white px-4 py-3 outline-none transition focus:border-[#b45309]"
          >
            <option value="">Select</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
        </div>
        <div className="md:col-span-2">
          <label className="mb-2 block text-sm font-semibold text-[#102a43]">Password</label>
          <input
            type="password"
            required
            value={form.password}
            onChange={(e) => setForm((current) => ({ ...current, password: e.target.value }))}
            className="w-full rounded-[1.25rem] border border-[#102a43]/10 bg-white px-4 py-3 outline-none transition focus:border-[#b45309]"
            placeholder="Create a secure password"
          />
        </div>

        {error ? (
          <p className="md:col-span-2 rounded-[1.25rem] bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700">
            {error}
          </p>
        ) : null}

        <button
          type="submit"
          disabled={loading}
          className="md:col-span-2 w-full rounded-full bg-[#102a43] px-5 py-3 text-sm font-semibold text-[#f7f1e8] transition hover:bg-[#0b1f33] disabled:cursor-not-allowed disabled:opacity-70"
        >
          {loading ? 'Creating account...' : 'Create Service Account'}
        </button>
      </form>
    </AuthShell>
  );
}

export default SignupService;
