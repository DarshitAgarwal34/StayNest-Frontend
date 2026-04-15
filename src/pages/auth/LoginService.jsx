import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { loginUser } from '../../api/api';
import AuthShell from '../../components/AuthShell';
import { connectSocket } from '../../socket';

function LoginService() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError('');
    try {
      await loginUser({ ...form, role: 'service_provider' });
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
      badge="Service login"
      title="Sign in to your service provider account."
      description="Manage your service listings and incoming requests in one place."
      footer={<p>Need a provider account? <Link className="font-semibold text-[var(--accent-strong)]" to="/signup/service-provider">Register as a service provider</Link></p>}
    >
      <form className="space-y-4" onSubmit={handleSubmit}>
        <div>
          <label className="mb-2 block text-sm font-semibold">Email</label>
          <input type="email" required value={form.email} onChange={(e) => setForm((current) => ({ ...current, email: e.target.value }))} className="field" placeholder="provider@staynest.com" />
        </div>
        <div>
          <label className="mb-2 block text-sm font-semibold">Password</label>
          <input type="password" required value={form.password} onChange={(e) => setForm((current) => ({ ...current, password: e.target.value }))} className="field" placeholder="Password" />
          <div className="mt-2 text-right">
            <Link className="text-xs font-semibold text-[var(--accent-strong)]" to="/forgot-password/service_provider">Forgot password?</Link>
          </div>
        </div>
        {error ? <p className="message-error rounded-[1.25rem] px-4 py-3 text-sm font-medium">{error}</p> : null}
        <button type="submit" disabled={loading} className="primary-button w-full rounded-full px-5 py-3 text-sm font-semibold disabled:opacity-70">
          {loading ? 'Signing in...' : 'Login as Provider'}
        </button>
      </form>
    </AuthShell>
  );
}

export default LoginService;
