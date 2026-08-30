import { useState, useEffect } from 'react';
import { getMyStock, addStock, updateStock, deleteStock } from '../../api/stockApi';
import { getMyProducts } from '../../api/productApi';
import Sidebar from '../../components/distributor/Sidebar';
import './Dashboard.css';
import './ManageStock.css';

const emptyAddForm = { product_id: '', input_quantity: '', date: '', expiry: '' };
const LOW_STOCK_THRESHOLD = 20;

const ManageStock = () => {
  const [stock, setStock] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [form, setForm] = useState(emptyAddForm);
  const [saving, setSaving] = useState(false);

  const loadData = async () => {
    try {
      const [stockRes, productsRes] = await Promise.all([getMyStock(), getMyProducts()]);
      setStock(stockRes.data);
      setProducts(productsRes.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load stock');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const openAddForm = () => {
    setForm(emptyAddForm);
    setEditingItem(null);
    setShowForm(true);
  };

  const openEditForm = (item) => {
    setForm({
      input_quantity: item.input_quantity,
      output_quantity: item.output_quantity,
      date: item.date?.slice(0, 10) || '',
      expiry: item.expiry?.slice(0, 10) || '',
    });
    setEditingItem(item);
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editingItem) {
        await updateStock(editingItem.stock_id, form);
      } else {
        await addStock(form);
      }
      setShowForm(false);
      await loadData();
    } catch (err) {
      alert(err.response?.data?.message || 'Something went wrong');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this stock record?')) return;
    try {
      await deleteStock(id);
      await loadData();
    } catch (err) {
      alert(err.response?.data?.message || 'Could not delete');
    }
  };

  const isExpired = (expiry) => expiry && new Date(expiry) < new Date();

  return (
    <div className="dashboard-shell">
      <Sidebar active="Stock" />

      <main className="dashboard-main">
        <header className="dashboard-header products-header">
          <div>
            <h1>Stock</h1>
            <p>Track how much of each product you have on hand.</p>
          </div>
          <button className="primary-btn" onClick={openAddForm} disabled={products.length === 0}>
            + Add Stock
          </button>
        </header>

        {products.length === 0 && !loading && (
          <div className="empty-state" style={{ marginBottom: 20 }}>
            <p>Add a product first</p>
            <span>You need at least one product before you can add stock for it.</span>
          </div>
        )}

        {showForm && (
          <form className="product-form" onSubmit={handleSubmit}>
            {editingItem ? (
              <div className="form-row">
                <div className="field">
                  <label>Product</label>
                  <div style={{ padding: '11px 0', fontWeight: 600 }}>{editingItem.product_name}</div>
                </div>
              </div>
            ) : (
              <div className="form-row">
                <div className="field">
                  <label>Product</label>
                  <select name="product_id" value={form.product_id} onChange={handleChange} required>
                    <option value="">Select a product</option>
                    {products.map((p) => (
                      <option key={p.product_id} value={p.product_id}>{p.name}</option>
                    ))}
                  </select>
                </div>
              </div>
            )}

            <div className="form-row">
              <div className="field">
                <label>Input Quantity</label>
                <input
                  name="input_quantity"
                  type="number"
                  placeholder="e.g. 100"
                  value={form.input_quantity}
                  onChange={handleChange}
                  required
                />
              </div>

              {editingItem && (
                <div className="field">
                  <label>Output Quantity (sold)</label>
                  <input
                    name="output_quantity"
                    type="number"
                    placeholder="e.g. 40"
                    value={form.output_quantity}
                    onChange={handleChange}
                    required
                  />
                </div>
              )}

              <div className="field">
                <label>Date Received</label>
                <input name="date" type="date" value={form.date} onChange={handleChange} />
              </div>

              <div className="field">
                <label>Expiry Date</label>
                <input name="expiry" type="date" value={form.expiry} onChange={handleChange} />
              </div>
            </div>

            <div className="form-row">
              <div className="form-actions">
                <button type="submit" className="primary-btn" disabled={saving}>
                  {saving ? 'Saving...' : editingItem ? 'Update Stock' : 'Add Stock'}
                </button>
                <button type="button" className="secondary-btn" onClick={() => setShowForm(false)}>Cancel</button>
              </div>
            </div>
          </form>
        )}

        <section className="orders-card">
          {loading ? (
            <div className="dashboard-loading">Loading stock...</div>
          ) : error ? (
            <div className="dashboard-error">{error}</div>
          ) : stock.length === 0 ? (
            <div className="empty-state">
              <p>No stock yet</p>
              <span>Add stock for a product to start tracking quantities.</span>
            </div>
          ) : (
            <table className="orders-table">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Input</th>
                  <th>Output</th>
                  <th>Remaining</th>
                  <th>Date</th>
                  <th>Expiry</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {stock.map((s) => (
                  <tr key={s.stock_id}>
                    <td>{s.product_name}</td>
                    <td>{s.input_quantity}</td>
                    <td>{s.output_quantity}</td>
                    <td>
                      {s.remaining_quantity}
                      {s.remaining_quantity < LOW_STOCK_THRESHOLD && (
                        <span className="status-badge status-pending" style={{ marginLeft: 8 }}>Low</span>
                      )}
                    </td>
                    <td>{s.date ? new Date(s.date).toLocaleDateString() : '—'}</td>
                    <td>
                      {s.expiry ? new Date(s.expiry).toLocaleDateString() : '—'}
                      {isExpired(s.expiry) && (
                        <span className="status-badge status-pending" style={{ marginLeft: 8 }}>Expired</span>
                      )}
                    </td>
                    <td className="actions-cell">
                      <button className="link-btn" onClick={() => openEditForm(s)}>Edit</button>
                      <button className="link-btn danger" onClick={() => handleDelete(s.stock_id)}>Delete</button>
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

export default ManageStock;