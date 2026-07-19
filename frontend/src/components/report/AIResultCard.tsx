// Placeholder result card for future AI detection output.
import type { AIResult } from '../../types/Report';
export const AIResultCard = ({ result }: { result: AIResult }) => <div className="report-card ai-result"><h2>AI road damage analysis</h2><div className="ai-box">Detection area</div><dl><div><dt>Confidence</dt><dd>{result.confidence}</dd></div><div><dt>Severity</dt><dd>{result.severity}</dd></div><div><dt>Damage type</dt><dd>{result.damageType}</dd></div><div><dt>Repair priority</dt><dd>{result.priority}</dd></div></dl></div>;
