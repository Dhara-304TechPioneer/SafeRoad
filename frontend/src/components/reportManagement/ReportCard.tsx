// Summary card linking a citizen report to its full detail view.
import { Link } from 'react-router-dom';
import type { ManagedReport } from '../../types/reportManagement';
import { SeverityBadge, StatusBadge } from './ReportBadges';
import { getServerUrl } from '../../services/reportService';

export const ReportCard = ({ report }: { report: ManagedReport }) => (
  <Link className="managed-report-card" to={`/report/${report.id}`}>
    <div className="report-image-placeholder" style={{ overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      {report.image_url ? (
        <img 
          src={getServerUrl(report.image_url)} 
          alt={report.imageLabel} 
          style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
        />
      ) : (
        <span>{report.imageLabel}</span>
      )}
    </div>
    <div className="managed-report-card__body">
      <div>
        <strong>{report.id}</strong>
        <span>{report.date}</span>
      </div>
      <p>{report.location}</p>
      <div className="report-badges">
        <SeverityBadge severity={report.severity} />
        <StatusBadge status={report.status} />
        {report.aiVerified && <span className="ai-badge">AI verified</span>}
        <span className="priority-badge">{report.priority}</span>
      </div>
    </div>
  </Link>
);

