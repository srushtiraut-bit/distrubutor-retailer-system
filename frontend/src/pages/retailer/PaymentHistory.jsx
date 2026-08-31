import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllPayments } from '../../api/retailerApi';
import { AuthContext } from '../../context/AuthContext';
import './Dashboard.css';

const PaymentHistory = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const res = await getAllPayments();
        setPayments(res.data);
      } catch (err) {
        setError('Failed to load payments');
      } finally {
        setLoading(false);
      }
    };
    fetchPayments();
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (loading) {
    return (
      <div className="dashboard-loading">
        <div className="loader"></div>
        <p>Loading your payments...</p>
      </div>
    );
  }

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
          <button className="nav-item active">
            <span>💳</span>
            Payments
          </button>
          <button className="nav-item" onClick={() => navigate('/retailer/settings')}>
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
            <p className="dashboard-label">PAYMENTS</p>
            <h1>Payment History</h1>
            <p className="dashboard-subtitle">Track your payments and dues</p>
          </div>
        </header>

        <section className="orders-section">
          <div className="orders-card">
            {error && <p style={{ color: 'red' }}>{error}</p>}

            {payments.length === 0 ? (
              <div className="empty-orders">
                <div className="empty-icon">💳</div>
                <h3>No payments yet</h3>
                <p>You don't have any payment records yet.</p>
              </div>
            ) : (
              <div className="table-wrapper">
                <table className="orders-table">
                  <thead>
                    <tr>
                      <th>ORDER ID</th>
                      <th>DATE</th>
                      <th>TOTAL AMOUNT</th>
                      <th>PAID</th>
                      <th>DUE</th>
                      <th>STATUS</th>
                    </tr>
                  </thead>
                  <tbody>
                    {payments.map((payment) => (
                      <tr key={payment.Payment_ID}>
                        <td><strong>#{payment.Order_ID}</strong></td>
                        <td>{new Date(payment.Order_Date).toLocaleDateString()}</td>
                        <td>₹{payment.Total_Amount}</td>
                        <td>₹{payment.Amount_Paid}</td>
                        <td>₹{payment.Amount_Due}</td>
                        <td>
                          <span className={`payment-badge ${payment.Payment_Status?.toLowerCase().replace(/\s+/g, '-')}`}>
                            {payment.Payment_Status}
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

export default PaymentHistory;
