import { Link } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import Layout from '../components/Layout';
import ContactModal from '../components/ContactModal';
import './Dashboard.css';

export default function Dashboard() {
  const { user } = useAuth();
  const [selectedContactId, setSelectedContactId] = useState(null);
  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return 'Good morning';
    if (h < 18) return 'Good afternoon';
    return 'Good evening';
  };
  const recentContacts = (user?.contacts || []).slice(0, 3);

  return (
    <Layout>
      <header className="dashboard-header">
        <div>
          <p className="greeting">{greeting()},</p>
          <h1 className="user-name">{user?.name || 'User'}</h1>
        </div>
        <button className="icon-btn" aria-label="Notifications">🔔</button>
      </header>

      <div className="qr-cards">
        <Link to="/my-qr" className="qr-card qr-card-primary">
          <span className="qr-card-icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" className="qr-icon">
              <rect x="3" y="3" width="7" height="7" rx="1.5" />
              <rect x="14" y="3" width="7" height="7" rx="1.5" />
              <rect x="3" y="14" width="7" height="7" rx="1.5" />
              <rect x="14" y="14" width="3" height="3" />
              <rect x="18" y="18" width="3" height="3" />
            </svg>
          </span>
          <span>Show My QR</span>
        </Link>
        <Link to="/scan" className="qr-card qr-card-secondary">
          <span className="qr-card-icon">📷</span>
          <span>Scan QR</span>
        </Link>
      </div>

      <section className="recent-contacts">
        <div className="section-header">
          <h2>Recent Contacts</h2>
          <Link to="/contacts" className="see-all">See all</Link>
        </div>
        {recentContacts.length > 0 ? (
          <div className="contact-list">
            {recentContacts.map(c => (
              <button
                key={c._id}
                type="button"
                className="contact-item"
                onClick={() => setSelectedContactId(c.userId)}
              >
                <div className="contact-avatar">
                  {(c.name || c.email || '?')[0].toUpperCase()}
                </div>
                <div className="contact-info">
                  <span className="contact-name">{c.name || c.email}</span>
                  <span className="contact-role">
                    {c.name ? c.email : ''}
                  </span>
                </div>
                <span className="contact-arrow">→</span>
              </button>
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <p>No contacts yet. Scan a QR code to add someone!</p>
          </div>
        )}
      </section>

      {selectedContactId && (
        <ContactModal
          userId={selectedContactId}
          onClose={() => setSelectedContactId(null)}
        />
      )}
    </Layout>
  );
}
