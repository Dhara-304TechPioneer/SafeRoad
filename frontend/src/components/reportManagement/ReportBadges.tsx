// Compact severity and status indicators reused by report cards and details.
import type { Severity } from '../../types/Report';
import type { ReportStatus } from '../../types/reportManagement';
export const StatusBadge = ({ status }: { status: ReportStatus }) => <span className={`report-badge report-badge--${status.toLowerCase().replace(' ', '-')}`}>{status}</span>;
export const SeverityBadge = ({ severity }: { severity: Severity }) => <span className={`severity-badge severity-badge--${severity.toLowerCase()}`}>{severity}</span>;
