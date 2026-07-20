// Full citizen report view with backend integration and workflow status updates.
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getReportById, updateReportStatus } from '../../services/reportManagementService';
import { CommentSection } from '../../components/reportManagement/CommentSection';
import { ReportTimeline } from '../../components/reportManagement/ReportTimeline';
import { SeverityBadge, StatusBadge } from '../../components/reportManagement/ReportBadges';
import { getServerUrl } from '../../services/reportService';
import { useAuth } from '../../context/AuthContext';
import type { ManagedReport } from '../../types/reportManagement';
import './ReportDetails.css';

export const ReportDetails = () => {
  const { reportId } = useParams();
  const { currentUser } = useAuth();
  const [report, setReport] = useState<ManagedReport | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [statusRemarks, setStatusRemarks] = useState('');
  const [updating, setUpdating] = useState(false);

  const isOfficer = currentUser?.role === 'municipal_officer' || currentUser?.role === 'admin';

  const loadReport = () => {
    if (!reportId) return;
    setLoading(true);
    setError(null);
    getReportById(reportId)
      .then((data) => {
        setReport(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message || 'Failed to load report');
        setLoading(false);
      });
  };

  useEffect(() => {
    loadReport();
  }, [reportId]);

  const handleStatusUpdate = async (nextStatus: string) => {
    if (!report) return;
    setUpdating(true);
    try {
      await updateReportStatus(report.id, nextStatus, statusRemarks);
      setStatusRemarks('');
      // Reload report
      const updated = await getReportById(report.id);
      setReport(updated);
    } catch (e: any) {
      alert(e.message || 'Failed to update workflow status. Make sure the transition is valid.');
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <main className="report-details">
        <header>
          <h1>Report details</h1>
        </header>
        <div style={{ textAlign: 'center', padding: '50px 0', color: 'var(--muted)' }}>
          <p>Loading report details...</p>
        </div>
      </main>
    );
  }

  if (error || !report) {
    return (
      <main className="report-details">
        <header>
          <h1>Report details</h1>
        </header>
        <div style={{ textAlign: 'center', padding: '50px 0', color: 'var(--error)' }}>
          <p>Error: {error || 'Report not found'}</p>
        </div>
      </main>
    );
  }

  const statusOptions = [
    { label: 'Reported', value: 'REPORTED' },
    { label: 'AI Verified', value: 'AI_VERIFIED' },
    { label: 'Officer Verified', value: 'OFFICER_VERIFIED' },
    { label: 'Repair Assigned', value: 'ASSIGNED' },
    { label: 'Under Repair', value: 'IN_PROGRESS' },
    { label: 'Completed', value: 'CLOSED' }
  ];

  return (
    <main className="report-details">
      <header>
        <p className="eyebrow">REPORT {report.id}</p>
        <h1>Report details</h1>
        <div className="report-badges">
          <SeverityBadge severity={report.severity} />
          <StatusBadge status={report.status} />
        </div>
      </header>
      <section className="details-grid">
        <div>
          <section className="detail-section">
            <div className="detail-image" style={{ overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {report.image_url ? (
                <img 
                  src={getServerUrl(report.image_url)} 
                  alt={report.imageLabel} 
                  style={{ maxWidth: '100%', maxHeight: '220px', borderRadius: '9px', objectFit: 'cover' }} 
                />
              ) : (
                <span>{report.imageLabel}</span>
              )}
            </div>
            <h2>{report.location}</h2>
            <p>{report.description}</p>
            <dl>
              <div>
                <dt>Road type</dt>
                <dd>{report.roadType}</dd>
              </div>
              <div>
                <dt>Traffic level</dt>
                <dd>{report.traffic}</dd>
              </div>
              <div>
                <dt>Submitted</dt>
                <dd>{report.date}</dd>
              </div>
              <div>
                <dt>AI prediction</dt>
                <dd>{report.aiVerified ? 'Verified pothole' : 'Pending verification'}</dd>
              </div>
            </dl>
          </section>
          
          <section className="detail-section">
            <h2>Attachments</h2>
            <div className="attachment-grid">
              <div style={{ overflow: 'hidden', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '10px' }}>
                {report.image_url ? (
                  <img 
                    src={getServerUrl(report.image_url)} 
                    alt="Original uploaded" 
                    style={{ maxWidth: '100%', maxHeight: '90px', borderRadius: '4px', objectFit: 'contain' }} 
                  />
                ) : (
                  <span>Original uploaded image</span>
                )}
              </div>
              <div>Future repair image</div>
            </div>
          </section>
          
          {reportId && <CommentSection reportId={reportId} />}
        </div>
        
        <aside>
          <div className="detail-section">
            <h2>Status timeline</h2>
            <ReportTimeline status={report.status} />
          </div>

          {isOfficer && (
            <div className="detail-section" style={{ marginTop: '20px' }}>
              <h3>Update status (Officer)</h3>
              <div style={{ display: 'grid', gap: '10px', marginTop: '10px' }}>
                <textarea 
                  value={statusRemarks} 
                  onChange={(e) => setStatusRemarks(e.target.value)} 
                  placeholder="Add status change remarks..." 
                  style={{ width: '100%', minHeight: '60px', padding: '8px', borderRadius: '6px', border: '1px solid var(--border)', background: 'var(--surface-soft)', color: 'var(--text)' }}
                />
                <select 
                  onChange={(e) => {
                    if (e.target.value) {
                      handleStatusUpdate(e.target.value);
                      e.target.value = '';
                    }
                  }}
                  disabled={updating}
                  style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid var(--border)', background: 'var(--surface)', color: 'var(--text)' }}
                >
                  <option value="">Select next status...</option>
                  {statusOptions.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>
            </div>
          )}
        </aside>
      </section>
    </main>
  );
};

