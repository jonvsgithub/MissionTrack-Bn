import { Link } from 'react-router-dom';

export const NotFoundPage = () => (
  <div className="auth-wrapper">
    <div className="auth-card" style={{ textAlign: 'center' }}>
      <h1>404</h1>
      <p className="page-subtitle">The page you requested could not be found.</p>
      <Link to="/login" className="primary-btn" style={{ display: 'inline-block', textAlign: 'center' }}>
        Back to login
      </Link>
    </div>
  </div>
);

