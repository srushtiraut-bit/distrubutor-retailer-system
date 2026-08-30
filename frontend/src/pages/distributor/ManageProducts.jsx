import { useState, useEffect } from 'react';
import { getMyProducts, addProduct, updateProduct, deleteProduct } from '../../api/productApi';
import Sidebar from '../../components/distributor/Sidebar';
import './Dashboard.css';
import './ManageProducts.css';

const emptyForm = { name: '', cost_price: '', selling_price: '', category: '', unit: '' };

const ManageProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  const loadProducts = async () => {
    try {
      const res = await getMyProducts();
      setProducts(res.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const openAddForm = () => {
    setForm(emptyForm);
    setEditingId(null);
    setShowForm(true);
  };

  const openEditForm = (product) => {
    setForm({
      name: product.name,
      cost_price: product.cost_price,
      selling_price: product.selling_price,
      category: product.category || '',
      unit: product.unit || '',
    });
    setEditingId(product.product_id);
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editingId) {
        await updateProduct(editingId, form);
      } else {
        await addProduct(form);
      }
      setShowForm(false);
      await loadProducts();
    } catch (err) {
      alert(err.response?.data?.message || 'Something went wrong');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this product?')) return;
    try {
      await deleteProduct(id);
      await loadProducts();
    } catch (err) {
      alert(err.response?.data?.message || 'Could not delete product');
    }
  };

  return (
    <div className="dashboard-shell">
      <Sidebar active="Products" />

      <main className="dashboard-main">
        <header className="dashboard-header products-header">
          <div>
            <h1>My Products</h1>
            <p>Add, edit, or remove the products you supply to retailers.</p>
          </div>
          <button className="primary-btn" onClick={openAddForm}>+ Add Product</button>
        </header>

        {showForm && (
          <form className="product-form" onSubmit={handleSubmit}>
            <div className="form-row">
              <input name="name" placeholder="Product name" value={form.name} onChange={handleChange} required />
              <input name="category" placeholder="Category" value={form.category} onChange={handleChange} />
              <input name="unit" placeholder="Unit (Pack, Bottle...)" value={form.unit} onChange={handleChange} />
            </div>
            <div className="form-row">
              <input name="cost_price" type="number" step="0.01" placeholder="Cost price" value={form.cost_price} onChange={handleChange} required />
              <input name="selling_price" type="number" step="0.01" placeholder="Selling price" value={form.selling_price} onChange={handleChange} required />
              <div className="form-actions">
                <button type="submit" className="primary-btn" disabled={saving}>
                  {saving ? 'Saving...' : editingId ? 'Update Product' : 'Add Product'}
                </button>
                <button type="button" className="secondary-btn" onClick={() => setShowForm(false)}>Cancel</button>
              </div>
            </div>
          </form>
        )}

        <section className="orders-card">
          {loading ? (
            <div className="dashboard-loading">Loading products...</div>
          ) : error ? (
            <div className="dashboard-error">{error}</div>
          ) : products.length === 0 ? (
            <div className="empty-state">
              <p>No products yet</p>
              <span>Click "Add Product" above to list your first item.</span>
            </div>
          ) : (
            <table className="orders-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Category</th>
                  <th>Unit</th>
                  <th>Cost Price</th>
                  <th>Selling Price</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((p) => (
                  <tr key={p.product_id}>
                    <td>{p.name}</td>
                    <td>{p.category || '—'}</td>
                    <td>{p.unit || '—'}</td>
                    <td>₹{p.cost_price}</td>
                    <td>₹{p.selling_price}</td>
                    <td className="actions-cell">
                      <button className="link-btn" onClick={() => openEditForm(p)}>Edit</button>
                      <button className="link-btn danger" onClick={() => handleDelete(p.product_id)}>Delete</button>
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

export default ManageProducts;