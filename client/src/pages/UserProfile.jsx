import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../lib/api';
import './UserProfile.css';

export default function UserProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(`/user/${id}`)
      .then(res => setUser(res.data))
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return <div className="loading-screen"><div className="spinner" /></div>;
  }

  if (!user) {
    return (
      <div className="page">
        <div className="error-state">
          <h2>User not found</h2>
          <button onClick={() => navigate(-1)} className="btn btn-primary">Go Back</button>
        </div>
      </div>
    );
  }

  return (
    <div className="page user-profile-page">
      <header className="profile-header">
        <button className="back-btn" onClick={() => navigate(-1)}>←</button>
        <h1>Profile</h1>
      </header>

      <div className="user-profile-content">
        <div className="user-avatar">
          {user.avatar ? (
            <img src={user.avatar} alt={user.name || user.email || 'User'} />
          ) : (
            (user.name || user.email || '?')[0].toUpperCase()
          )}
        </div>
        <h2>{user.name || user.email}</h2>
        {user.email && <p className="user-email">{user.email}</p>}
        {user.phone && <p className="user-phone">{user.phone}</p>}

        {(user.socialLinks?.instagram ||
          user.socialLinks?.linkedin ||
          user.socialLinks?.twitter ||
          (user.extraLinks && user.extraLinks.length > 0)) && (
          <div className="social-links">
            {user.socialLinks?.instagram && (
              <a
                href={user.socialLinks.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="social-link"
              >
                Instagram
              </a>
            )}
            {user.socialLinks?.linkedin && (
              <a
                href={user.socialLinks.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="social-link"
              >
                LinkedIn
              </a>
            )}
            {user.socialLinks?.twitter && (
              <a
                href={user.socialLinks.twitter}
                target="_blank"
                rel="noopener noreferrer"
                className="social-link"
              >
                Twitter
              </a>
            )}
            {user.extraLinks?.map((link, index) =>
              link?.url ? (
                <a
                  key={index}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="social-link"
                >
                  {link.label || 'Link'}
                </a>
              ) : null
            )}
          </div>
        )}
      </div>
    </div>
  );
}
