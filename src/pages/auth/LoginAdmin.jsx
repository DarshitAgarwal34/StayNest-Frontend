import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { loginUser } from '../../api/api';
import AuthShell from '../../components/AuthShell';
import { connectSocket } from '../../socket';

function LoginAdmin() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError('');
    try {
      await loginUser({ ...form, role: 'admin' });
      connectSocket();
      navigate('/admin/dashboard');
    } catch (apiError) {
      setError(apiError.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell
      badge="Admin login"
      title="Sign in to your admin account."
      description="Use admin access for moderation, user management, and platform oversight."
      footer={<p>Need an admin account? <Link className="font-semibold text-[var(--accent-strong)]" to="/signup/admin">Create one here</Link></p>}
    >
      <form className="space-y-4" onSubmit={handleSubmit}>
        <div>
          <label className="mb-2 block text-sm font-semibold">Email</label>
          <input type="email" required value={form.email} onChange={(e) => setForm((current) => ({ ...current, email: e.target.value }))} className="field" placeholder="admin@staynest.com" />
        </div>
        <div>
          <label className="mb-2 block text-sm font-semibold">Password</label>
          <input type="password" required value={form.password} onChange={(e) => setForm((current) => ({ ...current, password: e.target.value }))} className="field" placeholder="Password" />
          <div className="mt-2 text-right">
            <Link className="text-xs font-semibold text-[var(--accent-strong)]" to="/forgot-password/admin">Forgot password?</Link>
          </div>
        </div>
        {error ? <p className="message-error rounded-[1.25rem] px-4 py-3 text-sm font-medium">{error}</p> : null}
        <button type="submit" disabled={loading} className="primary-button w-full rounded-full px-5 py-3 text-sm font-semibold disabled:opacity-70">
          {loading ? 'Signing in...' : 'Login as Admin'}
        </button>
      </form>
    </AuthShell>
  );
}

export default LoginAdmin;
