import { useState, useEffect, Fragment, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { getMyOrders, getOrderItems, updateOrderStatus } from '../../api/orderApi';
import { AuthContext } from '../../context/AuthContext';
import './Dashboard.css';
import './IncomingOrders.css';

const STATUS_OPTIONS = ['Pending', 'Confirmed', 'Shipped', 'Delivered', 'Paid'];

const dateInputStyle = {
  padding: '8px 10px',
  borderRadius: '8px',
  border: '1px solid #cbd5e1',
  background: '#fff',
  color: '#0f172a',
  fontSize: '14px',
};

const IncomingOrders = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [expandedId, setExpandedId] = useState(null);
  const [orderItems, setOrderItems] = useState({});
  const [updatingId, setUpdatingId] = useState(null);
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');

  const loadOrders = async () => {
    try {
      const res = await getMyOrders();
      setOrders(res.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const toggleExpand = async (orderId) => {
    if (expandedId === orderId) {
      setExpandedId(null);
      return;
    }
    setExpandedId(orderId);
    if (!orderItems[orderId]) {
      try {
        const res = await getOrderItems(orderId);
        setOrderItems((prev) => ({ ...prev, [orderId]: res.data }));
      } catch (err) {
        alert('Could not load order items');
      }
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    setUpdatingId(orderId);
    try {
      await updateOrderStatus(orderId, newStatus);
      await loadOrders();
    } catch (err) {
      alert(err.response?.data?.message || 'Could not update status');
    } finally {
      setUpdatingId(null);
    }
  };

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
    const key = toDateKey(order.order_date);
    if (fromDate && key < fromDate) return false;
    if (toDate && key > toDate) return false;
    return true;
  });

  const isFiltering = fromDate || toDate;

  return (
    <div className="dashboard-container">

      {/* SIDEBAR */}
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
          <button className="nav-item active" onClick={() => navigate('/distributor/orders')}>
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

      {/* MAIN CONTENT */}
      <main className="dashboard-main">
        <header className="dashboard-header">
          <div>
            <h1>Incoming Orders</h1>
            <p>Orders placed by retailers, and their current status.</p>
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

        <section className="orders-card">
          {loading ? (
            <div className="dashboard-loading">Loading orders...</div>
          ) : error ? (
            <div className="dashboard-error">{error}</div>
          ) : orders.length === 0 ? (
            <div className="empty-state">
              <p>No orders yet</p>
              <span>Once a retailer places an order with you, it'll show up here.</span>
            </div>
          ) : filteredOrders.length === 0 ? (
            <div className="empty-state">
              <p>No orders in this date range</p>
              <span>Try changing or clearing the dates.</span>
            </div>
          ) : (
            <table className="orders-table">
              <thead>
                <tr>
                  <th></th>
                  <th>Order ID</th>
                  <th>Retailer</th>
                  <th>Date</th>
                  <th>Bill</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map((order) => (
                  <Fragment key={order.order_id}>
                    <tr>
                      <td>
                        <button className="expand-btn" onClick={() => toggleExpand(order.order_id)}>
                          {expandedId === order.order_id ? '−' : '+'}
                        </button>
                      </td>
                      <td>#{order.order_id}</td>
                      <td>{order.retailer_name}</td>
                      <td>{new Date(order.order_date).toLocaleDateString()}</td>
                      <td>₹{order.total_bill}</td>
                      <td>
                        <select
                          value={order.order_status}
                          onChange={(e) => handleStatusChange(order.order_id, e.target.value)}
                          disabled={updatingId === order.order_id}
                          className={'status-select status-' + order.order_status.toLowerCase()}
                        >
                          {STATUS_OPTIONS.map((s) => (
                            <option key={s} value={s}>{s}</option>
                          ))}
                        </select>
                      </td>
                    </tr>
                    {expandedId === order.order_id && (
                      <tr className="order-items-row">
                        <td colSpan={6}>
                          {!orderItems[order.order_id] ? (
                            <div className="dashboard-loading">Loading items...</div>
                          ) : (
                            <table className="sub-table">
                              <thead>
                                <tr>
                                  <th>Product</th>
                                  <th>Qty</th>
                                  <th>Cost Price</th>
                                  <th>Selling Price</th>
                                  <th>Subtotal</th>
                                </tr>
                              </thead>
                              <tbody>
                                {orderItems[order.order_id].map((item) => (
                                  <tr key={item.order_item_id}>
                                    <td>{item.product_name}</td>
                                    <td>{item.quantity}</td>
                                    <td>₹{item.cost_price}</td>
                                    <td>₹{item.selling_price}</td>
                                    <td>₹{item.subtotal}</td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          )}
                        </td>
                      </tr>
                    )}
                  </Fragment>
                ))}
              </tbody>
            </table>
          )}
        </section>
      </main>
    </div>
  );
};

export default IncomingOrders;