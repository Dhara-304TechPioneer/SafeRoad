// Fast access to frequently used road-safety workflows.
import { FiArrowUpRight } from 'react-icons/fi';
import { quickActions } from '../../data/dashboardData';

export const QuickActions = () => {
  return (
    <section className="quick-actions" aria-label="Quick actions">
      {quickActions.map(({ label, icon: Icon }) => (
        <button key={label} className="quick-action">
          <span><Icon /></span>
          {label}
          <FiArrowUpRight />
        </button>
      ))}
    </section>
  );
};
