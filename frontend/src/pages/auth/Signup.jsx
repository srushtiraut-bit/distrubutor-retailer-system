import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { signupUser } from '../../api/authApi';
import './Login.css';

const Signup = () => {
  const [role, setRole] = useState('retailer');

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

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
    setSuccess('');

    // Check passwords
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);

    try {
      await signupUser({
        role,
        name: formData.name,
        email: formData.email,
        password: formData.password,
      });

      setSuccess('Account created successfully!');

      // Go to login after successful signup
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
              <label>Full name</label>

              <input
                type="text"
                name="name"
                placeholder="Enter your name"
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

            {/* PASSWORD */}
            <div className="input-group">
              <label>Password</label>

              <input
                type="password"
                name="password"
                placeholder="Create a password"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>

            {/* CONFIRM PASSWORD */}
            <div className="input-group">
              <label>Confirm password</label>

              <input
                type="password"
                name="confirmPassword"
                placeholder="Confirm your password"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
              />
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

            {/* SUBMIT */}
            <button
              type="submit"
              className="login-button"
              disabled={loading}
            >
              {loading ? 'Creating account...' : 'Create Account'}
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