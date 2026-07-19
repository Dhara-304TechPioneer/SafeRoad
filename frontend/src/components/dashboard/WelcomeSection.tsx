// Dashboard greeting and primary report action.
import { FiPlus } from 'react-icons/fi';
import { Link } from 'react-router-dom';

export const WelcomeSection = () => {
  return (
    <section className="welcome">
      <div>
        <p className="eyebrow">TUESDAY, 15 JULY 2026 · 10:30 AM</p>
        <h1>
          Good morning, Ananya <span>👋</span>
        </h1>
        <p>Making roads safer, one report at a time.</p>
      </div>

      <Link className="primary-action" to="/report-pothole">
        <FiPlus />
        Create report
      </Link>
    </section>
  );
};
