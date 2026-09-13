import { useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { getProfile, updateProfile, changePassword, changeEmail } from '../../api/distributorApi';
import './Dashboard.css';

const inputStyle = { width: '100%', padding: '10px', border: '1px solid #cbd5e1', borderRadius: '8px' };
const labelStyle = { display: 'block', marginBottom: '6px', fontWeight: 600 };
const sectionHeaderStyle = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', padding: '4px 0' };

const Settings = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '', email: '', contact: '', alternate_contact: '', address: '', type_of_shop: '', gst_no: '',
    food_license_validity: '', opening_time: '', closing_time: '',
    email_notifications: true, order_notifications: true, promo_notifications: false,
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [pwOpen, setPwOpen] = useState(false);
  const [passwordData, setPasswordData] = useState({ currentPassword: '', newPassword: '', confirmNewPassword: '' });
  const [pwError, setPwError] = useState('');
  const [pwSuccess, setPwSuccess] = useState('');
  const [pwSaving, setPwSaving] = useState(false);

  const [emailOpen, setEmailOpen] = useState(false);
  const [emailData, setEmailData] = useState({ currentPassword: '', newEmail: '' });
  const [emailError, setEmailError] = useState('');
  const [emailSuccess, setEmailSuccess] = useState('');
  const [emailSaving, setEmailSaving] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await getProfile();
        const p = res.data;
        setFormData({
          name: p.name || '',
          email: p.email || '',
          contact: p.contact || '',
          alternate_contact: p.alternate_contact || '',
          address: p.address || '',
          type_of_shop: p.type_of_shop || '',
          gst_no: p.gst_no || '',
          food_license_validity: p.food_license_validity ? p.food_license_validity.split('T')[0] : '',
          opening_time: p.opening_time || '',
          closing_time: p.closing_time || '',
          email_notifications: !!p.email_notifications,
          order_notifications: !!p.order_notifications,
          promo_notifications: !!p.promo_notifications,
        });
      } catch (err) {
        setError('Failed to load profile');
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({ ...formData, [name]: type === 'checkbox' ? checked : value });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setSaving(true);
    try {
      await updateProfile(formData);
      setSuccess('Profile updated successfully!');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordChange = (e) => {
    setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setPwError('');
    setPwSuccess('');

    if (passwordData.newPassword !== passwordData.confirmNewPassword) {
      setPwError('New passwords do not match');
      return;
    }
    if (passwordData.newPassword.length < 6) {
      setPwError('New password must be at least 6 characters');
      return;
    }

    setPwSaving(true);
    try {
      await changePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      });
      setPwSuccess('Password changed successfully!');
      setPasswordData({ currentPassword: '', newPassword: '', confirmNewPassword: '' });
    } catch (err) {
      setPwError(err.response?.data?.message || 'Failed to change password');
    } finally {
      setPwSaving(false);
    }
  };

  const handleEmailChange = (e) => {
    setEmailData({ ...emailData, [e.target.name]: e.target.value });
  };

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    setEmailError('');
    setEmailSuccess('');

    if (!emailData.newEmail || !emailData.currentPassword) {
      setEmailError('Please fill in both fields');
      return;
    }

    setEmailSaving(true);
    try {
      await changeEmail({
        currentPassword: emailData.currentPassword,
        newEmail: emailData.newEmail,
      });
      setEmailSuccess('Email changed successfully!');
      setFormData({ ...formData, email: emailData.newEmail });
      setEmailData({ currentPassword: '', newEmail: '' });
    } catch (err) {
      setEmailError(err.response?.data?.message || 'Failed to change email');
    } finally {
      setEmailSaving(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="dashboard-container">
      <aside className="sidebar">
        <div className="sidebar-brand">
          <div className="sidebar-logo">S</div>
          <span>SmartSupply</span>
        </div>

        <nav className="sidebar-nav">
          <button className="nav-item" onClick={() => navigate('/distributor/dashboard')}>
            <span>▦</span>Home
          </button>
          <button className="nav-item" onClick={() => navigate('/distributor/products')}>
            <span>📦</span>Products
          </button>
          <button className="nav-item" onClick={() => navigate('/distributor/stock')}>
            <span>📊</span>Stock
          </button>
          <button className="nav-item" onClick={() => navigate('/distributor/orders')}>
            <span>🛒</span>Orders
          </button>
          <button className="nav-item" onClick={() => navigate('/distributor/payments')}>
            <span>💳</span>Payments
          </button>
          <button className="nav-item" onClick={() => navigate('/distributor/expenses')}>
            <span>🧾</span>Expenses
          </button>
          <button className="nav-item" onClick={() => navigate('/distributor/profit-loss')}>
            <span>📈</span>Profit &amp; Loss
          </button>
          <button className="nav-item active">
            <span>⚙</span>Settings
          </button>
        </nav>

        <div className="sidebar-bottom">
          <div className="user-mini">
            <div className="avatar">{user?.name?.charAt(0).toUpperCase() || 'D'}</div>
            <div>
              <strong>{user?.name || 'Distributor'}</strong>
              <small>Distributor</small>
            </div>
          </div>
          <button className="logout-button" onClick={handleLogout}>↪ Logout</button>
        </div>
      </aside>

      <main className="dashboard-main">
        <header className="dashboard-header">
          <div>
            <p className="dashboard-label">SETTINGS</p>
            <h1>Business Profile</h1>
            <p className="dashboard-subtitle">Manage your business details</p>
          </div>
        </header>

        <section className="orders-section">
          {/* PROFILE FORM */}
          <div className="orders-card" style={{ padding: '30px', maxWidth: '600px', marginBottom: '24px' }}>
            {loading ? (
              <p>Loading profile...</p>
            ) : (
              <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <h3 style={{ margin: 0 }}>Business Details</h3>

                <div>
                  <label style={labelStyle}>Business Name</label>
                  <input type="text" name="name" value={formData.name} onChange={handleChange} required style={inputStyle} />
                </div>

                <div>
                  <label style={labelStyle}>Email Address</label>
                  <input type="email" name="email" value={formData.email} onChange={handleChange} required style={inputStyle} />
                </div>

                <div>
                  <label style={labelStyle}>Contact Number</label>
                  <input type="tel" name="contact" value={formData.contact} onChange={handleChange} required style={inputStyle} />
                </div>

                <div>
                  <label style={labelStyle}>Alternate Mobile Number (optional)</label>
                  <input type="tel" name="alternate_contact" value={formData.alternate_contact} onChange={handleChange} style={inputStyle} />
                </div>

                <div>
                  <label style={labelStyle}>Address</label>
                  <input type="text" name="address" value={formData.address} onChange={handleChange} required style={inputStyle} />
                </div>

                <div>
                  <label style={labelStyle}>Type of Shop</label>
                  <select name="type_of_shop" value={formData.type_of_shop} onChange={handleChange} required style={inputStyle}>
                    <option value="">Select type</option>
                    <option value="Dairy Distributor">Dairy Distributor</option>
                    <option value="Amul Distributor">Amul Distributor</option>
                    <option value="Wholesale Distributor">Wholesale Distributor</option>
                  </select>
                </div>

                <div>
                  <label style={labelStyle}>GST Number</label>
                  <input type="text" name="gst_no" value={formData.gst_no} onChange={handleChange} style={inputStyle} />
                </div>

                <div>
                  <label style={labelStyle}>Food License Validity</label>
                  <input type="date" name="food_license_validity" value={formData.food_license_validity} onChange={handleChange} required style={inputStyle} />
                </div>

                <div style={{ display: 'flex', gap: '12px' }}>
                  <div style={{ flex: 1 }}>
                    <label style={labelStyle}>Opening Time</label>
                    <input type="time" name="opening_time" value={formData.opening_time} onChange={handleChange} required style={inputStyle} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <label style={labelStyle}>Closing Time</label>
                    <input type="time" name="closing_time" value={formData.closing_time} onChange={handleChange} required style={inputStyle} />
                  </div>
                </div>

                <div>
                  <label style={{ ...labelStyle, marginBottom: '10px' }}>Notification Preferences</label>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 'normal' }}>
                      <input type="checkbox" name="email_notifications" checked={formData.email_notifications} onChange={handleChange} />
                      Email notifications
                    </label>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 'normal' }}>
                      <input type="checkbox" name="order_notifications" checked={formData.order_notifications} onChange={handleChange} />
                      New order alerts
                    </label>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 'normal' }}>
                      <input type="checkbox" name="promo_notifications" checked={formData.promo_notifications} onChange={handleChange} />
                      Promotional offers
                    </label>
                  </div>
                </div>

                {error && <div style={{ color: '#dc2626' }}>{error}</div>}
                {success && <div style={{ color: '#16a34a' }}>{success}</div>}

                <button type="submit" disabled={saving} className="new-order-button" style={{ justifyContent: 'center' }}>
                  {saving ? 'Saving...' : 'Save Changes'}
                </button>
              </form>
            )}
          </div>

          {/* CHANGE EMAIL (collapsible) */}
          <div className="orders-card" style={{ padding: '30px', maxWidth: '600px', marginBottom: '24px' }}>
            <div style={sectionHeaderStyle} onClick={() => setEmailOpen(!emailOpen)}>
              <h3 style={{ margin: 0 }}>Change Email</h3>
              <span>{emailOpen ? '▲' : '▼'}</span>
            </div>

            {emailOpen && (
              <form onSubmit={handleEmailSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '16px' }}>
                <div>
                  <label style={labelStyle}>Current Password</label>
                  <input type="password" name="currentPassword" value={emailData.currentPassword} onChange={handleEmailChange} required style={inputStyle} />
                </div>

                <div>
                  <label style={labelStyle}>New Email Address</label>
                  <input type="email" name="newEmail" value={emailData.newEmail} onChange={handleEmailChange} required style={inputStyle} />
                </div>

                {emailError && <div style={{ color: '#dc2626' }}>{emailError}</div>}
                {emailSuccess && <div style={{ color: '#16a34a' }}>{emailSuccess}</div>}

                <button type="submit" disabled={emailSaving} className="new-order-button" style={{ justifyContent: 'center' }}>
                  {emailSaving ? 'Updating...' : 'Update Email'}
                </button>
              </form>
            )}
          </div>

          {/* PASSWORD FORM (collapsible) */}
          <div className="orders-card" style={{ padding: '30px', maxWidth: '600px' }}>
            <div style={sectionHeaderStyle} onClick={() => setPwOpen(!pwOpen)}>
              <h3 style={{ margin: 0 }}>Change Password</h3>
              <span>{pwOpen ? '▲' : '▼'}</span>
            </div>

            {pwOpen && (
              <form onSubmit={handlePasswordSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '16px' }}>
                <div>
                  <label style={labelStyle}>Current Password</label>
                  <input type="password" name="currentPassword" value={passwordData.currentPassword} onChange={handlePasswordChange} required style={inputStyle} />
                </div>

                <div>
                  <label style={labelStyle}>New Password</label>
                  <input type="password" name="newPassword" value={passwordData.newPassword} onChange={handlePasswordChange} required style={inputStyle} />
                </div>

                <div>
                  <label style={labelStyle}>Confirm New Password</label>
                  <input type="password" name="confirmNewPassword" value={passwordData.confirmNewPassword} onChange={handlePasswordChange} required style={inputStyle} />
                </div>

                {pwError && <div style={{ color: '#dc2626' }}>{pwError}</div>}
                {pwSuccess && <div style={{ color: '#16a34a' }}>{pwSuccess}</div>}

                <button type="submit" disabled={pwSaving} className="new-order-button" style={{ justifyContent: 'center' }}>
                  {pwSaving ? 'Updating...' : 'Update Password'}
                </button>
              </form>
            )}
          </div>
        </section>
      </main>
    </div>
  );
};

export default Settings;