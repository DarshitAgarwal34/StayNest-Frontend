import { useEffect, useMemo, useState } from 'react';

import { deleteAdminUser, fetchAdminUsers } from '../../api/api';

function AdminUsersPage() {
  const [overview, setOverview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [rows, setRows] = useState([]);

  useEffect(() => {
    const load = async () => {
      try {
        const response = await fetchAdminUsers();
        const users = response?.data || [];
        setRows(users);
        setOverview({
          usersByRole: users.reduce((acc, user) => {
            if (!acc[user.role]) acc[user.role] = [];
            acc[user.role].push(user);
            return acc;
          }, {}),
        });
      } catch {
        setOverview(null);
        setRows([]);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  const groupedRows = useMemo(() => {
    const grouped = overview?.usersByRole || {};
    return Object.entries(grouped).flatMap(([role, users]) =>
      users.map((user) => ({ ...user, role }))
    );
  }, [overview]);

  const handleDelete = async (userId) => {
    await deleteAdminUser(userId);
    setRows((current) => current.filter((user) => user.id !== userId));
    setOverview((current) => {
      if (!current?.usersByRole) return current;
      const nextGrouped = Object.fromEntries(
        Object.entries(current.usersByRole).map(([role, users]) => [
          role,
          users.filter((user) => user.id !== userId),
        ])
      );
      return { ...current, usersByRole: nextGrouped };
    });
  };

  return (
    <section className="space-y-8">
      <div className="soft-panel rounded-[2.25rem] px-6 py-8 sm:px-10">
        <p className="text-xs font-bold uppercase tracking-[0.28em] text-[#b45309]">Admin</p>
        <h1 className="display-serif mt-4 text-5xl text-[#102a43] sm:text-6xl">
          Total users
        </h1>
        <p className="mt-4 max-w-2xl text-[#52606d]">
          Review the live account list broken down by role.
        </p>
      </div>

      {loading ? (
        <div className="soft-panel rounded-[1.75rem] p-10 text-center text-[#52606d]">
          Loading users...
        </div>
      ) : !groupedRows.length ? (
        <div className="empty-state rounded-[1.75rem] p-12 text-center">
          <h2 className="display-serif text-4xl text-[#102a43]">Coming Soon</h2>
          <p className="mt-3 text-[#52606d]">No users are available yet.</p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-[1.75rem] border border-[#102a43]/8 bg-white shadow-[0_16px_40px_rgba(16,42,67,0.06)]">
          <table className="min-w-[720px] w-full text-left text-sm">
            <thead className="bg-[#f7f1e8] text-[#102a43]">
              <tr>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Role</th>
                <th className="px-4 py-3">Phone</th>
              </tr>
            </thead>
            <tbody>
              {groupedRows.map((user) => (
                <tr key={user.id} className="border-t border-[#102a43]/8">
                  <td className="px-4 py-3 font-semibold text-[#102a43]">{user.name}</td>
                  <td className="px-4 py-3 text-[#52606d]">{user.email}</td>
                  <td className="px-4 py-3 text-[#52606d]">{user.role}</td>
                  <td className="px-4 py-3 text-[#52606d]">{user.phone || 'N/A'}</td>
                  <td className="px-4 py-3 text-right">
                    <button
                      type="button"
                      onClick={() => handleDelete(user.id)}
                      className="rounded-full bg-[#b45309] px-4 py-2 text-xs font-semibold text-white"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}

export default AdminUsersPage;
