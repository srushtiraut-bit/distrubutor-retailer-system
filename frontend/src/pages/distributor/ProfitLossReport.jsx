import { useState, useEffect } from 'react';
import { getMyProfitLoss } from '../../api/profitLossApi';
import Sidebar from '../../components/distributor/Sidebar';
import './Dashboard.css';
import './ProfitLossReport.css';

const ProfitLossReport = () => {
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

  if (loading) {
    return <div className="dashboard-shell"><Sidebar active="Profit & Loss" /><div className="dashboard-loading">Loading report...</div></div>;
  }
  if (error) {
    return <div className="dashboard-shell"><Sidebar active="Profit & Loss" /><div className="dashboard-error">{error}</div></div>;
  }

  const { records, summary } = data;

  return (
    <div className="dashboard-shell">
      <Sidebar active="Profit & Loss" />

      <main className="dashboard-main">
        <header className="dashboard-header">
          <div>
            <h1>Profit &amp; Loss Report</h1>
            <p>How much you've earned across all your completed orders.</p>
          </div>
        </header>

        <section className="stats-row">
          <div className="stat-card accent-blue">
            <div>
              <div className="stat-label">Total Revenue</div>
              <div className="stat-value">₹{summary.totalRevenue}</div>
            </div>
          </div>
          <div className="stat-card accent-amber">
            <div>
              <div className="stat-label">Total Cost</div>
              <div className="stat-value">₹{summary.totalCost}</div>
            </div>
          </div>
          <div className="stat-card accent-green">
            <div>
              <div className="stat-label">Total Profit</div>
              <div className="stat-value">₹{summary.totalProfit}</div>
            </div>
          </div>
          <div className="stat-card accent-violet">
            <div>
              <div className="stat-label">Avg. Margin</div>
              <div className="stat-value">{Number(summary.avgMargin).toFixed(1)}%</div>
            </div>
          </div>
        </section>

        <section className="orders-card">
          <div className="orders-card-header">
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