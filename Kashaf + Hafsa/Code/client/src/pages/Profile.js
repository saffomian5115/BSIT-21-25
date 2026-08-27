import React, { useState, useEffect, useRef, useCallback } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

// ── TagField OUTSIDE Profile component — fixes focus bug ──────────────────────
const TagField = ({ field, label, values, onAdd, onRemove }) => {
  const [tagInput, setTagInput] = useState('');
  const inputRef = useRef();

  const handleAdd = () => {
    if (!tagInput.trim()) return;
    onAdd(field, tagInput.trim());
    setTagInput('');
    inputRef.current?.focus();
  };

  return (
    <div className="mb-3">
      <label className="form-label fw-semibold small text-muted">{label}</label>
      <div className="d-flex flex-wrap gap-2 mb-2">
        {(values || []).map((t, i) => (
          <span key={i} className="gc-tag-badge">
            {t}
            <button onClick={() => onRemove(field, i)}>×</button>
          </span>
        ))}
      </div>
      <div className="input-group input-group-sm" style={{ maxWidth: 340 }}>
        <input
          ref={inputRef}
          type="text"
          className="form-control"
          placeholder={`Add ${label.toLowerCase()}...`}
          value={tagInput}
          onChange={e => setTagInput(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); handleAdd(); } }}
        />
        <button className="btn btn-outline-primary" type="button" onClick={handleAdd}>Add</button>
      </div>
    </div>
  );
};

const TABS = [
  { label: 'Personal Info', icon: 'bi-person' },
  { label: 'Medical History', icon: 'bi-heart-pulse' },
  { label: 'Change Password', icon: 'bi-lock' }
];

const Profile = () => {
  const { user, login } = useAuth();
  const [tab, setTab] = useState(0);
  const [profile, setProfile] = useState({ name:'', age:'', height:'', maritalStatus:'', profession:'', income:'', area:'', country:'', profilePicture:'' });
  const [medical, setMedical] = useState({ bloodGroup:'', allergies:[], chronicDiseases:[], currentMedications:[], previousSurgeries:[], smokingStatus:'', alcoholConsumption:'', digestiveIssues:[], dietType:'', weight:'' });
  const [pwForm, setPwForm] = useState({ current:'', newPw:'', confirm:'' });
  const [showPw, setShowPw] = useState(false);
  const [saving, setSaving] = useState(false);
  const [pwLoading, setPwLoading] = useState(false);
  const [msg, setMsg] = useState({ text:'', type:'' });
  const fileRef = useRef();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data } = await axios.get('/api/user/profile');
        setProfile({ name: data.name || '', ...(data.profile || {}) });
        if (data.medicalHistory) setMedical(data.medicalHistory);
      } catch {}
    };
    fetchProfile();
  }, []);

  const showMsg = (text, type = 'success') => {
    setMsg({ text, type });
    setTimeout(() => setMsg({ text:'', type:'' }), 4000);
  };

  // Tag handlers — stable with useCallback
  const handleAddTag = useCallback((field, value) => {
    setMedical(prev => ({ ...prev, [field]: [...(prev[field] || []), value] }));
  }, []);

  const handleRemoveTag = useCallback((field, idx) => {
    setMedical(prev => ({ ...prev, [field]: prev[field].filter((_, i) => i !== idx) }));
  }, []);

  const handleProfileChange = e => setProfile(prev => ({ ...prev, [e.target.name]: e.target.value }));
  const handleMedicalChange = e => setMedical(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const saveProfile = async () => {
    setSaving(true);
    try {
      const { data } = await axios.put('/api/user/profile', { name: profile.name, profile, medicalHistory: medical });
      login({ ...user, name: data.name, profile: data.profile });
      showMsg('✅ Profile saved successfully!');
    } catch { showMsg('❌ Failed to save. Try again.', 'danger'); }
    finally { setSaving(false); }
  };

  const handlePicture = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = async () => {
      try {
        await axios.put('/api/user/picture', { profilePicture: reader.result });
        setProfile(p => ({ ...p, profilePicture: reader.result }));
        login({ ...user, profile: { ...user.profile, profilePicture: reader.result } });
        showMsg('✅ Profile picture updated!');
      } catch { showMsg('❌ Failed to update picture.', 'danger'); }
    };
    reader.readAsDataURL(file);
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (pwForm.newPw !== pwForm.confirm) return showMsg('❌ New passwords do not match!', 'danger');
    if (pwForm.newPw.length < 6) return showMsg('❌ Password must be at least 6 characters!', 'danger');
    setPwLoading(true);
    try {
      await axios.put('/api/user/change-password', { currentPassword: pwForm.current, newPassword: pwForm.newPw });
      showMsg('✅ Password changed successfully!');
      setPwForm({ current:'', newPw:'', confirm:'' });
    } catch (err) {
      showMsg(`❌ ${err.response?.data?.message || 'Failed to change password.'}`, 'danger');
    } finally { setPwLoading(false); }
  };

  const initial = profile.name?.[0]?.toUpperCase() || 'U';

  return (
    <div className="page-pt">
      <div className="container py-4">
        {msg.text && (
          <div className={`alert alert-${msg.type === 'danger' ? 'danger' : 'success'} py-2 mb-3`}>
            {msg.text}
          </div>
        )}
        <div className="row g-4">
          {/* Sidebar */}
          <div className="col-lg-3">
            <div className="bg-white rounded-gc shadow-gc p-4 text-center">
              <div className="position-relative d-inline-block mb-3">
                <div className="gc-profile-avatar">
                  {profile.profilePicture ? <img src={profile.profilePicture} alt="" /> : initial}
                </div>
                <div className="gc-avatar-upload-btn" onClick={() => fileRef.current.click()} title="Change photo">
                  <i className="bi bi-camera-fill" style={{fontSize:'.7rem'}}/>
                </div>
                <input type="file" ref={fileRef} className="d-none" accept="image/*" onChange={handlePicture}/>
              </div>
              <h5 className="mb-1">{profile.name || user?.name}</h5>
              <p className="text-muted small mb-3">{user?.email}</p>
              <span className="badge px-3 py-2 rounded-pill" style={{background:'rgba(10,79,60,.1)',color:'var(--gc-primary)'}}>
                <i className="bi bi-shield-check me-1"/>Verified User
              </span>
              <hr/>
              <div className="d-flex flex-column gap-1">
                {TABS.map((t, i) => (
                  <button key={i} className={`btn btn-sm text-start ${tab===i ? 'btn-primary' : 'btn-light'}`} onClick={() => setTab(i)}>
                    <i className={`bi ${t.icon} me-2`}/>{t.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Main */}
          <div className="col-lg-9">

            {/* Personal Info */}
            {tab === 0 && (
              <div className="bg-white rounded-gc shadow-gc p-4">
                <h5 style={{color:'var(--gc-primary)',borderBottom:'2px solid var(--gc-bg)',paddingBottom:12,marginBottom:24}}>
                  <i className="bi bi-person me-2"/>Personal Information
                </h5>
                <div className="row g-3">
                  {[
                    {label:'Full Name',name:'name',type:'text',ph:'Your full name'},
                    {label:'Age',name:'age',type:'number',ph:'Your age'},
                    {label:'Height (cm/ft)',name:'height',type:'text',ph:'e.g. 170cm'},
                    {label:'Weight (kg/lbs)',name:'weight',type:'text',ph:'e.g. 70kg'},
                    {label:'Profession',name:'profession',type:'text',ph:'Your profession'},
                    {label:'Monthly Income',name:'income',type:'text',ph:'e.g. PKR 50,000'},
                    {label:'Area / City',name:'area',type:'text',ph:'Your city'},
                    {label:'Country',name:'country',type:'text',ph:'Your country'},
                  ].map(f => (
                    <div className="col-md-6" key={f.name}>
                      <label className="form-label fw-semibold small text-muted">{f.label}</label>
                      <input type={f.type} className="form-control" name={f.name}
                        value={profile[f.name]||''} onChange={handleProfileChange} placeholder={f.ph}/>
                    </div>
                  ))}
                  <div className="col-md-6">
                    <label className="form-label fw-semibold small text-muted">Marital Status</label>
                    <select className="form-select" name="maritalStatus" value={profile.maritalStatus||''} onChange={handleProfileChange}>
                      <option value="">Select status</option>
                      {['Single','Married','Divorced','Widowed'].map(s=><option key={s}>{s}</option>)}
                    </select>
                  </div>
                </div>
                <button className="btn btn-primary mt-4 px-4 fw-semibold" onClick={saveProfile} disabled={saving}>
                  {saving?<><span className="spinner-border spinner-border-sm me-2"/>Saving...</>:<><i className="bi bi-check-lg me-2"/>Save Changes</>}
                </button>
              </div>
            )}

            {/* Medical History */}
            {tab === 1 && (
              <div className="bg-white rounded-gc shadow-gc p-4">
                <h5 style={{color:'var(--gc-primary)',borderBottom:'2px solid var(--gc-bg)',paddingBottom:12,marginBottom:24}}>
                  <i className="bi bi-heart-pulse me-2"/>Medical History
                </h5>
                <div className="row g-3 mb-4">
                  <div className="col-md-4">
                    <label className="form-label fw-semibold small text-muted">Blood Group</label>
                    <select className="form-select" name="bloodGroup" value={medical.bloodGroup||''} onChange={handleMedicalChange}>
                      <option value="">Select</option>
                      {['A+','A-','B+','B-','AB+','AB-','O+','O-'].map(g=><option key={g}>{g}</option>)}
                    </select>
                  </div>
                  <div className="col-md-4">
                    <label className="form-label fw-semibold small text-muted">Diet Type</label>
                    <select className="form-select" name="dietType" value={medical.dietType||''} onChange={handleMedicalChange}>
                      <option value="">Select</option>
                      {['Omnivore','Vegetarian','Vegan','Pescatarian','Keto','Other'].map(d=><option key={d}>{d}</option>)}
                    </select>
                  </div>
                  <div className="col-md-4">
                    <label className="form-label fw-semibold small text-muted">Smoking Status</label>
                    <select className="form-select" name="smokingStatus" value={medical.smokingStatus||''} onChange={handleMedicalChange}>
                      <option value="">Select</option>
                      {['Never','Former','Current'].map(s=><option key={s}>{s}</option>)}
                    </select>
                  </div>
                  <div className="col-md-6">
                    <label className="form-label fw-semibold small text-muted">Alcohol Consumption</label>
                    <select className="form-select" name="alcoholConsumption" value={medical.alcoholConsumption||''} onChange={handleMedicalChange}>
                      <option value="">Select</option>
                      {['Never','Occasionally','Regularly'].map(a=><option key={a}>{a}</option>)}
                    </select>
                  </div>
                </div>

                <TagField field="allergies" label="Allergies" values={medical.allergies} onAdd={handleAddTag} onRemove={handleRemoveTag}/>
                <TagField field="chronicDiseases" label="Chronic Diseases" values={medical.chronicDiseases} onAdd={handleAddTag} onRemove={handleRemoveTag}/>
                <TagField field="currentMedications" label="Current Medications" values={medical.currentMedications} onAdd={handleAddTag} onRemove={handleRemoveTag}/>
                <TagField field="previousSurgeries" label="Previous Surgeries" values={medical.previousSurgeries} onAdd={handleAddTag} onRemove={handleRemoveTag}/>
                <TagField field="digestiveIssues" label="Digestive Issues" values={medical.digestiveIssues} onAdd={handleAddTag} onRemove={handleRemoveTag}/>

                <button className="btn btn-primary mt-2 px-4 fw-semibold" onClick={saveProfile} disabled={saving}>
                  {saving?<><span className="spinner-border spinner-border-sm me-2"/>Saving...</>:<><i className="bi bi-check-lg me-2"/>Save Medical History</>}
                </button>
              </div>
            )}

            {/* Change Password */}
            {tab === 2 && (
              <div className="bg-white rounded-gc shadow-gc p-4">
                <h5 style={{color:'var(--gc-primary)',borderBottom:'2px solid var(--gc-bg)',paddingBottom:12,marginBottom:24}}>
                  <i className="bi bi-lock me-2"/>Change Password
                </h5>
                <form onSubmit={handleChangePassword} style={{maxWidth:420}}>
                  <div className="mb-3">
                    <label className="form-label fw-semibold small text-muted">Current Password</label>
                    <div className="input-group">
                      <span className="input-group-text bg-light border-end-0"><i className="bi bi-lock text-muted"/></span>
                      <input type={showPw?'text':'password'} className="form-control border-start-0 border-end-0 ps-0"
                        placeholder="Your current password" value={pwForm.current}
                        onChange={e=>setPwForm(p=>({...p,current:e.target.value}))} required/>
                      <button type="button" className="input-group-text bg-light" onClick={()=>setShowPw(!showPw)}>
                        <i className={`bi ${showPw?'bi-eye-slash':'bi-eye'} text-muted`}/>
                      </button>
                    </div>
                  </div>
                  <div className="mb-3">
                    <label className="form-label fw-semibold small text-muted">New Password</label>
                    <div className="input-group">
                      <span className="input-group-text bg-light border-end-0"><i className="bi bi-key text-muted"/></span>
                      <input type={showPw?'text':'password'} className="form-control border-start-0 ps-0"
                        placeholder="Min. 6 characters" value={pwForm.newPw}
                        onChange={e=>setPwForm(p=>({...p,newPw:e.target.value}))} required/>
                    </div>
                  </div>
                  <div className="mb-4">
                    <label className="form-label fw-semibold small text-muted">Confirm New Password</label>
                    <div className="input-group">
                      <span className="input-group-text bg-light border-end-0"><i className="bi bi-shield-check text-muted"/></span>
                      <input type={showPw?'text':'password'} className="form-control border-start-0 ps-0"
                        placeholder="Repeat new password" value={pwForm.confirm}
                        onChange={e=>setPwForm(p=>({...p,confirm:e.target.value}))} required/>
                    </div>
                  </div>
                  <button type="submit" className="btn btn-primary fw-semibold px-4" disabled={pwLoading}>
                    {pwLoading?<><span className="spinner-border spinner-border-sm me-2"/>Changing...</>:<><i className="bi bi-shield-lock me-2"/>Update Password</>}
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
