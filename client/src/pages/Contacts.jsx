import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import Layout from '../components/Layout';
import ContactModal from '../components/ContactModal';
import './Contacts.css';

export default function Contacts() {
  const { user } = useAuth();
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [selectedContactId, setSelectedContactId] = useState(null);
  const contacts = user?.contacts || [];
  const filtered = contacts.filter(c => {
    const matchSearch = !search || 
      (c.name?.toLowerCase().includes(search.toLowerCase())) ||
      (c.email?.toLowerCase().includes(search.toLowerCase()));
    return matchSearch;
  });

  return (
    <Layout>
      <header className="contacts-header">
        <button className="menu-btn">☰</button>
        <h1>Saved Contacts</h1>
        <button className="add-btn">+</button>
      </header>

      <div className="search-bar">
        <span className="search-icon">🔍</span>
        <input
          type="text"
          placeholder="Search contacts..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      <div className="filter-tabs">
        {['All', 'Recents', 'Work', 'Events'].map(f => (
          <button
            key={f}
            className={`filter-tab ${filter === f.toLowerCase() ? 'active' : ''}`}
            onClick={() => setFilter(f.toLowerCase())}
          >
            {f}
          </button>
        ))}
      </div>

      <div className="contacts-list">
        {filtered.length > 0 ? (
          filtered.map(c => (
            <button
              key={c._id}
              type="button"
              className="contact-row"
              onClick={() => setSelectedContactId(c.userId)}
            >
              <div className="contact-avatar">
                {(c.name || c.email || '?')[0].toUpperCase()}
              </div>
              <div className="contact-details">
                <span className="contact-name">{c.name || c.email}</span>
                <span className="contact-title">{c.email}</span>
              </div>
              <div className="contact-actions">
                <span className="action-icon">@</span>
                <span className="action-icon">🔗</span>
              </div>
            </button>
          ))
        ) : (
          <div className="empty-contacts">
            <p>No contacts yet. Scan a QR code to add someone!</p>
          </div>
        )}
      </div>

      {selectedContactId && (
        <ContactModal
          userId={selectedContactId}
          onClose={() => setSelectedContactId(null)}
        />
      )}
    </Layout>
  );
}
