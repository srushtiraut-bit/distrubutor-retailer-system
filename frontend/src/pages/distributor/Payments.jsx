import { useState, useEffect } from 'react';
import { getMyPayments, updatePayment } from '../../api/paymentApi';
import Sidebar from '../../components/distributor/Sidebar';
import './Dashboard.css';
import './ManageProducts.css';
import './Payments.css';

const STATUS_OPTIONS = ['Paid', 'Partial', 'Pending'];
const MODE_OPTIONS = ['Cash', 'UPI', 'Bank Transfer', 'Credit Card', 'Debit Card'];

const Payments = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({ amount_paid: '', payment_status: '', payment_mode: '' });
  const [saving, setSaving] = useState(false);

  const loadPayments = async () => {
    try {
      const res = await getMyPayments();
      setPayments(res.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load payments');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPayments();
  }, []);

  const openEdit = (p) => {
    setEditingId(p.order_id);
    setForm({
      amount_paid: p.amount_paid,
      payment_status: p.payment_status,
      payment_mode: p.payment_mode,
    });
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = async (orderId) => {
    setSaving(true);
    try {
      await updatePayment(orderId, form);
      setEditingId(null);
      await loadPayments();
    } catch (err) {
      alert(err.response?.data?.message || 'Could not update payment');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="dashboard-shell">
      <Sidebar active="Payments" />

      <main className="dashboard-main">
        <header className="dashboard-header">
          <div>
            <h1>Payments</h1>
            <p>Track and update payment status for each order.</p>
          </div>
        </header>

        <section className="orders-card">
          {loading ? (
            <div className="dashboard-loading">Loading payments...</div>
          ) : error ? (
            <div className="dashboard-error">{error}</div>
          ) : payments.length === 0 ? (
            <div className="empty-state">
              <p>No payments yet</p>
              <span>Payment records appear here once orders are placed.</span>
            </div>
          ) : (
            <table className="orders-table">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Date</th>
                  <th>Total</th>
                  <th>Paid</th>
                  <th>Mode</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {payments.map((p) => (
                  <tr key={p.payment_id}>
                    <td>#{p.order_id}</td>
                    <td>{p.payment_date ? new Date(p.payment_date).toLocaleDateString() : '—'}</td>
                    <td>₹{p.total_amount}</td>
                    <td>
                      {editingId === p.order_id ? (
                        <input
                          name="amount_paid"
                          type="number"
                          step="0.01"
                          value={form.amount_paid}
                          onChange={handleChange}
                          className="inline-input"
                        />
                      ) : (
                        `₹${p.amount_paid}`
                      )}
                    </td>
                    <td>
                      {editingId === p.order_id ? (
                        <select name="payment_mode" value={form.payment_mode} onChange={handleChange} className="inline-input">
                          {MODE_OPTIONS.map((m) => <option key={m} value={m}>{m}</option>)}
                        </select>
                      ) : (
                        p.payment_mode || '—'
                      )}
                    </td>
                    <td>
                      {editingId === p.order_id ? (
                        <select name="payment_status" value={form.payment_status} onChange={handleChange} className="inline-input">
                          {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
                        </select>
                      ) : (
                        <span className={`status-badge status-${p.payment_status.toLowerCase()}`}>{p.payment_status}</span>
                      )}
                    </td>
                    <td className="actions-cell">
                      {editingId === p.order_id ? (
                        <>
                          <button className="link-btn" disabled={saving} onClick={() => handleSave(p.order_id)}>
                            {saving ? 'Saving...' : 'Save'}
                          </button>
                          <button className="link-btn danger" onClick={() => setEditingId(null)}>Cancel</button>
                        </>
                      ) : (
                        <button className="link-btn" onClick={() => openEdit(p)}>Edit</button>
                      )}
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

export default Payments;