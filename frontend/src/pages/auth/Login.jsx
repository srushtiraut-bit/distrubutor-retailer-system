import { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { loginUser } from '../../api/authApi';
import { AuthContext } from '../../context/AuthContext';
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

const Login = () => {
  const [role, setRole] = useState('retailer');

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await loginUser({
        role,
        ...formData,
      });

      login(res.data.user, res.data.token);

      navigate(
        role === 'distributor'
          ? '/distributor/dashboard'
          : '/retailer/dashboard'
      );
    } catch (err) {
      setError(
        err.response?.data?.message ||
        'Invalid email or password'
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
            Manage your supply chain
            <span> smarter.</span>
          </h1>

          <p>
            Connect retailers and distributors, manage inventory,
            track orders and grow your business — all in one place.
          </p>

          <div className="features">
            <div>✓ Smart Inventory Management</div>
            <div>✓ Real-time Order Tracking</div>
            <div>✓ Retailer & Distributor Network</div>
          </div>

        </div>
      </div>

      {/* RIGHT SIDE */}
      <div className="login-right">

        <div className="login-card">

          <div className="login-header">
            <h2>Welcome back</h2>
            <p>Sign in to continue to SmartSupply</p>
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

            {/* PASSWORD */}
            <div className="input-group">

              <div className="password-label">
                <label>Password</label>

                <a href="#forgot">
                  Forgot password?
                </a>
              </div>

              <div style={{ position: 'relative' }}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  placeholder="Enter your password"
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

            </div>

            {/* ERROR */}
            {error && (
              <div className="error-message">
                {error}
              </div>
            )}

            {/* LOGIN BUTTON */}
            <button
              type="submit"
              className="login-button"
              disabled={loading}
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>

          </form>

          {/* SIGNUP */}
          <div className="signup-text">
            Don't have an account?{' '}
            <Link to="/signup">
              Create an account
            </Link>
          </div>

        </div>

      </div>

    </div>
  );
};

export default Login;