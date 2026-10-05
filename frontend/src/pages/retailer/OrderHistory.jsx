import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllOrders } from '../../api/retailerApi';
import { AuthContext } from '../../context/AuthContext';
import './Dashboard.css';

const dateInputStyle = {
  padding: '8px 10px',
  borderRadius: '8px',
  border: '1px solid #cbd5e1',
  fontSize: '14px',
};

const OrderHistory = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await getAllOrders();
        setOrders(res.data);
      } catch (err) {
        setError('Failed to load orders');
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Date filter (compares only the date part, YYYY-MM-DD, in local time)
  const toDateKey = (value) => {
    const d = new Date(value);
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return d.getFullYear() + '-' + month + '-' + day;
  };

  const filteredOrders = orders.filter((order) => {
    const key = toDateKey(order.Order_Date);
    if (fromDate && key < fromDate) return false;
    if (toDate && key > toDate) return false;
    return true;
  });

  const isFiltering = fromDate || toDate;

  if (loading) {
    return (
      <div className="dashboard-loading">
        <div className="loader"></div>
        <p>Loading your orders...</p>
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
          <button className="nav-item active">
            <span>📦</span>
            My Orders
          </button>
          <button className="nav-item" onClick={() => navigate('/retailer/payments')}>
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
            <p className="dashboard-label">MY ORDERS</p>
            <h1>Order History</h1>
            <p className="dashboard-subtitle">All your past and current orders</p>
          </div>
        </header>

        {/* DATE FILTER */}
        <div
          style={{
            display: 'flex',
            alignItems: 'flex-end',
            gap: '12px',
            flexWrap: 'wrap',
            marginBottom: '16px',
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <label style={{ fontSize: '13px', fontWeight: 600 }}>From date</label>
            <input
              type="date"
              value={fromDate}
              max={toDate || undefined}
              onChange={(e) => setFromDate(e.target.value)}
              style={dateInputStyle}
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <label style={{ fontSize: '13px', fontWeight: 600 }}>To date</label>
            <input
              type="date"
              value={toDate}
              min={fromDate || undefined}
              onChange={(e) => setToDate(e.target.value)}
              style={dateInputStyle}
            />
          </div>

          {isFiltering && (
            <button
              type="button"
              onClick={() => {
                setFromDate('');
                setToDate('');
              }}
              style={{
                padding: '9px 14px',
                borderRadius: '8px',
                border: '1px solid #cbd5e1',
                color: '#0f172a',
                background: '#fff',
                cursor: 'pointer',
                fontSize: '14px',
              }}
            >
              Clear
            </button>
          )}
        </div>

        <section className="orders-section">
          <div className="orders-card">
            {error && <p style={{ color: 'red' }}>{error}</p>}

            {orders.length === 0 ? (
              <div className="empty-orders">
                <div className="empty-icon">📦</div>
                <h3>No orders yet</h3>
                <p>You haven't placed any orders yet.</p>
                <button onClick={() => navigate('/retailer/select-distributor')}>
                  Place Your First Order
                </button>
              </div>
            ) : filteredOrders.length === 0 ? (
              <div className="empty-orders">
                <div className="empty-icon">📅</div>
                <h3>No orders in this date range</h3>
                <p>Try changing or clearing the dates.</p>
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
                    {filteredOrders.map((order) => (
                      <tr key={order.Order_ID}>
                        <td><strong>#{order.Order_ID}</strong></td>
                        <td>{new Date(order.Order_Date).toLocaleDateString()}</td>
                        <td><strong>₹{order.Total_Bill}</strong></td>
                        <td>
                          <span
                            className={
                              'status-badge ' +
                              (order.Order_Status || '').toLowerCase().replace(/\s+/g, '-')
                            }
                          >
                            {order.Order_Status}
                          </span>
                        </td>
                        <td>
                          <span
                            className={
                              'payment-badge ' +
                              (order.Payment_Status || '').toLowerCase().replace(/\s+/g, '-')
                            }
                          >
                            {order.Payment_Status || 'Not recorded'}
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

export default OrderHistory;