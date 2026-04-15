import { useEffect, useMemo, useState } from 'react';
import { NavLink, Outlet } from 'react-router-dom';

import { fetchPosts, fetchProperties, fetchServices, getStoredUser, logoutUser } from '../api/api';
import { FooterNavLink } from '../components/ShowcaseSections';
import { useLiveCollections } from '../hooks/useLiveCollections';
import { connectSocket, disconnectSocket } from '../socket';

function MainLayout() {
  const [user, setUser] = useState(() => getStoredUser());
  const [theme, setTheme] = useState(() => localStorage.getItem('staynest_theme') || 'light');
  const [menuOpen, setMenuOpen] = useState(false);
  const { items: liveProperties } = useLiveCollections('properties', fetchProperties, { pollMs: 20000 });
  const { items: liveServices } = useLiveCollections('services', fetchServices, { pollMs: 20000 });
  const { items: livePosts } = useLiveCollections('posts', fetchPosts, { pollMs: 20000 });

  useEffect(() => {
    const syncUser = () => setUser(getStoredUser());

    connectSocket();
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

  const isDark = theme === 'dark';

  const navItems = useMemo(() => {
    const base = [
      { label: 'Home', to: '/' },
      { label: 'Properties', to: '/properties' },
      { label: 'Services', to: '/services' },
      { label: 'Community', to: '/community' },
      { label: 'About', to: '/about' },
      { label: 'Need Help', to: '/need-help' },
    ];

    if (!user) {
      return base;
    }

    if (user.role === 'student') {
      return [{ label: 'Dashboard', to: '/dashboard' }, ...base.slice(1), { label: 'Profile', to: '/profile' }];
    }

    if (user.role === 'renter') {
      return [
        { label: 'Dashboard', to: '/dashboard' },
        { label: 'My Properties', to: '/my-properties' },
        { label: 'Add Property', to: '/properties/new' },
        { label: 'Community', to: '/community' },
        { label: 'Profile', to: '/profile' },
      ];
    }

    if (user.role === 'service_provider') {
      return [
        { label: 'Dashboard', to: '/dashboard' },
        { label: 'My Services', to: '/my-services' },
        { label: 'Add Service', to: '/services/new' },
        { label: 'Community', to: '/community' },
        { label: 'Profile', to: '/profile' },
      ];
    }

    if (user.role === 'admin') {
      return [
        { label: 'Admin', to: '/admin/dashboard' },
        { label: 'Users', to: '/admin/users' },
        { label: 'Listings', to: '/admin/listings' },
        { label: 'Posts', to: '/admin/posts' },
        { label: 'Reports', to: '/admin/reports' },
      ];
    }

    return base;
  }, [user]);

  const navLinkClass = ({ isActive }) =>
    [
      'rounded-full px-4 py-2 text-sm font-semibold',
      isActive
        ? 'bg-[var(--surface-contrast)] text-[var(--page-bg)]'
        : 'text-[var(--text-soft)] hover:bg-[var(--surface-muted)] hover:text-[var(--text)]',
    ].join(' ');

  const handleLogout = () => {
    logoutUser();
    disconnectSocket();
    window.location.href = '/';
  };

  const allFooterLinks = [
    ['Home', '/'],
    ['Properties', '/properties'],
    ['Services', '/services'],
    ['Community', '/community'],
    ['About', '/about'],
    ['Need Help', '/need-help'],
    [user ? 'Profile' : 'Login', user ? '/profile' : '/login'],
  ];

  const themeLabel = isDark ? 'Light mode' : 'Dark mode';

  return (
    <div className="app-shell">
      <header className="sticky top-0 z-50 border-b border-[var(--border)] bg-[color:var(--page-bg)]/92 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center gap-3 px-4 py-3 sm:px-6 lg:px-8">
          <NavLink to="/" className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full border border-[var(--border-strong)] bg-[var(--surface-strong)] text-base font-black">
              S
            </div>
            <div>
              <p className="text-sm font-black tracking-[0.18em] sm:text-base">STAYNEST</p>
              <p className="text-[11px] uppercase tracking-[0.24em] faint-text">quiet living, real data</p>
            </div>
          </NavLink>

          <nav className="ml-auto hidden items-center gap-1 xl:flex">
            {navItems.map((item) => (
              <NavLink key={item.to + item.label} to={item.to} className={navLinkClass}>
                {item.label}
              </NavLink>
            ))}
          </nav>

          <div className="ml-auto flex items-center gap-2 xl:ml-4">
            <button
              type="button"
              onClick={() => setTheme((current) => (current === 'dark' ? 'light' : 'dark'))}
              className="outline-button hidden rounded-full px-4 py-2 text-sm font-semibold sm:inline-flex"
            >
              {themeLabel}
            </button>

            {!user ? (
              <>
                <NavLink to="/login" className="outline-button hidden rounded-full px-4 py-2 text-sm font-semibold sm:inline-flex">
                  Login
                </NavLink>
                <NavLink to="/signup" className="primary-button hidden rounded-full px-4 py-2 text-sm font-semibold sm:inline-flex">
                  Signup
                </NavLink>
              </>
            ) : (
              <button type="button" onClick={handleLogout} className="secondary-button hidden rounded-full px-4 py-2 text-sm font-semibold sm:inline-flex">
                Logout
              </button>
            )}

            <button
              type="button"
              onClick={() => setMenuOpen((current) => !current)}
              className="outline-button rounded-full px-4 py-2 text-sm font-semibold xl:hidden"
            >
              Menu
            </button>
          </div>
        </div>

        {menuOpen ? (
          <div className="border-t border-[var(--border)] xl:hidden">
            <div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-4 sm:px-6 lg:px-8">
              {navItems.map((item) => (
                <NavLink key={item.to + item.label} to={item.to} className={navLinkClass} onClick={() => setMenuOpen(false)}>
                  {item.label}
                </NavLink>
              ))}
              <button
                type="button"
                onClick={() => setTheme((current) => (current === 'dark' ? 'light' : 'dark'))}
                className="outline-button rounded-full px-4 py-2 text-left text-sm font-semibold"
              >
                {themeLabel}
              </button>
              {!user ? (
                <>
                  <NavLink to="/login" className="outline-button rounded-full px-4 py-2 text-sm font-semibold" onClick={() => setMenuOpen(false)}>
                    Login
                  </NavLink>
                  <NavLink to="/signup" className="primary-button rounded-full px-4 py-2 text-sm font-semibold" onClick={() => setMenuOpen(false)}>
                    Signup
                  </NavLink>
                </>
              ) : (
                <button type="button" onClick={handleLogout} className="secondary-button rounded-full px-4 py-2 text-left text-sm font-semibold">
                  Logout
                </button>
              )}
            </div>
          </div>
        ) : null}
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <Outlet />
      </main>

      <footer className="mt-12 border-t border-[var(--border)] bg-[var(--surface-muted)]">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[1.15fr_0.85fr_0.8fr] lg:px-8">
          <section>
            <p className="eyebrow">Live platform counts</p>
            <div className="mt-4 grid gap-3 sm:grid-cols-3">
              {[
                ['Listings', liveProperties.length],
                ['Services', liveServices.length],
                ['Posts', livePosts.length],
              ].map(([label, value]) => (
                <article key={label} className="panel rounded-[1.4rem] p-4">
                  <p className="text-sm muted-text">{label}</p>
                  <p className="display-serif mt-2 text-4xl">{String(value).padStart(2, '0')}</p>
                </article>
              ))}
            </div>
          </section>

          <section>
            <p className="eyebrow">Pages</p>
            <div className="mt-4 grid grid-cols-2 gap-3">
              {allFooterLinks.map(([label, to]) => (
                <FooterNavLink key={to} to={to}>
                  {label}
                </FooterNavLink>
              ))}
            </div>
          </section>

          <section>
            <p className="eyebrow">Contact</p>
            <div className="mt-4 space-y-3 text-sm muted-text">
              <p>staynest@gmail.com</p>
              <p>+91 23654 7891</p>
              <p>IIIT Kota</p>
              <p className="pt-2 text-xs uppercase tracking-[0.22em] faint-text">
                {user ? `${user.role.replace('_', ' ')} session active` : 'Guest browsing'}
              </p>
            </div>
          </section>
        </div>
      </footer>
    </div>
  );
}

export default MainLayout;
