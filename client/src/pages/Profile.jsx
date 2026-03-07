import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../lib/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import Layout from '../components/Layout';
import './Profile.css';

export default function Profile() {
  const { user, updateUser, logout } = useAuth();
  const navigate = useNavigate();
  const { addToast } = useToast();
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    socialLinks: { instagram: '', linkedin: '', twitter: '' },
    extraLinks: [],
    avatar: ''
  });
  const [loading, setLoading] = useState(false);
  const [showLinkModal, setShowLinkModal] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [newLink, setNewLink] = useState({ label: '', url: '' });
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (user) {
      setForm({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        socialLinks: {
          instagram: user.socialLinks?.instagram || '',
          linkedin: user.socialLinks?.linkedin || '',
          twitter: user.socialLinks?.twitter || ''
        },
        extraLinks: user.extraLinks || [],
        avatar: user.avatar || ''
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith('social.')) {
      const key = name.split('.')[1];
      setForm(prev => ({
        ...prev,
        socialLinks: { ...prev.socialLinks, [key]: value }
      }));
    } else {
      setForm(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleExtraLinkChange = (index, field, value) => {
    setForm(prev => {
      const updated = [...(prev.extraLinks || [])];
      updated[index] = { ...updated[index], [field]: value };
      return { ...prev, extraLinks: updated };
    });
  };

  const handleAddExtraLink = (e) => {
    e.preventDefault();
    if (!newLink.label.trim() || !newLink.url.trim()) {
      addToast('Please enter both name and link.', 'error');
      return;
    }
    setForm(prev => ({
      ...prev,
      extraLinks: [...(prev.extraLinks || []), { ...newLink }]
    }));
    setNewLink({ label: '', url: '' });
    setShowLinkModal(false);
  };

  const handleRemoveExtraLink = (index) => {
    setForm(prev => {
      const updated = [...(prev.extraLinks || [])];
      updated.splice(index, 1);
      return { ...prev, extraLinks: updated };
    });
  };

  const handlePhotoClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setForm(prev => ({ ...prev, avatar: reader.result || '' }));
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await api.put('/profile', form);
      updateUser(data.user);
      addToast('Profile updated!', 'success');
    } catch (err) {
      addToast(err.response?.data?.error || 'Failed to update', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <header className="page-header">
        <button className="back-btn" onClick={() => navigate(-1)}>←</button>
        <h1>Edit Profile</h1>
      </header>

      <form onSubmit={handleSubmit} className="profile-form">
        <div className="profile-photo-section">
          <div className="profile-photo">
            {form.avatar ? (
              <img src={form.avatar} alt="Profile" />
            ) : (
              <span>{(form.name || form.email || '?')[0].toUpperCase()}</span>
            )}
            <span className="photo-edit-icon">📷</span>
          </div>
          <button type="button" className="change-photo-link" onClick={handlePhotoClick}>
            Change Profile Photo
          </button>
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            style={{ display: 'none' }}
            onChange={handlePhotoChange}
          />
        </div>

        <section className="form-section">
          <h2>Personal Information</h2>
          <div className="form-group">
            <label>Full Name</label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Your name"
            />
          </div>
          <div className="form-group">
            <label>Email Address</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="email@example.com"
            />
            <span className="verified-badge">VERIFIED</span>
          </div>
          <div className="form-group">
            <label>Phone Number</label>
            <input
              type="tel"
              name="phone"
              value={form.phone}
              onChange={handleChange}
              placeholder="+1 (555) 123-4567"
            />
          </div>
        </section>

        <section className="form-section">
          <h2>Social Media Links</h2>
          <div className="social-input-group">
            <span className="social-icon instagram">📷</span>
            <input
              type="url"
              name="social.instagram"
              value={form.socialLinks.instagram}
              onChange={handleChange}
              placeholder="Instagram URL"
            />
          </div>
          <div className="social-input-group">
            <span className="social-icon linkedin">💼</span>
            <input
              type="url"
              name="social.linkedin"
              value={form.socialLinks.linkedin}
              onChange={handleChange}
              placeholder="LinkedIn URL"
            />
          </div>
          <div className="social-input-group">
            <span className="social-icon twitter">𝕏</span>
            <input
              type="url"
              name="social.twitter"
              value={form.socialLinks.twitter}
              onChange={handleChange}
              placeholder="X (Twitter) URL"
            />
          </div>
          {form.extraLinks?.map((link, index) => (
            <div className="extra-link-row" key={index}>
              <input
                type="text"
                value={link.label}
                onChange={e => handleExtraLinkChange(index, 'label', e.target.value)}
                placeholder="Link name (e.g. Portfolio)"
              />
              <input
                type="url"
                value={link.url}
                onChange={e => handleExtraLinkChange(index, 'url', e.target.value)}
                placeholder="https://example.com"
              />
              <button
                type="button"
                className="extra-link-remove"
                onClick={() => handleRemoveExtraLink(index)}
              >
                ✕
              </button>
            </div>
          ))}
          <button type="button" className="add-link-btn" onClick={() => setShowLinkModal(true)}>
            <span>+</span> Add Another Link
          </button>
        </section>

        <div className="profile-actions">
          <button type="submit" className="btn btn-primary" disabled={loading}>
            📄 Update Profile
          </button>

          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => setShowLogoutModal(true)}
          >
            Sign Out
          </button>
        </div>
      </form>

      {showLinkModal && (
        <div className="profile-modal-backdrop">
          <div className="profile-modal">
            <h3>Add Link</h3>
            <div className="modal-field">
              <label>Name</label>
              <input
                type="text"
                value={newLink.label}
                onChange={e => setNewLink(prev => ({ ...prev, label: e.target.value }))}
                placeholder="e.g. Portfolio, Blog"
              />
            </div>
            <div className="modal-field">
              <label>Link</label>
              <input
                type="url"
                value={newLink.url}
                onChange={e => setNewLink(prev => ({ ...prev, url: e.target.value }))}
                placeholder="https://example.com"
              />
            </div>
            <div className="modal-actions">
              <button type="button" className="btn btn-secondary" onClick={() => setShowLinkModal(false)}>
                Cancel
              </button>
              <button type="button" className="btn btn-primary" onClick={handleAddExtraLink}>
                Add Link
              </button>
            </div>
          </div>
        </div>
      )}

      {showLogoutModal && (
        <div className="profile-modal-backdrop">
          <div className="profile-modal">
            <h3>Sign out?</h3>
            <p style={{ marginBottom: 12, color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
              Are you sure you want to sign out of your account?
            </p>
            <div className="modal-actions">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setShowLogoutModal(false)}
              >
                No
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={async () => {
                  await api.post('/auth/logout');
                  logout();
                  navigate('/');
                }}
              >
                Yes, Sign Out
              </button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}
