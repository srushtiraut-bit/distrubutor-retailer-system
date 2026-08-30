import { useState, useEffect } from 'react';
import { getDistributorDashboard } from '../../api/distributorApi';
import Sidebar from '../../components/distributor/Sidebar';
import './Dashboard.css';

const Dashboard = () => {
  const [data, setData] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getDistributorDashboard();
        setData(res.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load dashboard');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return <div className="dashboard-shell"><Sidebar active="Home" /><div className="dashboard-loading">Loading your dashboard...</div></div>;
  }
  if (error) {
    return <div className="dashboard-shell"><Sidebar active="Home" /><div className="dashboard-error">{error}</div></div>;
  }

  const { distributor, stats, recentOrders } = data;

  return (
    <div className="dashboard-shell">
      <Sidebar active="Home" />

      <main className="dashboard-main">
        <header className="dashboard-header">
          <div>
            <h1>Home</h1>
            <p>Welcome back, {distributor.name.split(' ')[0]} — here's how your business looks today.</p>
          </div>
        </header>

        <section className="stats-row">
          <StatCard icon="box" label="Total Products" value={stats.totalProducts} accent="blue" />
          <StatCard icon="layers" label="Stock Remaining" value={stats.totalStock} accent="teal" />
          <StatCard icon="cart" label="Total Orders" value={stats.totalOrders} accent="violet" />
          <StatCard icon="clock" label="Pending Orders" value={stats.pendingOrders} accent="amber" />
          <StatCard icon="rupee" label="Total Revenue" value={`₹${stats.totalRevenue}`} accent="green" />
        </section>

        <section className="orders-card">
          <div className="orders-card-header">
            <h2>Recent Orders</h2>
          </div>

          {recentOrders.length === 0 ? (
            <div className="empty-state">
              <p>No orders yet</p>
              <span>Once a retailer places an order with you, it'll show up here.</span>
            </div>
          ) : (
            <table className="orders-table">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Retailer ID</th>
                  <th>Date</th>
                  <th>Bill</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((order) => (
                  <tr key={order.order_id}>
                    <td>#{order.order_id}</td>
                    <td>{order.retailer_id}</td>
                    <td>{new Date(order.order_date).toLocaleDateString()}</td>
                    <td>₹{order.total_bill}</td>
                    <td>
                      <span className={`status-badge status-${order.order_status.toLowerCase()}`}>
                        {order.order_status}
                      </span>
                    </td>
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

const StatCard = ({ icon, label, value, accent }) => (
  <div className={`stat-card accent-${accent}`}>
    <div>
      <div className="stat-label">{label}</div>
      <div className="stat-value">{value}</div>
    </div>
  </div>
);

export default Dashboard;