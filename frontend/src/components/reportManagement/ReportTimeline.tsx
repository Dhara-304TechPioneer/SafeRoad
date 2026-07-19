// Vertical status timeline for a report's repair lifecycle.
import type { ReportStatus } from '../../types/reportManagement';
const stages: ReportStatus[] = ['Reported', 'AI Verified', 'Officer Verified', 'Repair Assigned', 'Under Repair', 'Completed'];
export const ReportTimeline = ({ status }: { status: ReportStatus }) => { const currentIndex = stages.indexOf(status); return <ol className="report-timeline">{stages.map((stage, index) => <li key={stage} className={index <= currentIndex ? 'is-complete' : ''}><i />{stage}</li>)}</ol>; };
