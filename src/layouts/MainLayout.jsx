import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { NavLink, Outlet } from 'react-router-dom';

import { getStoredUser, logoutUser } from '../api/api';
import { connectSocket, disconnectSocket } from '../socket';

function MainLayout() {
  const [user, setUser] = useState(() => getStoredUser());
  const [theme, setTheme] = useState(() => localStorage.getItem('staynest_theme') || 'light');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [navMode, setNavMode] = useState('top');
  const [viewportWidth, setViewportWidth] = useState(() =>
    typeof window !== 'undefined' ? window.innerWidth : 1440
  );
  const headerRef = useRef(null);
  const brandRef = useRef(null);
  const navRef = useRef(null);
  const actionsRef = useRef(null);

  useEffect(() => {
    connectSocket();
    const syncUser = () => setUser(getStoredUser());

    window.addEventListener('staynest-auth-change', syncUser);
    window.addEventListener('storage', syncUser);

    return () => {
      window.removeEventListener('staynest-auth-change', syncUser);
      window.removeEventListener('storage', syncUser);
    };
  }, []);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem('staynest_theme', theme);
  }, [theme]);

  useEffect(() => {
    const handleResize = () => setViewportWidth(window.innerWidth);

    handleResize();
    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const isDark = theme === 'dark';
  const useSidebarNav = navMode === 'sidebar' || viewportWidth < 1280;

  useEffect(() => {
    if (!useSidebarNav) {
      setSidebarOpen(false);
    }
  }, [useSidebarNav]);

  const navLinkClass = ({ isActive }) =>
    [
      'inline-flex shrink-0 items-center gap-2 whitespace-nowrap rounded-full px-4 py-2 text-sm font-semibold transition',
      isActive
        ? isDark
          ? 'bg-[#f7f1e8] text-[#102a43] shadow-[0_12px_30px_rgba(2,6,23,0.3)]'
          : 'bg-[#102a43] text-[#f7f1e8] shadow-[0_12px_30px_rgba(16,42,67,0.18)]'
        : isDark
          ? 'text-[#cbd5e1] hover:bg-[#1e293b] hover:text-[#f8fafc]'
          : 'text-[#52606d] hover:bg-white hover:text-[#102a43]',
    ].join(' ');

  const navItems = useMemo(() => {
    if (!user) {
      return [
        { label: 'Home', to: '/' },
        { label: 'Properties', to: '/properties' },
        { label: 'Services', to: '/services' },
        { label: 'Community', to: '/community' },
        { label: 'About', to: '/about' },
        { label: 'Help', to: '/need-help' },
      ];
    }

    const roleNavItems = {
      student: [
        { label: 'Dashboard', to: '/dashboard' },
        { label: 'Properties', to: '/properties' },
        { label: 'Services', to: '/services' },
        { label: 'Community', to: '/community' },
        { label: 'Notifications', to: '/notifications' },
      ],
      renter: [
        { label: 'Dashboard', to: '/dashboard' },
        { label: 'My Properties', to: '/my-properties' },
        { label: 'Add Property', to: '/properties/new' },
        { label: 'Requests', to: '/properties/requests' },
        { label: 'Total listings', to: '/properties/summary' },
        { label: 'Active tenants', to: '/properties/tenants' },
      ],
      service_provider: [
        { label: 'Dashboard', to: '/dashboard' },
        { label: 'Add Service', to: '/services/new' },
        { label: 'My Services', to: '/my-services' },
        { label: 'Active service holders', to: '/services/holders' },
      ],
      admin: [
        { label: 'Dashboard', to: '/admin/dashboard' },
        { label: 'Total users', to: '/admin/users' },
        { label: 'Total listings', to: '/admin/listings' },
        { label: 'Total posts', to: '/admin/posts' },
        { label: 'Reports', to: '/admin/reports' },
        { label: 'Manage Students', to: '/admin/students' },
        { label: 'Manage Services', to: '/admin/services' },
        { label: 'Content Moderation', to: '/admin/moderation' },
        { label: 'Remove fake posts', to: '/admin/fake-posts' },
        { label: 'Handle complaints', to: '/admin/complaints' },
        { label: 'Manage Renters', to: '/admin/renters' },
      ],
    };

    return roleNavItems[user.role] || roleNavItems.student;
  }, [user]);

  useLayoutEffect(() => {
    const measure = () => {
      if (window.innerWidth < 1280) {
        setNavMode('sidebar');
        return;
      }

      const header = headerRef.current;
      const brand = brandRef.current;
      const nav = navRef.current;
      const actions = actionsRef.current;

      if (!header || !brand || !nav || !actions) {
        return;
      }

      const headerWidth = header.clientWidth;
      const brandWidth = brand.getBoundingClientRect().width;
      const actionsWidth = actions.getBoundingClientRect().width;
      const navWidth = nav.scrollWidth;
      const paddingAllowance = 72;

      const availableForNav = headerWidth - brandWidth - actionsWidth - paddingAllowance;
      const shouldUseSidebar = availableForNav < navWidth;

      setNavMode(shouldUseSidebar ? 'sidebar' : 'top');
    };

    measure();

    const observer = new ResizeObserver(measure);

    [headerRef.current, brandRef.current, navRef.current, actionsRef.current].forEach((node) => {
      if (node) {
        observer.observe(node);
      }
    });

    if (document.documentElement) {
      observer.observe(document.documentElement);
    }

    window.addEventListener('resize', measure);

    return () => {
      observer.disconnect();
      window.removeEventListener('resize', measure);
    };
  }, [navItems, isDark, user]);

  const shellBackground = isDark
    ? 'bg-[radial-gradient(circle_at_top_left,_rgba(59,130,246,0.14),_transparent_35%),linear-gradient(180deg,_#0f172a_0%,_#0f172a_72%,_#111827_100%)] text-[#e2e8f0]'
    : 'bg-[radial-gradient(circle_at_top_left,_rgba(217,119,6,0.08),_transparent_35%),linear-gradient(180deg,_#f7f1e8_0%,_#f7f1e8_72%,_#f1ece2_100%)] text-[#102a43]';

  const surfaceClass = isDark ? 'border-white/10 bg-[#0f172a]/90' : 'border-black/5 bg-[#f7f1e8]/90';

  const actionChipClass = isDark
    ? 'border-white/10 bg-[#1e293b] text-[#e2e8f0]'
    : 'border-[#102a43]/10 bg-white text-[#102a43]';

  const primaryChipClass = isDark
    ? 'bg-[#f7f1e8] text-[#102a43]'
    : 'bg-[#102a43] text-[#f7f1e8] hover:bg-[#0b1f33]';

  const openSidebarIcon = (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5">
      <path d="M4 7h16M4 12h16M4 17h16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );

  const closeIcon = (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5">
      <path d="M6 6l12 12M18 6L6 18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );

  const sunIcon = (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5">
      <circle cx="12" cy="12" r="4" fill="none" stroke="currentColor" strokeWidth="2" />
      <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );

  const moonIcon = (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5">
      <path d="M21 13.2A8.5 8.5 0 0 1 10.8 3 9 9 0 1 0 21 13.2Z" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
    </svg>
  );

  const renderNavItems = (onItemClick) =>
    navItems.map((item) => (
      <NavLink
        key={item.to + item.label}
        to={item.to}
        onClick={onItemClick}
        className={navLinkClass}
      >
        <span className="inline-block h-1.5 w-1.5 rounded-full bg-current opacity-50" />
        {item.label}
      </NavLink>
    ));

  return (
    <div className={`min-h-screen ${shellBackground}`}>
      <header className={`sticky top-0 z-50 border-b backdrop-blur-xl ${surfaceClass}`}>
        <div
          ref={headerRef}
          className="mx-auto flex max-w-7xl flex-nowrap items-center gap-3 px-3 py-3 sm:gap-4 sm:px-6 sm:py-4 lg:px-8"
        >
          <NavLink ref={brandRef} to="/" className="flex shrink-0 items-center gap-3">
            <div
              className={`flex h-11 w-11 items-center justify-center rounded-2xl text-lg font-black shadow-[0_16px_32px_rgba(16,42,67,0.2)] sm:h-12 sm:w-12 ${
                isDark
                  ? 'bg-[#f7f1e8] text-[#102a43] shadow-[0_16px_32px_rgba(2,6,23,0.3)]'
                  : 'bg-[#102a43] text-[#f7f1e8]'
              }`}
            >
              S
            </div>
            <div className="min-w-0">
              <p className="text-sm font-black tracking-[0.14em] sm:text-lg">STAYNEST</p>
              <p className={`hidden text-[11px] uppercase tracking-[0.28em] sm:block ${isDark ? 'text-[#94a3b8]' : 'text-[#829ab1]'}`}>
                rooms, people, support
              </p>
            </div>
          </NavLink>

          {!useSidebarNav ? (
            <nav ref={navRef} className="flex min-w-0 flex-1 flex-nowrap justify-center gap-2 overflow-hidden">
              {renderNavItems()}
            </nav>
          ) : (
            <div className="ml-auto flex items-center gap-2">
              <button
                type="button"
                onClick={() => setTheme((current) => (current === 'dark' ? 'light' : 'dark'))}
                className={`inline-flex h-11 items-center rounded-full border px-3 text-sm font-semibold transition hover:-translate-y-0.5 hover:shadow-[0_10px_25px_rgba(16,42,67,0.12)] sm:px-4 ${actionChipClass}`}
              >
                <span className="inline-flex items-center gap-2">
                  {isDark ? moonIcon : sunIcon}
                  <span className="hidden md:inline">{isDark ? 'Light theme' : 'Dark theme'}</span>
                </span>
              </button>

              <button
                type="button"
                onClick={() => setSidebarOpen(true)}
                onMouseEnter={() => setSidebarOpen(true)}
                onFocus={() => setSidebarOpen(true)}
                className={`inline-flex h-11 items-center gap-2 rounded-full border px-3 text-sm font-semibold transition hover:-translate-y-0.5 sm:px-4 ${actionChipClass}`}
                aria-label="Open sidebar"
                aria-expanded={sidebarOpen}
              >
                {openSidebarIcon}
                <span className="hidden md:inline">Open</span>
              </button>
            </div>
          )}

          {!useSidebarNav ? (
            <div ref={actionsRef} className="ml-auto flex shrink-0 items-center gap-2">
              <button
                type="button"
                onClick={() => setTheme((current) => (current === 'dark' ? 'light' : 'dark'))}
                className={`inline-flex h-11 items-center rounded-full border px-3 text-sm font-semibold transition hover:-translate-y-0.5 hover:shadow-[0_10px_25px_rgba(16,42,67,0.12)] sm:px-4 ${actionChipClass}`}
              >
                <span className="inline-flex items-center gap-2">
                  {isDark ? moonIcon : sunIcon}
                  <span className="hidden lg:inline">{isDark ? 'Light theme' : 'Dark theme'}</span>
                </span>
              </button>

              {!user ? (
                <>
                  <NavLink to="/login" className={`hidden rounded-full border px-4 py-2 text-sm font-semibold transition hover:-translate-y-0.5 hover:shadow-[0_10px_25px_rgba(16,42,67,0.12)] ${actionChipClass} md:inline-flex`}>
                    Login
                  </NavLink>
                  <NavLink to="/signup" className={`hidden rounded-full px-4 py-2 text-sm font-semibold transition hover:-translate-y-0.5 ${primaryChipClass} md:inline-flex`}>
                    Signup
                  </NavLink>
                </>
              ) : (
                <>
                  <NavLink to="/profile" className={`hidden rounded-full border px-4 py-2 text-sm font-semibold ${actionChipClass} lg:inline-flex`}>
                    {user.name || 'Profile'}
                  </NavLink>
                  <button
                    type="button"
                    onClick={() => {
                      logoutUser();
                      disconnectSocket();
                      window.location.href = '/';
                    }}
                    className="rounded-full bg-[#b45309] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#92400e]"
                  >
                    Logout
                  </button>
                </>
              )}
            </div>
          ) : null}
        </div>
      </header>

      {sidebarOpen ? (
        <div className="fixed inset-0 z-50 bg-black/40" onClick={() => setSidebarOpen(false)}>
          <aside
            className={`ml-auto h-full w-[86%] max-w-sm overflow-y-auto p-5 shadow-[0_24px_80px_rgba(2,6,23,0.35)] ${
              isDark ? 'bg-[#0f172a] text-[#e2e8f0]' : 'bg-[#f7f1e8] text-[#102a43]'
            }`}
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <p className="text-lg font-black tracking-[0.14em]">STAYNEST</p>
              <button
                type="button"
                onClick={() => setSidebarOpen(false)}
                className={`rounded-full p-2 ${actionChipClass}`}
                aria-label="Close sidebar"
              >
                {closeIcon}
              </button>
            </div>

            <div className="mt-5 flex flex-col gap-3">
              {renderNavItems(() => setSidebarOpen(false))}
            </div>

            <div className="mt-6 flex flex-col gap-3">
              <button
                type="button"
                onClick={() => setTheme((current) => (current === 'dark' ? 'light' : 'dark'))}
                className={`rounded-full border px-4 py-2 text-sm font-semibold ${actionChipClass}`}
              >
                <span className="inline-flex items-center gap-2">
                  {isDark ? moonIcon : sunIcon}
                  <span>{isDark ? 'Light theme' : 'Dark theme'}</span>
                </span>
              </button>

              {!user ? (
                <>
                  <NavLink
                    to="/login"
                    onClick={() => setSidebarOpen(false)}
                    className={`rounded-full border px-4 py-2 text-sm font-semibold ${actionChipClass}`}
                  >
                    Login
                  </NavLink>
                  <NavLink
                    to="/signup"
                    onClick={() => setSidebarOpen(false)}
                    className={`rounded-full px-4 py-2 text-sm font-semibold ${primaryChipClass}`}
                  >
                    Signup
                  </NavLink>
                </>
              ) : (
                <>
                  <NavLink
                    to="/profile"
                    onClick={() => setSidebarOpen(false)}
                    className={`rounded-full border px-4 py-2 text-sm font-semibold ${actionChipClass}`}
                  >
                    {user.name || 'Profile'}
                  </NavLink>
                  <button
                    type="button"
                    onClick={() => {
                      logoutUser();
                      disconnectSocket();
                      window.location.href = '/';
                    }}
                    className="rounded-full bg-[#b45309] px-4 py-2 text-sm font-semibold text-white"
                  >
                    Logout
                  </button>
                </>
              )}
            </div>
          </aside>
        </div>
      ) : null}

        <main className="mx-auto max-w-7xl px-3 py-6 sm:px-6 sm:py-8 lg:px-8">
          <Outlet />
        </main>
      </div>
  );
}

export default MainLayout;
