import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { addExpense, getExpenses, deleteExpense } from '../../api/expenseApi';
import { AuthContext } from '../../context/AuthContext';
import './Dashboard.css';
import './ManageExpenses.css';

const ManageExpenses = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const [expenses, setExpenses] = useState([]);
  const [formData, setFormData] = useState({
    category: '',
    amount: '',
    date: '',
    description: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchExpenses = async () => {
    try {
      const data = await getExpenses();
      setExpenses(data);
    } catch (err) {
      setError('Failed to load expenses');
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await addExpense(formData);
      setFormData({ category: '', amount: '', date: '', description: '' });
      fetchExpenses();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add expense');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteExpense(id);
      fetchExpenses();
    } catch (err) {
      setError('Failed to delete expense');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const totalExpenses = expenses.reduce((sum, e) => sum + Number(e.amount), 0);

  return (
    <div className="dashboard-container">

      {/* SIDEBAR — same structure as Home */}
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
          <button className="nav-item active" onClick={() => navigate('/distributor/expenses')}>
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
        <div className="expenses-page">
          <h2>Manage Expenses</h2>

          <form onSubmit={handleSubmit} className="expense-form">
            <select name="category" value={formData.category} onChange={handleChange} required>
              <option value="">Select category</option>
              <option value="Rent">Rent</option>
              <option value="Transport">Transport</option>
              <option value="Staff Salary">Staff Salary</option>
              <option value="Electricity">Electricity</option>
              <option value="Maintenance">Maintenance</option>
              <option value="Other">Other</option>
            </select>

            <input
              type="number"
              name="amount"
              placeholder="Amount"
              value={formData.amount}
              onChange={handleChange}
              required
            />

            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              required
            />

            <input
              type="text"
              name="description"
              placeholder="Description (optional)"
              value={formData.description}
              onChange={handleChange}
            />

            <button type="submit" disabled={loading}>
              {loading ? 'Adding...' : 'Add Expense'}
            </button>
          </form>

          {error && <div className="expense-error">{error}</div>}

          <div className="expense-total">
            Total Expenses: <span>₹{totalExpenses.toFixed(2)}</span>
          </div>

          {expenses.length === 0 ? (
            <div className="no-expenses">No expenses recorded yet.</div>
          ) : (
            <table className="expense-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Category</th>
                  <th>Amount</th>
                  <th>Description</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {expenses.map((exp) => (
                  <tr key={exp.expense_id}>
                    <td>{new Date(exp.date).toLocaleDateString()}</td>
                    <td>{exp.category}</td>
                    <td>₹{Number(exp.amount).toFixed(2)}</td>
                    <td>{exp.description || '-'}</td>
                    <td>
                      <button className="delete-btn" onClick={() => handleDelete(exp.expense_id)}>
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </main>
    </div>
  );
};

export default ManageExpenses;