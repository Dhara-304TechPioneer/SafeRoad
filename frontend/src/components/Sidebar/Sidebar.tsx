// Primary navigation groups, ready for route links and role-based access later.
import { useLocation, useNavigate } from 'react-router-dom';
import {
  FiActivity,
  FiBarChart2,
  FiBell,
  FiClipboard,
  FiFileText,
  FiGrid,
  FiHelpCircle,
  FiMap,
  FiSettings,
  FiShield,
  FiTool,
  FiUsers,
} from 'react-icons/fi';

import './Sidebar.css';

const navigationItems = [
  { label: 'Dashboard', icon: FiGrid, path: '/dashboard' },
  { label: 'Live Map', icon: FiMap, path: '/live-map' },
  { label: 'Pothole Reports', icon: FiClipboard, path: '/my-reports' },
  { label: 'AI Detection', icon: FiActivity, path: '#' },
  { label: 'Repair Requests', icon: FiTool, path: '#' },
  { label: 'Municipal Officers', icon: FiUsers, path: '#' },
  { label: 'Analytics', icon: FiBarChart2, path: '/analytics' },
  { label: 'Admin Portal', icon: FiShield, path: '/admin' },
  { label: 'Notifications', icon: FiBell, path: '#' },
  { label: 'Documents', icon: FiFileText, path: '#' },
];

export const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleNavigation = (path: string) => {
    if (path && path !== '#') {
      navigate(path);
    }
  };

  const isItemActive = (path: string) => {
    if (path === '#' || !path) {
      return false;
    }
    if (path === '/my-reports') {
      return location.pathname === '/my-reports' || location.pathname.startsWith('/report/');
    }
    return location.pathname === path;
  };

  return (
    <aside className="sidebar">
      <nav aria-label="Primary">
        <p className="sidebar__label">WORKSPACE</p>

        {navigationItems.map(({ label, icon: Icon, path }) => (
          <button
            type="button"
            key={label}
            className={`sidebar__item ${isItemActive(path) ? 'sidebar__item--active' : ''}`}
            onClick={() => {
              handleNavigation(path);
            }}
          >
            <Icon />
            {label}
          </button>
        ))}

        <p className="sidebar__label sidebar__label--secondary">ACCOUNT</p>
        <button type="button" className="sidebar__item">
          <FiSettings />
          Settings
        </button>
        <button type="button" className="sidebar__item">
          <FiHelpCircle />
          Support
        </button>
      </nav>

      <div className="sidebar__help">
        <FiShield />
        <strong>SafeRoad Support</strong>
        <span>Need help with a report?</span>
        <button type="button">Open Help Center</button>
      </div>
    </aside>
  );
};
