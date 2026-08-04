// Fast access to frequently used road-safety workflows.
import { useNavigate } from 'react-router-dom';
import { FiArrowUpRight } from 'react-icons/fi';
import { quickActions } from '../../data/dashboardData';

export const QuickActions = () => {
  const navigate = useNavigate();

  return (
    <section className="quick-actions" aria-label="Quick actions">
      {quickActions.map(({ label, icon: Icon, path }) => (
        <button
          key={label}
          type="button"
          className="quick-action"
          onClick={() => {
            if (path) {
              navigate(path);
            }
          }}
        >
          <span><Icon /></span>
          {label}
          <FiArrowUpRight />
        </button>
      ))}
    </section>
  );
};
