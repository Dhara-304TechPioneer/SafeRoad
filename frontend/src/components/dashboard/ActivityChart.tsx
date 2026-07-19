// Weekly report volume visual placeholder for a future chart integration.
import { weekDays, weeklyReportActivity } from '../../data/dashboardData';

export const ActivityChart = () => {
  return (
    <article className="panel chart-panel">
      <header>
        <div>
          <h2>Report activity</h2>
          <p>Weekly incoming reports</p>
        </div>
        <button className="select-button">This week</button>
      </header>
      <div className="chart-placeholder">
        {weeklyReportActivity.map((height, index) => (
          <div key={weekDays[index]} style={{ height: `${height}%` }}>
            <span>{weekDays[index]}</span>
          </div>
        ))}
      </div>
    </article>
  );
};
