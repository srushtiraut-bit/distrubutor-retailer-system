import { useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';

const navItems = [
  { label: 'Home', icon: 'grid', path: '/distributor/dashboard' },
  { label: 'Products', icon: 'box', path: '/distributor/products' },
  { label: 'Stock', icon: 'layers', path: '/distributor/stock' },
  { label: 'Orders', icon: 'cart', path: '/distributor/orders' },
  { label: 'Payments', icon: 'rupee', path: '/distributor/payments' },
  { label: 'Profit & Loss', icon: 'chart', path: '/distributor/profit-loss' },
];

const Icon = ({ name }) => {
  const icons = {
    grid: <path d="M4 4h6v6H4V4zm10 0h6v6h-6V4zM4 14h6v6H4v-6zm10 0h6v6h-6v-6z" />,
    box: <path d="M21 8l-9-5-9 5 9 5 9-5zM3 8v8l9 5 9-5V8M12 13v8" />,
    layers: <path d="M12 2l9 5-9 5-9-5 9-5zM3 12l9 5 9-5M3 16l9 5 9-5" />,
    cart: <path d="M3 3h2l2.4 12.2a2 2 0 002 1.8h7.2a2 2 0 002-1.8L21 8H6M9 21a1 1 0 100-2 1 1 0 000 2zm8 0a1 1 0 100-2 1 1 0 000 2z" />,
    rupee: <path d="M6 3h12M6 8h12M9 3v2c3 0 5 1.3 5 3.5S12 12 9 12h-3l7 9" />,
    chart: <path d="M4 19V9m6 10V5m6 14v-7" />,
  };
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      {icons[name]}
    </svg>
  );
};

const Sidebar = ({ active }) => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const initial = user?.name?.trim().charAt(0).toUpperCase() || 'D';

  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <div className="brand-mark">S</div>
        <span>SmartSupply</span>
      </div>

      <nav className="sidebar-nav">
        {navItems.map((item) => (
          <Link
            key={item.label}
            to={item.path}
            className={`nav-item ${active === item.label ? 'active' : ''}`}
          >
            <Icon name={item.icon} />
            <span>{item.label}</span>
          </Link>
        ))}
      </nav>

      <div className="sidebar-footer">
        <div className="user-chip">
          <div className="user-avatar">{initial}</div>
          <div>
            <div className="user-name">{user?.name}</div>
            <div className="user-role">Distributor</div>
          </div>
        </div>
        <button className="logout-btn" onClick={handleLogout}>Log out</button>
      </div>
    </aside>
  );
};

export default Sidebar;