import { Link } from 'react-router-dom';

function AuthShell({ badge = 'StayNest Access', title, description, footer, children }) {
  return (
    <section className="mx-auto max-w-5xl space-y-6">
      <div className="panel rounded-[2.25rem] px-6 py-8 sm:px-8">
        <p className="eyebrow">{badge}</p>
        <h1 className="display-serif mt-4 text-4xl sm:text-5xl">{title}</h1>
        <p className="mt-4 max-w-2xl muted-text">{description}</p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link to="/" className="outline-button rounded-full px-5 py-3 text-sm font-semibold">
            Back home
          </Link>
          <Link to="/community" className="primary-button rounded-full px-5 py-3 text-sm font-semibold">
            Community
          </Link>
        </div>
      </div>

      <div className="panel rounded-[2.25rem] p-5 sm:p-8">
        {children}
        {footer ? <div className="mt-8 text-sm muted-text">{footer}</div> : null}
      </div>
    </section>
  );
}

export default AuthShell;
