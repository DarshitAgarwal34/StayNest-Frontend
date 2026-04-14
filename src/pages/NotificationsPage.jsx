import { useEffect, useState } from 'react';

import { fetchNotifications } from '../api/api';
import { connectSocket } from '../socket';

function NotificationsPage() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadNotifications = async () => {
      try {
        const response = await fetchNotifications();
        setNotifications(response?.data || []);
      } catch {
        setNotifications([]);
      } finally {
        setLoading(false);
      }
    };

    loadNotifications();

    const socket = connectSocket();
    const handleNotification = (notification) => {
      setNotifications((current) => [notification, ...current]);
    };

    socket.on('notification', handleNotification);

    return () => socket.off('notification', handleNotification);
  }, []);

  return (
    <section className="space-y-8">
      <div className="soft-panel rounded-[2.25rem] px-4 py-6 sm:px-8 sm:py-8 lg:px-10">
        <p className="text-xs font-bold uppercase tracking-[0.28em] text-[#b45309]">
          Notifications
        </p>
        <div className="mt-4 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h1 className="display-serif text-3xl text-[#102a43] sm:text-5xl lg:text-6xl">
              Live updates from your network.
            </h1>
            <p className="mt-4 max-w-2xl text-[#52606d]">
              Message alerts, post reactions, and account activity all arrive here without a page refresh.
            </p>
          </div>
          <div className="page-chip rounded-[1.5rem] px-4 py-3 text-sm font-semibold text-[#102a43] sm:px-5 sm:py-4">
            Real-time socket updates from the backend
          </div>
        </div>
      </div>

      {loading ? (
        <div className="soft-panel rounded-[1.75rem] p-10 text-center text-[#52606d]">
          Loading notifications...
        </div>
      ) : !notifications.length ? (
        <div className="empty-state rounded-[1.75rem] p-12 text-center">
          <p className="text-xs font-bold uppercase tracking-[0.28em] text-[#829ab1]">
            Inbox
          </p>
          <h2 className="display-serif mt-3 text-2xl text-[#102a43] sm:text-4xl">Coming Soon</h2>
          <p className="mt-3 text-[#52606d]">
            Your notifications will appear here when activity starts.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {notifications.map((notification, index) => (
            <article
              key={notification.id ?? `${notification.content}-${index}`}
              className="soft-panel rounded-[1.5rem] p-5"
            >
              <div className="flex flex-wrap items-center justify-between gap-3">
                <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-[#b45309]">
                  {notification.type || 'Update'}
                </p>
                {notification.is_read ? (
                  <span className="rounded-full bg-[#f1ece2] px-3 py-1 text-xs font-semibold text-[#102a43]">
                    Read
                  </span>
                ) : (
                  <span className="rounded-full bg-[#102a43] px-3 py-1 text-xs font-semibold text-[#f7f1e8]">
                    New
                  </span>
                )}
              </div>
              <p className="mt-3 text-base leading-7 text-[#102a43]">{notification.content}</p>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}

export default NotificationsPage;
