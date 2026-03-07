import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Html5QrcodeScanner } from 'html5-qrcode';
import api from '../lib/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import Layout from '../components/Layout';
import './ScanQR.css';

export default function ScanQR() {
  const [scannedUser, setScannedUser] = useState(null);
  const [adding, setAdding] = useState(false);
  const [scanning, setScanning] = useState(true);
  const [scanKey, setScanKey] = useState(0);
  const navigate = useNavigate();
  const { updateUser } = useAuth();
  const { addToast } = useToast();
  const processingRef = useRef(false);

  const handleDecodedText = (decodedText) => {
    if (processingRef.current) return;
    processingRef.current = true;

    const match = decodedText.match(/\/user\/([^/?#]+)/);
    const userId = match ? match[1] : decodedText;

    api.get(`/user/${userId}`)
      .then(res => setScannedUser(res.data))
      .catch(() => {
        addToast('User not found', 'error');
      })
      .finally(() => {
        processingRef.current = false;
      });
  };

  useEffect(() => {
    if (!scanning) return;
    const scanner = new Html5QrcodeScanner(
      'qr-reader',
      { fps: 10, qrbox: { width: 360, height: 220 } },
      false
    );
    scanner.render(handleDecodedText, () => {});
    return () => {
      try { scanner.clear(); } catch (_) {}
    };
  }, [scanning, scanKey]);

  const handleAdd = async () => {
    if (!scannedUser) return;
    setAdding(true);
    try {
      const { data } = await api.post('/contacts/add', { userId: scannedUser.userId });
      updateUser(data.user);
      addToast('Contact added!', 'success');
      setScannedUser(null);
      setScanning(true);
      setScanKey(k => k + 1);
    } catch (err) {
      addToast(err.response?.data?.error || 'Failed to add contact', 'error');
    } finally {
      setAdding(false);
    }
  };

  const handleCancel = () => {
    setScannedUser(null);
    setScanning(true);
    setScanKey(k => k + 1);
  };

  return (
    <Layout>
      <header className="scan-header">
        <button className="close-btn" onClick={() => navigate(-1)}>✕</button>
        <h1>Scan QR Code</h1>
        <button className="help-btn">?</button>
      </header>

      <div className="scan-area">
        <div className="qr-reader-container">
          {scanning && <div id="qr-reader" key={scanKey} className="qr-reader"></div>}
        </div>
        {scannedUser && (
          <div className="scan-result">
            <div className="result-card">
              <div className="result-avatar">
                {(scannedUser.name || scannedUser.email || '?')[0].toUpperCase()}
              </div>
              <div className="result-info">
                <h3>{scannedUser.name || scannedUser.email}</h3>
                <p>{scannedUser.email}</p>
                <span className="verified">✓</span>
              </div>
              <p className="result-message">
                We found a match! Would you like to add {scannedUser.name || 'this user'} to your professional network?
              </p>
              <div className="result-actions">
                <button className="btn btn-secondary" onClick={handleCancel}>
                  Cancel
                </button>
                <button
                  className="btn btn-primary"
                  onClick={handleAdd}
                  disabled={adding}
                >
                  {adding ? 'Adding...' : 'Add to Contacts'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
