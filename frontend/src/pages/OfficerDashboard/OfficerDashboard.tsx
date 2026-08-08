import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { FiAlertTriangle, FiCheckCircle, FiClipboard, FiClock, FiMapPin, FiShield } from 'react-icons/fi';
import { authenticatedRequestJson } from '../../services/authService';
import { mapBackendStatusToFrontend } from '../../services/reportService';
import type { ReportStatus } from '../../types/reportManagement';

interface OfficerStats {
  totalAssignedReports: number;
  pendingVerification: number;
  aiVerifiedReports: number;
  reportsNeedsReview: number;
  inRepair: number;
  completedReports: number;
}

interface OfficerReportSummary {
  id: string;
  title: string;
  city: string;
  status: string;
  severity: string;
  createdAt: string;
}

export const OfficerDashboard = () => {
  const [stats, setStats] = useState<OfficerStats | null>(null);
  const [reports, setReports] = useState<OfficerReportSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        const [statsResponse, reportsResponse] = await Promise.all([
          authenticatedRequestJson<{ status: string; data: OfficerStats }>('/analytics/dashboard'),
          authenticatedRequestJson<{ status: string; data: OfficerReportSummary[] }>('/reports?limit=6'),
        ]);

        setStats(statsResponse.data);
        setReports(reportsResponse.data ?? []);
      } catch (err: any) {
        setError(err.message || 'Unable to load officer dashboard.');
      } finally {
        setLoading(false);
      }
    };

    void load();
  }, []);

  const statCards = useMemo(() => [
    { label: 'Assigned reports', value: stats?.totalAssignedReports ?? 0, icon: FiClipboard },
    { label: 'Pending verification', value: stats?.pendingVerification ?? 0, icon: FiClock },
    { label: 'AI verified', value: stats?.aiVerifiedReports ?? 0, icon: FiShield },
    { label: 'Needs review', value: stats?.reportsNeedsReview ?? 0, icon: FiAlertTriangle },
    { label: 'In repair', value: stats?.inRepair ?? 0, icon: FiMapPin },
    { label: 'Completed', value: stats?.completedReports ?? 0, icon: FiCheckCircle },
  ], [stats]);

  if (loading) {
    return <main style={{ padding: '24px' }}>Loading officer dashboard…</main>;
  }

  return (
    <main style={{ padding: '24px', display: 'grid', gap: '24px' }}>
      <header>
        <p className="eyebrow">OPERATIONS</p>
        <h1>Officer Dashboard</h1>
        <p style={{ color: 'var(--muted)', marginTop: '6px' }}>Monitor reports that require verification, review, or repair activity.</p>
      </header>

      {error ? <div className="auth-error-banner">{error}</div> : null}

      <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px' }}>
        {statCards.map(({ label, value, icon: Icon }) => (
          <article key={label} style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '16px', padding: '18px', display: 'grid', gap: '10px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ color: 'var(--muted)', fontSize: '13px' }}>{label}</span>
              <Icon size={16} />
            </div>
            <strong style={{ fontSize: '24px' }}>{value}</strong>
          </article>
        ))}
      </section>

      <section style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '16px', padding: '18px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
          <h2 style={{ margin: 0 }}>Recent reports</h2>
          <Link to="/my-reports" style={{ color: 'var(--primary)' }}>View all</Link>
        </div>
        {reports.length === 0 ? <p>No assigned reports available yet.</p> : (
          <div style={{ display: 'grid', gap: '10px' }}>
            {reports.map((report) => (
              <div key={report.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: '1px solid var(--border)' }}>
                <div>
                  <strong style={{ display: 'block' }}>{report.title}</strong>
                  <span style={{ color: 'var(--muted)', fontSize: '13px' }}>{report.city} • {new Date(report.createdAt).toLocaleDateString()}</span>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ color: 'var(--muted)', fontSize: '13px' }}>{mapBackendStatusToFrontend(report.status) as ReportStatus}</div>
                  <Link to={`/report/${report.id}`} style={{ color: 'var(--primary)', fontSize: '13px' }}>Open</Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
};
