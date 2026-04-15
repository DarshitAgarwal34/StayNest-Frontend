import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';

import { forgotPassword } from '../../api/api';
import AuthShell from '../../components/AuthShell';

const roleConfig = {
  student: {
    badge: 'Student reset',
    title: 'Reset your student password.',
    description: 'Verify your email and date of birth, then create a new password for this student account.',
    accent: 'student',
    loginPath: '/login/student',
    signupPath: '/signup/student',
  },
  renter: {
    badge: 'Renter reset',
    title: 'Reset your renter password.',
    description: 'Match your email and date of birth to restore access to the renter account.',
    accent: 'renter',
    loginPath: '/login/renter',
    signupPath: '/signup/renter',
  },
  service_provider: {
    badge: 'Service reset',
    title: 'Reset your provider password.',
    description: 'Confirm the email and date of birth tied to the service provider account.',
    accent: 'service',
    loginPath: '/login/service-provider',
    signupPath: '/signup/service-provider',
  },
  admin: {
    badge: 'Admin reset',
    title: 'Reset your admin password.',
    description: 'Confirm the admin account details before setting a fresh password.',
    accent: 'service',
    loginPath: '/login/admin',
    signupPath: '/signup/admin',
  },
};

function ForgotPasswordPage() {
  const navigate = useNavigate();
  const { role } = useParams();
  const currentRole = roleConfig[role] ? role : 'student';
  const config = roleConfig[currentRole];
  const [form, setForm] = useState({
    email: '',
    dob: '',
    new_password: '',
  });
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');

    try {
      await forgotPassword({
        email: form.email,
        dob: form.dob,
        new_password: form.new_password,
        role: currentRole,
      });

      setMessage('Password updated successfully. You can log in with your new password.');
      setTimeout(() => {
        navigate(config.loginPath);
      }, 1200);
    } catch (apiError) {
      setError(apiError.response?.data?.message || 'Unable to reset password right now.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell
      badge={config.badge}
      title={config.title}
      description={config.description}
      accent={config.accent}
      footer={
        <p>
          Remembered it?{' '}
          <Link className="font-semibold text-[#b45309]" to={config.loginPath}>
            Back to login
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
            onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))}
            className="w-full rounded-[1.25rem] border border-[#102a43]/10 bg-white px-4 py-3 outline-none transition focus:border-[#b45309]"
            placeholder="you@staynest.com"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-semibold text-[#102a43]">Date of birth</label>
          <input
            type="date"
            required
            value={form.dob}
            onChange={(event) => setForm((current) => ({ ...current, dob: event.target.value }))}
            className="w-full rounded-[1.25rem] border border-[#102a43]/10 bg-white px-4 py-3 outline-none transition focus:border-[#b45309]"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-semibold text-[#102a43]">New password</label>
          <input
            type="password"
            required
            value={form.new_password}
            onChange={(event) =>
              setForm((current) => ({ ...current, new_password: event.target.value }))
            }
            className="w-full rounded-[1.25rem] border border-[#102a43]/10 bg-white px-4 py-3 outline-none transition focus:border-[#b45309]"
            placeholder="Create a new password"
          />
        </div>

        {error ? (
          <p className="rounded-[1.25rem] bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700">
            {error}
          </p>
        ) : null}

        {message ? (
          <p className="rounded-[1.25rem] bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">
            {message}
          </p>
        ) : null}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-full bg-[#102a43] px-5 py-3 text-sm font-semibold text-[#f7f1e8] transition hover:bg-[#0b1f33] disabled:cursor-not-allowed disabled:opacity-70"
        >
          {loading ? 'Resetting...' : 'Reset Password'}
        </button>
      </form>
    </AuthShell>
  );
}

export default ForgotPasswordPage;
