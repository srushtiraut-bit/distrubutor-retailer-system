import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import './Dashboard.css';

const Settings = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="dashboard-container">
      <aside className="sidebar">
        <div className="sidebar-brand">
          <div className="sidebar-logo">S</div>
          <span>SmartSupply</span>
        </div>

        <nav className="sidebar-nav">
          <button className="nav-item" onClick={() => navigate('/retailer/dashboard')}>
            <span>▦</span>
            Dashboard
          </button>
          <button className="nav-item" onClick={() => navigate('/retailer/select-distributor')}>
            <span>🛒</span>
            New Order
          </button>
          <button className="nav-item" onClick={() => navigate('/retailer/orders')}>
            <span>📦</span>
            My Orders
          </button>
          <button className="nav-item" onClick={() => navigate('/retailer/payments')}>
            <span>💳</span>
            Payments
          </button>
          <button className="nav-item active">
            <span>⚙</span>
            Settings
          </button>
        </nav>

        <div className="sidebar-bottom">
          <div className="user-mini">
            <div className="avatar">
              {user?.name?.charAt(0).toUpperCase() || 'U'}
            </div>
            <div>
              <strong>{user?.name || 'User'}</strong>
              <small>Retailer</small>
            </div>
          </div>
          <button className="logout-button" onClick={handleLogout}>
            ↪ Logout
          </button>
        </div>
      </aside>

      <main className="dashboard-main">
        <header className="dashboard-header">
          <div>
            <p className="dashboard-label">SETTINGS</p>
            <h1>Your Profile</h1>
            <p className="dashboard-subtitle">Manage your account details</p>
          </div>
        </header>

        <section className="orders-section">
          <div className="orders-card" style={{ padding: '30px' }}>
            <p><strong>Name:</strong> {user?.name}</p>
            <p><strong>Email:</strong> {user?.email}</p>
            <p><strong>Role:</strong> Retailer</p>
            <p style={{ marginTop: '20px', color: '#888' }}>
              More profile editing options coming soon.
            </p>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Settings;
