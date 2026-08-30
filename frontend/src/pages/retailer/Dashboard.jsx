import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { getDashboardStats, getRecentOrders } from '../../api/retailerApi';
import { AuthContext } from '../../context/AuthContext';
import './Dashboard.css';

const Dashboard = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const [stats, setStats] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, ordersRes] = await Promise.all([
          getDashboardStats(),
          getRecentOrders()
        ]);

        setStats(statsRes.data);
        setOrders(ordersRes.data);
      } catch (err) {
        setError('Failed to load dashboard data');
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

  return (
    <div className="dashboard-container">

      {/* SIDEBAR */}
      <aside className="sidebar">

        <div className="sidebar-brand">
          <div className="sidebar-logo">S</div>
          <span>SmartSupply</span>
        </div>

        <nav className="sidebar-nav">

          <button className="nav-item active">
            <span>▦</span>
            Dashboard
          </button>

          <button
            className="nav-item"
            onClick={() => navigate('/retailer/select-distributor')}
          >
            <span>🛒</span>
            New Order
          </button>

          <button className="nav-item">
            <span>📦</span>
            My Orders
          </button>

          <button className="nav-item">
            <span>💳</span>
            Payments
          </button>

          <button className="nav-item">
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

          <button
            className="logout-button"
            onClick={handleLogout}
          >
            ↪ Logout
          </button>

        </div>

      </aside>

      {/* MAIN CONTENT */}
      <main className="dashboard-main">

        {/* TOP BAR */}
        <header className="dashboard-header">

          <div>
            <p className="dashboard-label">RETAILER DASHBOARD</p>

            <h1>
              Welcome back, {user?.name?.split(' ')[0] || 'there'}! 👋
            </h1>

            <p className="dashboard-subtitle">
              Here's what's happening with your orders today.
            </p>
          </div>

          <button
            className="new-order-button"
            onClick={() => navigate('/retailer/select-distributor')}
          >
            <span>＋</span>
            Place New Order
          </button>

        </header>

        {/* STAT CARDS */}
        <section className="stats-grid">

          <div className="stat-card">

            <div className="stat-icon orders-icon">
              📦
            </div>

            <div className="stat-info">
              <p>Total Orders</p>
              <h2>{stats.totalOrders}</h2>
              <span>All time orders</span>
            </div>

          </div>

          <div className="stat-card">

            <div className="stat-icon pending-icon">
              🚚
            </div>

            <div className="stat-info">
              <p>Pending Delivery</p>
              <h2>{stats.pendingOrders}</h2>
              <span>Orders in progress</span>
            </div>

          </div>

          <div className="stat-card">

            <div className="stat-icon due-icon">
              ₹
            </div>

            <div className="stat-info">
              <p>Amount Due</p>
              <h2>₹{stats.amountDue}</h2>
              <span>Outstanding payment</span>
            </div>

          </div>

          <div className="stat-card">

            <div className="stat-icon spent-icon">
              ✓
            </div>

            <div className="stat-info">
              <p>Total Spent</p>
              <h2>₹{stats.totalSpent}</h2>
              <span>Lifetime spending</span>
            </div>

          </div>

        </section>

        {/* RECENT ORDERS */}
        <section className="orders-section">

          <div className="section-header">

            <div>
              <h2>Recent Orders</h2>
              <p>Keep track of your latest purchases</p>
            </div>

            <button
              className="view-all-button"
              onClick={() => navigate('/retailer/orders')}
            >
              View All →
            </button>

          </div>

          <div className="orders-card">

            {orders.length === 0 ? (

              <div className="empty-orders">

                <div className="empty-icon">
                  📦
                </div>

                <h3>No orders yet</h3>

                <p>
                  You haven't placed any orders yet.
                </p>

                <button
                  onClick={() =>
                    navigate('/retailer/select-distributor')
                  }
                >
                  Place Your First Order
                </button>

              </div>

            ) : (

              <div className="table-wrapper">

                <table className="orders-table">

                  <thead>
                    <tr>
                      <th>ORDER ID</th>
                      <th>DATE</th>
                      <th>AMOUNT</th>
                      <th>ORDER STATUS</th>
                      <th>PAYMENT</th>
                    </tr>
                  </thead>

                  <tbody>

                    {orders.map((order) => (

                      <tr key={order.Order_ID}>

                        <td>
                          <strong>
                            #{order.Order_ID}
                          </strong>
                        </td>

                        <td>
                          {new Date(
                            order.Order_Date
                          ).toLocaleDateString()}
                        </td>

                        <td>
                          <strong>
                            ₹{order.Total_Bill}
                          </strong>
                        </td>

                        <td>
                          <span
                            className={`status-badge ${order.Order_Status
                              ?.toLowerCase()
                              .replace(/\s+/g, '-')}`}
                          >
                            {order.Order_Status}
                          </span>
                        </td>

                        <td>
                          <span
                            className={`payment-badge ${order.Payment_Status
                              ?.toLowerCase()
                              .replace(/\s+/g, '-')}`}
                          >
                            {order.Payment_Status ||
                              'Not recorded'}
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