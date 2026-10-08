import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { forgotPassword, resetPassword } from '../../api/authApi';
import './Login.css';

const ForgotPassword = () => {
  const navigate = useNavigate();

  const [step, setStep] = useState(1); // 1 = enter email, 2 = enter code + new password
  const [role, setRole] = useState('retailer');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [info, setInfo] = useState('');
  const [loading, setLoading] = useState(false);

  const sendCode = async (e) => {
    if (e) e.preventDefault();
    setError('');
    setInfo('');
    setLoading(true);
    try {
      const res = await forgotPassword({ role, email });
      setInfo(res.data.message);
      setStep(2);
    } catch (err) {
      setError(err.response?.data?.message || 'Could not send the code');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = async (e) => {
    e.preventDefault();
    setError('');
    setInfo('');

    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);
    try {
      const res = await resetPassword({ role, email, otp, newPassword });
      setInfo(res.data.message);
      setTimeout(() => navigate('/login'), 1800);
    } catch (err) {
      setError(err.response?.data?.message || 'Could not reset password');
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
            Locked out?
            <span> We've got you.</span>
          </h1>
          <p>
            Enter your registered email, type the 6-digit code we send you,
            and choose a new password.
          </p>
        </div>
      </div>

      {/* RIGHT SIDE */}
      <div className="login-right">
        <div className="login-card">
          <div className="login-header">
            <h2>Reset password</h2>
            <p>
              {step === 1
                ? 'We will email you a 6-digit code'
                : `Enter the code sent to ${email}`}
            </p>
          </div>

          {step === 1 && (
            <form onSubmit={sendCode}>
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

              <div className="input-group">
                <label>Email address</label>
                <input
                  type="email"
                  placeholder="Enter your registered email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              {error && <div className="error-message">{error}</div>}

              <button type="submit" className="login-button" disabled={loading}>
                {loading ? 'Sending...' : 'Send code'}
              </button>
            </form>
          )}

          {step === 2 && (
            <form onSubmit={handleReset}>
              {info && (
                <div style={{ color: '#15803d', fontSize: '14px', marginBottom: '12px' }}>
                  {info}
                </div>
              )}

              <div className="input-group">
                <label>6-digit code</label>
                <input
                  type="text"
                  inputMode="numeric"
                  maxLength={6}
                  placeholder="Enter the code"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                  required
                />
              </div>

              <div className="input-group">
                <label>New password</label>
                <input
                  type="password"
                  placeholder="At least 6 characters"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                />
              </div>

              <div className="input-group">
                <label>Confirm new password</label>
                <input
                  type="password"
                  placeholder="Re-enter new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>

              {error && <div className="error-message">{error}</div>}

              <button type="submit" className="login-button" disabled={loading}>
                {loading ? 'Resetting...' : 'Reset password'}
              </button>

              <div className="signup-text">
                Didn't get the code?{' '}
                <a href="#resend" onClick={(e) => { e.preventDefault(); sendCode(); }}>
                  Send again
                </a>
              </div>
            </form>
          )}

          <div className="signup-text">
            <Link to="/login">← Back to sign in</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;