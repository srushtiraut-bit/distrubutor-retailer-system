import { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { loginUser } from '../../api/authApi';
import { AuthContext } from '../../context/AuthContext';
import './Login.css';

const Login = () => {
  const [role, setRole] = useState('retailer');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

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
        err.response?.data?.message || 'Invalid email or password'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">

      {/* Left side */}
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

      {/* Right side */}
      <div className="login-right">
        <div className="login-card">

          <div className="login-header">
            <h2>Welcome back</h2>
            <p>Sign in to continue to SmartSupply</p>
          </div>

          {/* Role selector */}
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

            <div className="input-group">
              <div className="password-label">
                <label>Password</label>
                <a href="#forgot">Forgot password?</a>
              </div>

              <input
                type="password"
                name="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>

            {error && (
              <div className="error-message">
                {error}
              </div>
            )}

            <button
              type="submit"
              className="login-button"
              disabled={loading}
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>

          </form>

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