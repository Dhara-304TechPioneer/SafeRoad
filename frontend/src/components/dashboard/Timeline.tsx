// Operational event timeline placeholder for the dashboard activity stream.
import { timelineEvents } from '../../data/dashboardData';

export const Timeline = () => {
  return (
    <article className="panel activity-panel">
      <header>
        <div>
          <h2>Activity timeline</h2>
          <p>Latest operational events</p>
        </div>
      </header>
      <div className="timeline">
        {timelineEvents.map(({ color, title, description }) => (
          <p key={title}>
            <i className={`timeline-dot timeline-dot--${color}`} />
            <strong>{title}</strong>
            <span>{description}</span>
          </p>
        ))}
      </div>
    </article>
  );
};
