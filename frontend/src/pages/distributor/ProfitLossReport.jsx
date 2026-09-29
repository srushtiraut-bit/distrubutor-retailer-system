import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { getMyProfitLoss } from '../../api/profitLossApi';
import { AuthContext } from '../../context/AuthContext';
import './Dashboard.css';
import './ProfitLossReport.css';

const ProfitLossReport = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getMyProfitLoss();
        setData(res.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load report');
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

  const Sidebar = () => (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <div className="sidebar-logo">S</div>
        <span>SmartSupply</span>
      </div>

      <nav className="sidebar-nav">
        <button className="nav-item" onClick={() => navigate('/distributor/dashboard')}>
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
        <button className="nav-item active" onClick={() => navigate('/distributor/profit-loss')}>
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
            {user?.name?.charAt(0).toUpperCase() || 'D'}
          </div>
          <div>
            <strong>{user?.name || 'Distributor'}</strong>
            <small>Distributor</small>
          </div>
        </div>
        <button className="logout-button" onClick={handleLogout}>
          ↪ Logout
        </button>
      </div>
    </aside>
  );

  if (loading) {
    return (
      <div className="dashboard-container">
        <Sidebar />
        <main className="dashboard-main">
          <div className="dashboard-loading">Loading report...</div>
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard-container">
        <Sidebar />
        <main className="dashboard-main">
          <div className="dashboard-error">{error}</div>
        </main>
      </div>
    );
  }

  const { records, summary } = data;

  return (
    <div className="dashboard-container">
      <Sidebar />

      <main className="dashboard-main">
        <header className="dashboard-header">
          <div>
            <h1>Profit &amp; Loss Report</h1>
            <p>How much you've earned across all your completed orders.</p>
          </div>
        </header>

        <section className="stats-grid">
          <div className="stat-card">
            <div className="stat-info">
              <p>Total Revenue</p>
              <h2>₹{summary.totalRevenue}</h2>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-info">
              <p>Total Cost</p>
              <h2>₹{summary.totalCost}</h2>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-info">
              <p>Total Profit</p>
              <h2>₹{summary.totalProfit}</h2>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-info">
              <p>Avg. Margin</p>
              <h2>{Number(summary.avgMargin).toFixed(1)}%</h2>
            </div>
          </div>
        </section>

        <section className="orders-card">
          <div className="orders-card-header" style={{ padding: '20px 24px 0' }}>
            <h2>Order-by-Order Breakdown</h2>
          </div>

          {records.length === 0 ? (
            <div className="empty-state">
              <p>No profit/loss data yet</p>
              <span>This fills in automatically once your orders are completed.</span>
            </div>
          ) : (
            <table className="orders-table">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Date</th>
                  <th>Cost Price</th>
                  <th>Selling Price</th>
                  <th>Result</th>
                  <th>Margin</th>
                </tr>
              </thead>
              <tbody>
                {records.map((r) => (
                  <tr key={r.pl_id}>
                    <td>#{r.order_id}</td>
                    <td>{new Date(r.date).toLocaleDateString()}</td>
                    <td>₹{r.total_cost_price}</td>
                    <td>₹{r.total_selling_price}</td>
                    <td>
                      <span className={`status-badge ${r.profit_or_loss === 'PROFIT' ? 'status-delivered' : r.profit_or_loss === 'LOSS' ? 'status-pending' : 'status-confirmed'}`}>
                        {r.profit_or_loss}
                      </span>
                    </td>
                    <td>{r.percentage}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </section>
      </main>
    </div>
  );
};

export default ProfitLossReport;