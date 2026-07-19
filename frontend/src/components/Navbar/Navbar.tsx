// Sticky global navigation with search, context indicators, and user controls.
import {
  FiAlertTriangle,
  FiBell,
  FiCloud,
  FiMapPin,
  FiMoon,
  FiSearch,
  FiSun,
} from 'react-icons/fi';

import { useTheme } from '../../context/ThemeContext';

import './Navbar.css';

export const Navbar = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="navbar">
      <div className="navbar__brand">
        <span className="navbar__logo">S</span>
        <div>
          <strong>SafeRoad</strong>
          <small>Making Every Road Safer.</small>
        </div>
      </div>

      <label className="navbar__search">
        <FiSearch />
        <input
          aria-label="Search SafeRoad"
          placeholder="Search reports, roads, people…"
        />
      </label>

      <div className="navbar__meta">
        <span>
          <FiCloud />
          28°C
        </span>
        <span className="navbar__location">
          <FiMapPin />
          New Delhi
        </span>
        <button
          type="button"
          className="icon-button"
          aria-label="Toggle theme"
          onClick={toggleTheme}
        >
          {theme === 'light' ? <FiMoon /> : <FiSun />}
        </button>
        <button
          type="button"
          className="icon-button notification-button"
          aria-label="Open notifications"
        >
          <FiBell />
          <b>4</b>
        </button>
        <button type="button" className="emergency-button">
          <FiAlertTriangle />
          Emergency
        </button>
        <button type="button" className="avatar" aria-label="Open profile">AP</button>
      </div>
    </header>
  );
};
