import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import GastroCareLogo from '../components/Logo';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); setLoading(true);
    try {
      await axios.post('/api/auth/forgot-password', { email });
      setSuccess(true);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send reset email. Please try again.');
    } finally { setLoading(false); }
  };

  return (
    <div className="gc-auth-page">
      <div className="gc-auth-card">
        <div className="gc-auth-logo text-center mb-4">
          <GastroCareLogo size={56} />
          <h2 className="mt-3">Forgot Password?</h2>
          <p className="text-muted small">Enter your email — we'll send a reset link</p>
        </div>

        {success ? (
          <div className="text-center py-3">
            <div style={{fontSize:'3rem',marginBottom:16}}>📧</div>
            <h5 style={{color:'var(--gc-primary)'}}>Check Your Email!</h5>
            <p className="text-muted small">We've sent a password reset link to <strong>{email}</strong>. Check your inbox and click the link to reset your password.</p>
            <p className="text-muted" style={{fontSize:'.8rem'}}>Link expires in 1 hour. Check spam folder if not found.</p>
            <Link to="/login" className="btn btn-primary w-100 mt-3 fw-semibold">
              <i className="bi bi-arrow-left me-2"/>Back to Login
            </Link>
          </div>
        ) : (
          <>
            {error && <div className="alert alert-danger d-flex align-items-center gap-2 py-2" style={{fontSize:'.875rem'}}><i className="bi bi-exclamation-circle"/>{error}</div>}
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="form-label fw-semibold small text-muted">Your Email Address</label>
                <div className="input-group">
                  <span className="input-group-text bg-light border-end-0"><i className="bi bi-envelope text-muted"/></span>
                  <input type="email" className="form-control border-start-0 ps-0"
                    placeholder="you@example.com" value={email}
                    onChange={e => setEmail(e.target.value)} required />
                </div>
              </div>
              <button type="submit" className="btn btn-primary w-100 py-2 fw-semibold" disabled={loading}>
                {loading ? <><span className="spinner-border spinner-border-sm me-2"/>Sending...</> : <><i className="bi bi-send me-2"/>Send Reset Link</>}
              </button>
            </form>
            <div className="text-center mt-4">
              <hr/><p className="text-muted small"><Link to="/login" className="fw-semibold text-decoration-none" style={{color:'var(--gc-primary)'}}><i className="bi bi-arrow-left me-1"/>Back to Login</Link></p>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
export default ForgotPassword;
