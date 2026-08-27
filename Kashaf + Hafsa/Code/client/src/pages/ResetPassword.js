import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import GastroCareLogo from '../components/Logo';

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({ password: '', confirm: '' });
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (form.password !== form.confirm) return setError('Passwords do not match');
    if (form.password.length < 6) return setError('Password must be at least 6 characters');
    setLoading(true);
    try {
      await axios.post(`/api/auth/reset-password/${token}`, { password: form.password });
      setSuccess(true);
      setTimeout(() => navigate('/login'), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Reset failed. Link may have expired.');
    } finally { setLoading(false); }
  };

  return (
    <div className="gc-auth-page">
      <div className="gc-auth-card">
        <div className="gc-auth-logo text-center mb-4">
          <GastroCareLogo size={56} />
          <h2 className="mt-3">Reset Password</h2>
          <p className="text-muted small">Enter your new password below</p>
        </div>

        {success ? (
          <div className="text-center py-3">
            <div style={{fontSize:'3rem',marginBottom:16}}>✅</div>
            <h5 style={{color:'var(--gc-primary)'}}>Password Reset!</h5>
            <p className="text-muted small">Your password has been changed successfully. Redirecting to login...</p>
            <Link to="/login" className="btn btn-primary w-100 mt-3 fw-semibold">Go to Login</Link>
          </div>
        ) : (
          <>
            {error && <div className="alert alert-danger d-flex align-items-center gap-2 py-2" style={{fontSize:'.875rem'}}><i className="bi bi-exclamation-circle"/>{error}</div>}
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label fw-semibold small text-muted">New Password</label>
                <div className="input-group">
                  <span className="input-group-text bg-light border-end-0"><i className="bi bi-lock text-muted"/></span>
                  <input type={showPw?'text':'password'} className="form-control border-start-0 border-end-0 ps-0"
                    placeholder="Min. 6 characters" value={form.password}
                    onChange={e => setForm({...form, password: e.target.value})} required />
                  <button type="button" className="input-group-text bg-light" onClick={() => setShowPw(!showPw)}>
                    <i className={`bi ${showPw?'bi-eye-slash':'bi-eye'} text-muted`}/>
                  </button>
                </div>
              </div>
              <div className="mb-4">
                <label className="form-label fw-semibold small text-muted">Confirm New Password</label>
                <div className="input-group">
                  <span className="input-group-text bg-light border-end-0"><i className="bi bi-shield-check text-muted"/></span>
                  <input type={showPw?'text':'password'} className="form-control border-start-0 ps-0"
                    placeholder="Repeat password" value={form.confirm}
                    onChange={e => setForm({...form, confirm: e.target.value})} required />
                </div>
              </div>
              <button type="submit" className="btn btn-primary w-100 py-2 fw-semibold" disabled={loading}>
                {loading ? <><span className="spinner-border spinner-border-sm me-2"/>Resetting...</> : <><i className="bi bi-check-lg me-2"/>Reset Password</>}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
};
export default ResetPassword;
