import { FiCheckCircle, FiClock } from 'react-icons/fi';
import type { ActionHistoryEvent } from '../../types/map';
import { formatReportDate } from '../../services/mapService';
export const ActionTimeline = ({ events }: { events: ActionHistoryEvent[] }) => <section className="action-timeline"><h3>Action history</h3><ol>{events.map((event, index) => <li key={`${event.status}-${index}`}><i>{index === events.length - 1 ? <FiCheckCircle /> : <FiClock />}</i><div><strong>{event.status}</strong><time>{formatReportDate(event.date)}</time></div></li>)}</ol></section>;
