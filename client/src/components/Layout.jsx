import { NavLink } from 'react-router-dom';
import './Layout.css';

export default function Layout({ children }) {
  return (
    <div className="layout">
      <main className="layout-main">{children}</main>
      <nav className="bottom-nav">
        <NavLink to="/home" end className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
          <span className="nav-icon">🏠</span>
          <span>Home</span>
        </NavLink>
        <NavLink to="/scan" className={({ isActive }) => `nav-item nav-scan ${isActive ? 'active' : ''}`}>
          <span className="nav-icon">📷</span>
          <span>Scan</span>
        </NavLink>
        <NavLink to="/contacts" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
          <span className="nav-icon">👥</span>
          <span>Contacts</span>
        </NavLink>
        <NavLink to="/profile" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
          <span className="nav-icon">👤</span>
          <span>Profile</span>
        </NavLink>
      </nav>
    </div>
  );
}
