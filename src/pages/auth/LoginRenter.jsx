import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { loginUser } from '../../api/api';
import AuthShell from '../../components/AuthShell';
import { connectSocket } from '../../socket';

function LoginRenter() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError('');

    try {
      await loginUser({ ...form, role: 'renter' });
      connectSocket();
      navigate('/dashboard');
    } catch (apiError) {
      setError(apiError.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell
      badge="Renter login"
      title="Manage listings, leads, and bookings with a cleaner flow."
      description="Use your renter account to update properties, handle messages, and keep your StayNest dashboard moving."
      accent="renter"
      footer={
        <p>
          Need a renter account?{' '}
          <Link className="font-semibold text-[#b45309]" to="/signup/renter">
            Register as a renter
          </Link>
        </p>
      }
    >
      <form className="space-y-4" onSubmit={handleSubmit}>
        <div>
          <label className="mb-2 block text-sm font-semibold text-[#102a43]">Email</label>
          <input
            type="email"
            required
            value={form.email}
            onChange={(e) => setForm((current) => ({ ...current, email: e.target.value }))}
            className="w-full rounded-[1.25rem] border border-[#102a43]/10 bg-white px-4 py-3 outline-none transition focus:border-[#b45309]"
            placeholder="renter@staynest.com"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-semibold text-[#102a43]">Password</label>
          <input
            type="password"
            required
            value={form.password}
            onChange={(e) => setForm((current) => ({ ...current, password: e.target.value }))}
            className="w-full rounded-[1.25rem] border border-[#102a43]/10 bg-white px-4 py-3 outline-none transition focus:border-[#b45309]"
            placeholder="••••••••"
          />
          <div className="mt-2 text-right">
            <Link className="text-xs font-semibold text-[#b45309]" to="/forgot-password/renter">
              Forgot password?
            </Link>
          </div>
        </div>

        {error ? (
          <p className="rounded-[1.25rem] bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700">
            {error}
          </p>
        ) : null}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-full bg-[#102a43] px-5 py-3 text-sm font-semibold text-[#f7f1e8] transition hover:bg-[#0b1f33] disabled:cursor-not-allowed disabled:opacity-70"
        >
          {loading ? 'Signing in...' : 'Login as Renter'}
        </button>
      </form>
    </AuthShell>
  );
}

export default LoginRenter;
