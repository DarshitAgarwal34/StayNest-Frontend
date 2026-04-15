import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { loginUser } from '../../api/api';
import AuthShell from '../../components/AuthShell';
import { connectSocket } from '../../socket';

function LoginStudent() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError('');

    try {
      await loginUser({ ...form, role: 'student' });
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
      badge="Student login"
      title="Sign in to your student account."
      description="Use your student credentials to open listings, conversations, and notifications."
      footer={<p>New here? <Link className="font-semibold text-[var(--accent-strong)]" to="/signup/student">Create a student account</Link></p>}
    >
      <form className="space-y-4" onSubmit={handleSubmit}>
        <div>
          <label className="mb-2 block text-sm font-semibold">Email</label>
          <input type="email" required value={form.email} onChange={(e) => setForm((current) => ({ ...current, email: e.target.value }))} className="field" placeholder="student@staynest.com" />
        </div>
        <div>
          <label className="mb-2 block text-sm font-semibold">Password</label>
          <input type="password" required value={form.password} onChange={(e) => setForm((current) => ({ ...current, password: e.target.value }))} className="field" placeholder="Password" />
          <div className="mt-2 text-right">
            <Link className="text-xs font-semibold text-[var(--accent-strong)]" to="/forgot-password/student">Forgot password?</Link>
          </div>
        </div>
        {error ? <p className="message-error rounded-[1.25rem] px-4 py-3 text-sm font-medium">{error}</p> : null}
        <button type="submit" disabled={loading} className="primary-button w-full rounded-full px-5 py-3 text-sm font-semibold disabled:opacity-70">
          {loading ? 'Signing in...' : 'Login as Student'}
        </button>
      </form>
    </AuthShell>
  );
}

export default LoginStudent;
