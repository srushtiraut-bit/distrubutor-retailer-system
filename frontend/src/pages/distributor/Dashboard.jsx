import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { getDistributorDashboard } from '../../api/distributorApi';
import { AuthContext } from '../../context/AuthContext';
import './Dashboard.css';

const Dashboard = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getDistributorDashboard();
        setData(res.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (loading) {
    return (
      <div className="dashboard-loading">
        <div className="loader"></div>
        <p>Loading your dashboard...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard-error">
        <div className="error-icon">!</div>
        <h3>Something went wrong</h3>
        <p>{error}</p>
        <button onClick={() => window.location.reload()}>
          Try Again
        </button>
      </div>
    );
  }

  const { distributor, stats, recentOrders } = data;

  return (
    <div className="dashboard-container">

      <aside className="sidebar">
        <div className="sidebar-brand">
          <div className="sidebar-logo">S</div>
          <span>SmartSupply</span>
        </div>

        <nav className="sidebar-nav">
          <button className="nav-item active" onClick={() => navigate('/distributor/dashboard')}>
            <span>▦</span>
            Home
          </button>
          <button className="nav-item" onClick={() => navigate('/distributor/products')}>
            <span>📦</span>
            Products
          </button>
          <button className="nav-item" onClick={() => navigate('/distributor/stock')}>
            <span>📊</span>
            Stock
          </button>
          <button className="nav-item" onClick={() => navigate('/distributor/orders')}>
            <span>🛒</span>
            Orders
          </button>
          <button className="nav-item" onClick={() => navigate('/distributor/payments')}>
            <span>💳</span>
            Payments
          </button>
          <button className="nav-item" onClick={() => navigate('/distributor/expenses')}>
            <span>🧾</span>
            Expenses
          </button>
          <button className="nav-item" onClick={() => navigate('/distributor/profit-loss')}>
            <span>📈</span>
            Profit &amp; Loss
          </button>
          <button className="nav-item" onClick={() => navigate('/distributor/settings')}>
            <span>⚙</span>
            Settings
          </button>
        </nav>

        <div className="sidebar-bottom">
          <div className="user-mini">
            <div className="avatar">
              {distributor?.name?.charAt(0).toUpperCase() || 'D'}
            </div>
            <div>
              <strong>{distributor?.name || 'Distributor'}</strong>
              <small>Distributor</small>
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
            <p className="dashboard-label">DISTRIBUTOR DASHBOARD</p>
            <h1>Welcome back, {distributor?.name?.split(' ')[0] || 'there'}! 👋</h1>
            <p className="dashboard-subtitle">Here's how your business looks today.</p>
          </div>
          <button className="new-order-button" onClick={() => navigate('/distributor/products')}>
            <span>＋</span>
            Add Product
          </button>
        </header>

        <section className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon products-icon">📦</div>
            <div className="stat-info">
              <p>Total Products</p>
              <h2>{stats.totalProducts}</h2>
              <span>Listed in your catalog</span>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon stock-icon">📊</div>
            <div className="stat-info">
              <p>Stock Remaining</p>
              <h2>{stats.totalStock}</h2>
              <span>Units across all products</span>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon orders-icon">🛒</div>
            <div className="stat-info">
              <p>Total Orders</p>
              <h2>{stats.totalOrders}</h2>
              <span>All time orders</span>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon pending-icon">⏳</div>
            <div className="stat-info">
              <p>Pending Orders</p>
              <h2>{stats.pendingOrders}</h2>
              <span>Awaiting processing</span>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon spent-icon">₹</div>
            <div className="stat-info">
              <p>Total Revenue</p>
              <h2>₹{stats.totalRevenue}</h2>
              <span>Lifetime earnings</span>
            </div>
          </div>
        </section>

        <section className="orders-section">
          <div className="section-header">
            <div>
              <h2>Recent Orders</h2>
              <p>Latest orders from your retailers</p>
            </div>
            <button className="view-all-button" onClick={() => navigate('/distributor/orders')}>
              View All →
            </button>
          </div>

          <div className="orders-card">
            {recentOrders.length === 0 ? (
              <div className="empty-orders">
                <div className="empty-icon">📦</div>
                <h3>No orders yet</h3>
                <p>Once a retailer places an order with you, it'll show up here.</p>
              </div>
            ) : (
              <div className="table-wrapper">
                <table className="orders-table">
                  <thead>
                    <tr>
                      <th>ORDER ID</th>
                      <th>RETAILER ID</th>
                      <th>DATE</th>
                      <th>BILL</th>
                      <th>STATUS</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentOrders.map((order) => (
                      <tr key={order.order_id}>
                        <td><strong>#{order.order_id}</strong></td>
                        <td>{order.retailer_id}</td>
                        <td>{new Date(order.order_date).toLocaleDateString()}</td>
                        <td><strong>₹{order.total_bill}</strong></td>
                        <td>
                          <span className={`status-badge status-${order.order_status?.toLowerCase()}`}>
                            {order.order_status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
};

export default Dashboard;