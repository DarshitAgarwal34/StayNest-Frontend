import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import { fetchAdminOverview } from '../../api/api';

function AdminDashboardPage() {
  const [overview, setOverview] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadOverview = async () => {
      try {
        const response = await fetchAdminOverview();
        setOverview(response?.data || null);
      } catch {
        setOverview(null);
      } finally {
        setLoading(false);
      }
    };

    loadOverview();
  }, []);

  const counts = overview?.counts || {
    totalUsers: 0,
    students: 0,
    renters: 0,
    serviceProviders: 0,
    totalListings: 0,
    totalPosts: 0,
    unreadNotifications: 0,
  };

  return (
    <section className="space-y-8">
      <div className="panel rounded-[2.25rem] px-6 py-8 sm:px-10">
        <p className="eyebrow">Admin</p>
        <h1 className="display-serif mt-4 text-5xl sm:text-6xl">Platform oversight and moderation.</h1>
        <p className="mt-4 max-w-2xl muted-text">A cleaner admin dashboard for users, listings, posts, and alerts.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {[
          ['Total users', counts.totalUsers],
          ['Total listings', counts.totalListings],
          ['Total posts', counts.totalPosts],
          ['Unread alerts', counts.unreadNotifications],
        ].map(([label, value]) => (
          <article key={label} className="panel rounded-[1.5rem] p-5">
            <p className="text-sm muted-text">{label}</p>
            <p className="display-serif mt-4 text-5xl">{loading ? '...' : String(value).padStart(2, '0')}</p>
          </article>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {[
          ['Manage Students', `Student accounts: ${counts.students}`, '/admin/users'],
          ['Manage Renters', `Renter accounts: ${counts.renters}`, '/admin/users'],
          ['Manage Services', `Service providers: ${counts.serviceProviders}`, '/admin/listings'],
          ['Content Moderation', `Posts: ${counts.totalPosts}`, '/admin/posts'],
          ['Reports', 'Review active platform reports.', '/admin/reports'],
          ['Alerts', `Unread alerts: ${counts.unreadNotifications}`, '/admin/reports'],
        ].map(([title, text, href]) => (
          <article key={title} className="panel rounded-[1.75rem] p-6">
            <p className="eyebrow">Admin</p>
            <h2 className="display-serif mt-3 text-3xl">{title}</h2>
            <p className="mt-3 text-sm leading-7 muted-text">{text}</p>
            <Link to={href} className="outline-button mt-4 inline-flex rounded-full px-4 py-2 text-sm font-semibold">Open</Link>
          </article>
        ))}
      </div>
    </section>
  );
}

export default AdminDashboardPage;
