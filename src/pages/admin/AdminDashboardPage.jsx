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
    admins: 0,
    totalListings: 0,
    totalProperties: 0,
    totalServices: 0,
    totalPosts: 0,
    totalComments: 0,
    unreadNotifications: 0,
  };

  const stats = [
    { label: 'Total users', value: counts.totalUsers },
    { label: 'Total listings', value: counts.totalListings },
    { label: 'Total posts', value: counts.totalPosts },
    { label: 'Unread alerts', value: counts.unreadNotifications },
  ];

  const sections = [
    { title: 'Manage Students', text: `Student accounts: ${counts.students}` },
    { title: 'Manage Renters', text: `Renter accounts: ${counts.renters}` },
    { title: 'Manage Services', text: `Service providers: ${counts.serviceProviders}` },
    { title: 'Content Moderation', text: `Posts: ${counts.totalPosts}, comments: ${counts.totalComments}` },
    { title: 'Reports', text: 'Use notifications and moderation tools to review platform issues.' },
    { title: 'Handle complaints', text: 'Review user feedback and issue follow-ups.' },
  ];

  return (
    <section className="space-y-8">
      <div className="soft-panel rounded-[2.25rem] px-6 py-8 sm:px-10">
        <p className="text-xs font-bold uppercase tracking-[0.28em] text-[#b45309]">Admin</p>
        <h1 className="display-serif mt-4 text-5xl text-[#102a43] sm:text-6xl">
          Platform oversight and moderation.
        </h1>
        <p className="mt-4 max-w-2xl text-[#52606d]">
          Keep an eye on users, listings, posts, alerts, and content quality from one command surface.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat, index) => (
          <article
            key={stat.label}
            className={`rounded-[1.5rem] p-5 text-white ${index % 2 === 0 ? 'bg-[#102a43]' : 'bg-[#b45309]'}`}
          >
            <p className="text-[11px] uppercase tracking-[0.24em] text-white/70">{stat.label}</p>
            <p className="mt-4 display-serif text-5xl">
              {loading ? '...' : String(stat.value).padStart(2, '0')}
            </p>
          </article>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {sections.map((section) => (
          <article key={section.title} className="soft-panel rounded-[1.75rem] p-6">
            <h2 className="display-serif text-3xl text-[#102a43]">{section.title}</h2>
            <p className="mt-3 text-sm leading-7 text-[#52606d]">{section.text}</p>
          </article>
        ))}
      </div>

      <div className="soft-panel rounded-[1.75rem] p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.28em] text-[#b45309]">
              Quick actions
            </p>
            <h2 className="display-serif mt-2 text-3xl text-[#102a43]">
              Move faster through admin tasks
            </h2>
          </div>
          <Link to="/admin/users" className="rounded-full bg-[#102a43] px-5 py-3 text-sm font-semibold text-[#f7f1e8]">
            View users
          </Link>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {overview?.usersByRole
            ? Object.entries(overview.usersByRole).map(([role, users]) => (
                <article key={role} className="rounded-[1.25rem] bg-white p-4">
                  <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-[#829ab1]">
                    {role.replace('_', ' ')}
                  </p>
                  <p className="mt-3 text-3xl font-black text-[#102a43]">{users.length}</p>
                </article>
              ))
            : null}
        </div>
      </div>
    </section>
  );
}

export default AdminDashboardPage;
