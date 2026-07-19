// High-level road safety metrics displayed at the top of the dashboard.
import { dashboardMetrics } from '../../data/dashboardData';

export const KPISection = () => {
  return (
    <section className="kpi-grid" aria-label="Road safety metrics">
      {dashboardMetrics.map(({ label, value, change, icon: Icon, color }) => (
        <article key={label} className={`kpi-card kpi-card--${color}`}>
          <div>
            <p>{label}</p>
            <strong>{value}</strong>
            <small>{change} <em>vs. last month</em></small>
          </div>
          <span className="kpi-icon"><Icon /></span>
          <i />
        </article>
      ))}
    </section>
  );
};
