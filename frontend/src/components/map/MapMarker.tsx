import { FiAlertOctagon, FiAlertTriangle, FiCloudRain, FiSettings, FiSlash, FiTool } from 'react-icons/fi';
import type { IconType } from 'react-icons';
import type { MapReport } from '../../types/map';
interface MapMarkerProps { report: MapReport; index: number; isSelected: boolean; onSelect: (report: MapReport) => void; }
const markerIcons: Record<MapReport['incidentType'], IconType> = { Pothole: FiAlertTriangle, 'Road Crack': FiSlash, Waterlogging: FiCloudRain, Construction: FiSettings, Accident: FiAlertOctagon, 'Road Block': FiTool };
export const MapMarker = ({ report, index, isSelected, onSelect }: MapMarkerProps) => { const Icon = markerIcons[report.incidentType]; return <button type="button" className={`map-marker map-marker--${report.severity.toLowerCase()} map-marker--point-${String(index + 1).padStart(2, '0')} ${isSelected ? 'map-marker--selected' : ''}`} onClick={() => onSelect(report)} aria-label={`Open ${report.title}`}><Icon /><span className="map-marker__tooltip">{report.title}</span></button>; };
