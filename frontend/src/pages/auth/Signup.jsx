import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { signupUser } from '../../api/authApi';
import './Login.css';

/* Eye icon: closed eye = hidden, open eye = visible */
const EyeIcon = ({ visible }) =>
  visible ? (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  ) : (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 9c3 4.5 7 6.5 10 6.5s7-2 10-6.5" />
      <line x1="12" y1="15.5" x2="12" y2="19" />
      <line x1="6.5" y1="14" x2="4.5" y2="17" />
      <line x1="17.5" y1="14" x2="19.5" y2="17" />
    </svg>
  );

const eyeButtonStyle = {
  position: 'absolute',
  right: '12px',
  top: '50%',
  transform: 'translateY(-50%)',
  background: 'none',
  border: 'none',
  padding: '4px',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: '#6b7280',
};

const Signup = () => {
  const [role, setRole] = useState('retailer');

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    contact: '',
    address: '',
    gst_no: '',
    shop_type: '',           // retailer only
    food_license_validity: '', // distributor only
    opening_time: '',          // distributor only
    closing_time: '',          // distributor only
    type_of_shop: '',          // distributor only
  });

  const [agreed, setAgreed] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Simple password strength check
  const getPasswordStrength = (pw) => {
    if (!pw) return null;
    if (pw.length < 6) return { label: 'Too short', color: '#e53935' };
    let score = 0;
    if (pw.length >= 8) score++;
    if (/[A-Z]/.test(pw)) score++;
    if (/[0-9]/.test(pw)) score++;
    if (/[^A-Za-z0-9]/.test(pw)) score++;
    if (score <= 1) return { label: 'Weak', color: '#e53935' };
    if (score <= 2) return { label: 'Okay', color: '#f9a825' };
    if (score === 3) return { label: 'Good', color: '#43a047' };
    return { label: 'Strong', color: '#2e7d32' };
  };

  const strength = getPasswordStrength(formData.password);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError('');
    setSuccess('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    if (!agreed) {
      setError('Please agree to the Terms & Conditions to continue');
      return;
    }

    setLoading(true);

    try {
      const payload = {
        role,
        name: formData.name,
        email: formData.email,
        password: formData.password,
        contact: formData.contact,
        address: formData.address,
        gst_no: formData.gst_no,
      };

      if (role === 'retailer') {
        payload.shop_type = formData.shop_type;
      } else {
        payload.food_license_validity = formData.food_license_validity;
        payload.opening_time = formData.opening_time;
        payload.closing_time = formData.closing_time;
        payload.type_of_shop = formData.type_of_shop;
      }

      await signupUser(payload);

      setSuccess('Account created successfully!');

      setTimeout(() => {
        navigate('/login');
      }, 1200);

    } catch (err) {
      setError(
        err.response?.data?.message ||
        'Unable to create account'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">

      {/* LEFT SIDE */}
      <div className="login-left">

        <div className="brand">
          <div className="brand-icon">S</div>
          <span>SmartSupply</span>
        </div>

        <div className="hero-content">

          <h1>
            Build your business
            <span> smarter.</span>
          </h1>

          <p>
            Join SmartSupply and simplify inventory,
            orders and connections between retailers
            and distributors.
          </p>

          <div className="features">
            <div>✓ Manage your inventory</div>
            <div>✓ Connect with suppliers</div>
            <div>✓ Track orders in real time</div>
          </div>

        </div>

      </div>

      {/* RIGHT SIDE */}
      <div className="login-right">

        <div className="login-card">

          <div className="login-header">
            <h2>Create account</h2>
            <p>Join SmartSupply today</p>
          </div>

          {/* ROLE SELECTOR */}
          <div className="role-selector">

            <button
              type="button"
              className={role === 'retailer' ? 'active' : ''}
              onClick={() => setRole('retailer')}
            >
              🛒 Retailer
            </button>

            <button
              type="button"
              className={role === 'distributor' ? 'active' : ''}
              onClick={() => setRole('distributor')}
            >
              📦 Distributor
            </button>

          </div>

          <form onSubmit={handleSubmit}>

            {/* NAME */}
            <div className="input-group">
              <label>{role === 'distributor' ? 'Business name' : 'Full name'}</label>

              <input
                type="text"
                name="name"
                placeholder={role === 'distributor' ? 'Enter your business name' : 'Enter your name'}
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

            {/* EMAIL */}
            <div className="input-group">
              <label>Email address</label>

              <input
                type="email"
                name="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            {/* CONTACT */}
            <div className="input-group">
              <label>Contact number</label>

              <input
                type="tel"
                name="contact"
                placeholder="Enter your phone number"
                value={formData.contact}
                onChange={handleChange}
                required
              />
            </div>

            {/* ADDRESS */}
            <div className="input-group">
              <label>Address</label>

              <input
                type="text"
                name="address"
                placeholder="Enter your shop/business address"
                value={formData.address}
                onChange={handleChange}
                required
              />
            </div>

            {/* RETAILER-ONLY: SHOP TYPE */}
            {role === 'retailer' && (
              <div className="input-group">
                <label>Shop type</label>

                <select
                  name="shop_type"
                  value={formData.shop_type}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select shop type</option>
                  <option value="Grocery Store">Grocery Store</option>
                  <option value="Supermarket">Supermarket</option>
                  <option value="Dairy Shop">Dairy Shop</option>
                </select>
              </div>
            )}

            {/* DISTRIBUTOR-ONLY FIELDS */}
            {role === 'distributor' && (
              <>
                <div className="input-group">
                  <label>Type of shop</label>

                  <select
                    name="type_of_shop"
                    value={formData.type_of_shop}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select type</option>
                    <option value="Dairy Distributor">Dairy Distributor</option>
                    <option value="Amul Distributor">Amul Distributor</option>
                    <option value="Wholesale Distributor">Wholesale Distributor</option>
                  </select>
                </div>

                <div className="input-group">
                  <label>Food license validity</label>

                  <input
                    type="date"
                    name="food_license_validity"
                    value={formData.food_license_validity}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="input-group" style={{ display: 'flex', gap: '10px' }}>
                  <div style={{ flex: 1 }}>
                    <label>Opening time</label>
                    <input
                      type="time"
                      name="opening_time"
                      value={formData.opening_time}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div style={{ flex: 1 }}>
                    <label>Closing time</label>
                    <input
                      type="time"
                      name="closing_time"
                      value={formData.closing_time}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>
              </>
            )}

            {/* GST NUMBER */}
            <div className="input-group">
              <label>GST number {role === 'retailer' ? '(optional)' : ''}</label>

              <input
                type="text"
                name="gst_no"
                placeholder="Enter GST number"
                value={formData.gst_no}
                onChange={handleChange}
                required={role === 'distributor'}
              />
            </div>

            {/* PASSWORD */}
            <div className="input-group">
              <label>Password</label>

              <div style={{ position: 'relative' }}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  placeholder="Create a password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  style={{ paddingRight: '48px' }}
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  title={showPassword ? 'Hide password' : 'Show password'}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  style={eyeButtonStyle}
                >
                  <EyeIcon visible={showPassword} />
                </button>
              </div>

              {strength && (
                <div style={{ fontSize: '12px', marginTop: '4px', color: strength.color }}>
                  Password strength: {strength.label}
                </div>
              )}
            </div>

            {/* CONFIRM PASSWORD */}
            <div className="input-group">
              <label>Confirm password</label>

              <div style={{ position: 'relative' }}>
                <input
                  type={showConfirm ? 'text' : 'password'}
                  name="confirmPassword"
                  placeholder="Confirm your password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                  style={{ paddingRight: '48px' }}
                />

                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  title={showConfirm ? 'Hide password' : 'Show password'}
                  aria-label={showConfirm ? 'Hide password' : 'Show password'}
                  style={eyeButtonStyle}
                >
                  <EyeIcon visible={showConfirm} />
                </button>
              </div>
            </div>

            {/* TERMS CHECKBOX */}
            <div className="input-group" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <input
                type="checkbox"
                id="agree"
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
              />
              <label htmlFor="agree" style={{ margin: 0, fontWeight: 'normal', fontSize: '14px' }}>
                I agree to the Terms & Conditions and Privacy Policy
              </label>
            </div>

            {/* ERROR */}
            {error && (
              <div className="error-message">
                {error}
              </div>
            )}

            {/* SUCCESS */}
            {success && (
              <div className="success-message">
                {success}
              </div>
            )}

            {/* CREATE ACCOUNT */}
            <button
              type="submit"
              className="login-button"
              disabled={loading}
            >
              {loading
                ? 'Creating account...'
                : 'Create Account'}
            </button>

          </form>

          {/* LOGIN LINK */}
          <div className="signup-text">
            Already have an account?{' '}
            <Link to="/login">
              Sign in
            </Link>
          </div>

        </div>

      </div>

    </div>
  );
};

export default Signup;