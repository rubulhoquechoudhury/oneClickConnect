import { useEffect, useState } from 'react';
import api from '../lib/api';
import './ContactModal.css';
import '../pages/UserProfile.css';

export default function ContactModal({ userId, onClose }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) return;

    setLoading(true);
    api
      .get(`/user/${userId}`)
      .then((res) => setUser(res.data))
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, [userId]);

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="contact-modal-overlay"
      onClick={handleOverlayClick}
      role="dialog"
      aria-modal="true"
    >
      <div className="contact-modal">
        <button
          type="button"
          className="contact-modal-close"
          onClick={onClose}
          aria-label="Close"
        >
          ×
        </button>

        {loading ? (
          <div className="contact-modal-loading">
            <div className="spinner" />
          </div>
        ) : !user ? (
          <div className="contact-modal-loading">
            <p>User not found.</p>
          </div>
        ) : (
          <div className="user-profile-content">
            <div className="user-avatar">
              {user.avatar ? (
                <img
                  src={user.avatar}
                  alt={user.name || user.email || 'User'}
                />
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
                {user.extraLinks?.map(
                  (link, index) =>
                    link?.url && (
                      <a
                        key={index}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="social-link"
                      >
                        {link.label || 'Link'}
                      </a>
                    ),
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

