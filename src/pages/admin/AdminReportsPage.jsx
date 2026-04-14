import { useEffect, useState } from 'react';

import { fetchAdminReports, markReportRead } from '../../api/api';

function AdminReportsPage() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const response = await fetchAdminReports();
        setReports(response?.data || []);
      } catch {
        setReports([]);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  const handleMarkRead = async (reportId) => {
    const response = await markReportRead(reportId);
    setReports((current) =>
      current.map((report) => (report.id === reportId ? response?.data || report : report))
    );
  };

  return (
    <section className="space-y-8">
      <div className="soft-panel rounded-[2.25rem] px-6 py-8 sm:px-10">
        <p className="text-xs font-bold uppercase tracking-[0.28em] text-[#b45309]">Admin</p>
        <h1 className="display-serif mt-4 text-5xl text-[#102a43] sm:text-6xl">
          Reports
        </h1>
        <p className="mt-4 max-w-2xl text-[#52606d]">
          Review platform alerts, moderation signals, and complaint-style notifications.
        </p>
      </div>

      {loading ? (
        <div className="soft-panel rounded-[1.75rem] p-10 text-center text-[#52606d]">
          Loading reports...
        </div>
      ) : !reports.length ? (
        <div className="empty-state rounded-[1.75rem] p-12 text-center">
          <h2 className="display-serif text-4xl text-[#102a43]">Coming Soon</h2>
          <p className="mt-3 text-[#52606d]">No reports found.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {reports.map((report) => (
            <article key={report.id} className="soft-panel rounded-[1.5rem] p-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-[#b45309]">
                    {report.type}
                  </p>
                  <p className="mt-2 text-[#102a43]">{report.content}</p>
                </div>
                <button
                  type="button"
                  onClick={() => handleMarkRead(report.id)}
                  className="rounded-full bg-[#102a43] px-4 py-2 text-sm font-semibold text-[#f7f1e8]"
                >
                  Mark read
                </button>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}

export default AdminReportsPage;
