import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../lib/api';
import { useToast } from '../context/ToastContext';
import Layout from '../components/Layout';
import './MyQR.css';

export default function MyQR() {
  const [qr, setQr] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { addToast } = useToast();

  useEffect(() => {
    api.get('/qr/my')
      .then(res => setQr(res.data))
      .catch(() => addToast('Failed to load QR', 'error'))
      .finally(() => setLoading(false));
  }, [addToast]);

  const copyLink = () => {
    if (!qr?.profileUrl) return;
    navigator.clipboard.writeText(qr.profileUrl);
    addToast('Link copied!', 'success');
  };

  if (loading) {
    return (
      <Layout>
        <div className="loading-qr"><div className="spinner" /></div>
      </Layout>
    );
  }

  return (
    <Layout>
      <header className="page-header">
        <button className="back-btn" onClick={() => navigate(-1)}>←</button>
        <h1>My Unique QR Code</h1>
      </header>

      <div className="qr-content">
        <h2>Your Personal Scan Code</h2>
        <p>Let others scan this to instantly connect.</p>

        <div className="myqr-card">
          <img src={qr?.qrCodeUrl} alt="QR Code" className="qr-image" />
        </div>

        <div className="qr-status">
          <span className="status-dot"></span>
          ACTIVE PERMANENT LINK
        </div>
        <a href={qr?.profileUrl} className="profile-link" target="_blank" rel="noopener noreferrer">
          {qr?.profileUrl}
        </a>
        <button onClick={copyLink} className="copy-btn">
          📄 Copy Link
        </button>

        <button
          className="btn btn-primary btn-full share-btn"
          onClick={() => {
            if (navigator.share && qr?.profileUrl) {
              navigator.share({
                title: 'My NetPulse Profile',
                url: qr.profileUrl,
                text: 'Connect with me on NetPulse!'
              }).then(() => addToast('Shared!', 'success')).catch(() => copyLink());
            } else {
              copyLink();
            }
          }}
        >
          📤 Share Profile
        </button>
      </div>
    </Layout>
  );
}
