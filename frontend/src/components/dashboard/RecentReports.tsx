// Latest reported issues with their current static status labels.
import { recentReports } from '../../data/dashboardData';

const statusClassName = (status: string) => status.toLowerCase().replace(' ', '-');

export const RecentReports = () => {
  return (
    <aside className="panel recent-panel">
      <header>
        <div>
          <h2>Recent reports</h2>
          <p>Latest field activity</p>
        </div>
        <button className="text-button">View all</button>
      </header>
      <div className="report-list">
        {recentReports.map(({ place, status, age }) => {
          const statusClass = statusClassName(status);
          return (
            <article className="report-item" key={place}>
              <span className={`report-dot report-dot--${statusClass}`} />
              <div>
                <strong>{place}</strong>
                <small>{age}</small>
              </div>
              <b className={`status status--${statusClass}`}>{status}</b>
            </article>
          );
        })}
      </div>
    </aside>
  );
};
