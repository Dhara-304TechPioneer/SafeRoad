// Dashboard page composition containing only road-safety dashboard content.
import {
  ActivityChart,
  KPISection,
  LiveMapCard,
  QuickActions,
  RecentReports,
  Timeline,
  WelcomeSection,
} from '../../components/dashboard';

import './Dashboard.css';

export const Dashboard = () => {
  return (
    <main className="dashboard">
      <WelcomeSection />
      <QuickActions />
      <KPISection />

      <section className="dashboard-grid">
        <LiveMapCard />
        <RecentReports />
      </section>

      <section className="dashboard-grid dashboard-grid--bottom">
        <ActivityChart />
        <Timeline />
      </section>
    </main>
  );
};
