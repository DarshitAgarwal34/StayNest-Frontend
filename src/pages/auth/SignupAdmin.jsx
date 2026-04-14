import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { signupUser } from '../../api/api';
import AuthShell from '../../components/AuthShell';
import { connectSocket } from '../../socket';

function SignupAdmin() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    dob: '',
    password: '',
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
        role: 'admin',
      });
      connectSocket();
      navigate('/admin/dashboard');
    } catch (apiError) {
      setError(apiError.response?.data?.message || 'Signup failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell
      badge="Admin signup"
      title="Create a controlled admin account for moderation."
      description="Use this route only for trusted admins who need to manage platform operations."
      accent="service"
      footer={
        <p>
          Already set up?{' '}
          <Link className="font-semibold text-[#b45309]" to="/login/admin">
            Sign in here
          </Link>
        </p>
      }
    >
      <form className="space-y-4" onSubmit={handleSubmit}>
        <input
          required
          value={form.name}
          onChange={(e) => setForm((current) => ({ ...current, name: e.target.value }))}
          className="w-full rounded-[1.25rem] border border-[#102a43]/10 bg-white px-4 py-3 outline-none"
          placeholder="Admin name"
        />
        <input
          type="email"
          required
          value={form.email}
          onChange={(e) => setForm((current) => ({ ...current, email: e.target.value }))}
          className="w-full rounded-[1.25rem] border border-[#102a43]/10 bg-white px-4 py-3 outline-none"
          placeholder="admin@staynest.com"
        />
        <input
          type="tel"
          required
          value={form.phone}
          onChange={(e) => setForm((current) => ({ ...current, phone: e.target.value }))}
          className="w-full rounded-[1.25rem] border border-[#102a43]/10 bg-white px-4 py-3 outline-none"
          placeholder="Phone number"
        />
        <input
          type="date"
          required
          value={form.dob}
          onChange={(e) => setForm((current) => ({ ...current, dob: e.target.value }))}
          className="w-full rounded-[1.25rem] border border-[#102a43]/10 bg-white px-4 py-3 outline-none"
        />
        <input
          type="password"
          required
          value={form.password}
          onChange={(e) => setForm((current) => ({ ...current, password: e.target.value }))}
          className="w-full rounded-[1.25rem] border border-[#102a43]/10 bg-white px-4 py-3 outline-none"
          placeholder="Password"
        />
        {error ? <p className="text-sm text-rose-700">{error}</p> : null}
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-full bg-[#102a43] px-5 py-3 text-sm font-semibold text-[#f7f1e8]"
        >
          {loading ? 'Creating account...' : 'Create Admin Account'}
        </button>
      </form>
    </AuthShell>
  );
}

export default SignupAdmin;
