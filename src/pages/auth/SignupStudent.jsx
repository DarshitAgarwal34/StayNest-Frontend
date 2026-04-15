import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { signupUser } from '../../api/api';
import AuthShell from '../../components/AuthShell';
import { connectSocket } from '../../socket';

function SignupStudent() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', phone: '', dob: '', gender: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError('');
    try {
      await signupUser({ ...form, role: 'student' });
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
      badge="Student signup"
      title="Create your student account."
      description="Only the details needed to get you into listings, conversations, and notifications."
      footer={<p>Already have an account? <Link className="font-semibold text-[var(--accent-strong)]" to="/login/student">Sign in here</Link></p>}
    >
      <form className="grid gap-4 md:grid-cols-2" onSubmit={handleSubmit}>
        <input required value={form.name} onChange={(e) => setForm((current) => ({ ...current, name: e.target.value }))} className="field md:col-span-2" placeholder="Full name" />
        <input type="email" required value={form.email} onChange={(e) => setForm((current) => ({ ...current, email: e.target.value }))} className="field" placeholder="student@college.edu" />
        <input value={form.phone} onChange={(e) => setForm((current) => ({ ...current, phone: e.target.value }))} className="field" placeholder="Phone number" />
        <input type="date" value={form.dob} onChange={(e) => setForm((current) => ({ ...current, dob: e.target.value }))} className="field" />
        <select value={form.gender} onChange={(e) => setForm((current) => ({ ...current, gender: e.target.value }))} className="field-select">
          <option value="">Gender</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
          <option value="other">Other</option>
        </select>
        <input type="password" required value={form.password} onChange={(e) => setForm((current) => ({ ...current, password: e.target.value }))} className="field md:col-span-2" placeholder="Create password" />
        {error ? <p className="message-error md:col-span-2 rounded-[1.25rem] px-4 py-3 text-sm font-medium">{error}</p> : null}
        <button type="submit" disabled={loading} className="primary-button md:col-span-2 w-full rounded-full px-5 py-3 text-sm font-semibold disabled:opacity-70">
          {loading ? 'Creating account...' : 'Create Student Account'}
        </button>
      </form>
    </AuthShell>
  );
}

export default SignupStudent;
