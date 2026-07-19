// Summary card linking a citizen report to its full detail view.
import { Link } from 'react-router-dom';
import type { ManagedReport } from '../../types/reportManagement';
import { SeverityBadge, StatusBadge } from './ReportBadges';
export const ReportCard = ({ report }: { report: ManagedReport }) => <Link className="managed-report-card" to={`/report/${report.id}`}><div className="report-image-placeholder">{report.imageLabel}</div><div className="managed-report-card__body"><div><strong>{report.id}</strong><span>{report.date}</span></div><p>{report.location}</p><div className="report-badges"><SeverityBadge severity={report.severity} /><StatusBadge status={report.status} />{report.aiVerified && <span className="ai-badge">AI verified</span>}<span className="priority-badge">{report.priority}</span></div></div></Link>;
