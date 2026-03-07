import { useState } from 'react';
import './Home.css';
import { useNavigate } from 'react-router-dom';
import api from '../lib/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export default function Home() {
  const [mode, setMode] = useState('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();
  const { addToast } = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (mode === 'login') {
        const { data } = await api.post('/auth/login', { email, password });
        login(data.user);
        addToast('Welcome back!', 'success');
        navigate('/home');
      } else {
        if (password !== confirmPassword) {
          addToast('Passwords do not match', 'error');
          setLoading(false);
          return;
        }
        const { data } = await api.post('/auth/register', {
          email,
          password,
          confirmPassword
        });
        login(data.user);
        addToast('Account created! Complete your profile.', 'success');
        navigate('/home');
      }
    } catch (err) {
      addToast(err.response?.data?.error || 'Something went wrong', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page auth-page">
      <header className="auth-header">
        <div className="logo">
          <span className="logo-icon">▣</span>
          <span>NetPulse</span>
        </div>
        <a href="#" className="help-link">Help</a>
      </header>

      <main className="auth-main">
        <h1 className="auth-title">Connect Seamlessly</h1>
        <p className="auth-subtitle">
          Scan QR codes to share your professional profile instantly.
        </p>

        <div className="auth-tabs">
          <button
            className={`tab ${mode === 'login' ? 'active' : ''}`}
            onClick={() => setMode('login')}
          >
            Login
          </button>
          <button
            className={`tab ${mode === 'register' ? 'active' : ''}`}
            onClick={() => setMode('register')}
          >
            Create Account
          </button>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label>Email Address</label>
            <div className="input-wrap">
              <span className="input-icon">✉</span>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="name@company.com"
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label>Password</label>
            <div className="input-wrap">
              <span className="input-icon">🔒</span>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                required
              />
              {mode === 'login' && (
                <a href="#" className="forgot-link">Forgot?</a>
              )}
            </div>
          </div>

          {mode === 'register' && (
            <div className="form-group">
              <label>Confirm Password</label>
              <div className="input-wrap">
                <span className="input-icon">🔒</span>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>
          )}

          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Please wait...' : mode === 'login' ? 'Sign In →' : 'Create Account →'}
          </button>
        </form>

        <div className="auth-divider">Or continue with</div>
        <div className="social-buttons">
          <button type="button" className="btn btn-social">G Google</button>
          <button type="button" className="btn btn-social">iOS Apple</button>
        </div>
      </main>

      <footer className="auth-footer">
        By continuing, you agree to our{' '}
        <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a>.
      </footer>
    </div>
  );
}
