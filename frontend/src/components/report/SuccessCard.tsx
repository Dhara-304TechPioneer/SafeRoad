// Confirmation card for the frontend-only report submission flow.
import { Link } from 'react-router-dom';
import { mockReferenceId } from '../../data/reportWizard';
export const SuccessCard = () => <section className="report-card success-card"><div className="success-mark">✓</div><h1>Report Submitted Successfully</h1><strong>{mockReferenceId}</strong><p>Your report has been submitted. Municipal authorities will review it shortly.</p><Link className="button-primary" to="/dashboard">Back to Dashboard</Link></section>;
