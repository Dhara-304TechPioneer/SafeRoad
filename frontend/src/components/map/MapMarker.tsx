import { FiAlertOctagon, FiAlertTriangle, FiCloudRain, FiSettings, FiSlash, FiTool } from 'react-icons/fi';
import type { IconType } from 'react-icons';
import type { MapReport } from '../../types/map';

interface MapMarkerProps {
  report: MapReport;
  isSelected: boolean;
  onSelect: (report: MapReport) => void;
  position: { left: number; top: number };
}

const markerIcons: Record<MapReport['incidentType'], IconType> = {
  Pothole: FiAlertTriangle,
  'Road Crack': FiSlash,
  Waterlogging: FiCloudRain,
  Construction: FiSettings,
  Accident: FiAlertOctagon,
  'Road Block': FiTool,
};

export const MapMarker = ({ report, isSelected, onSelect, position }: MapMarkerProps) => {
  const Icon = markerIcons[report.incidentType];

  return (
    <button
      type="button"
      className={`map-marker map-marker--${report.severity.toLowerCase()} ${isSelected ? 'map-marker--selected' : ''}`}
      style={{ left: `${position.left}%`, top: `${position.top}%` }}
      onClick={() => onSelect(report)}
      aria-label={`Open ${report.title}`}
    >
      <Icon />
      <span className="map-marker__tooltip">{report.title}</span>
    </button>
  );
};
