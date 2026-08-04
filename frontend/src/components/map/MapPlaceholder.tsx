import type { MapReport } from '../../types/map';
import { InteractiveMap } from './InteractiveMap';

interface MapPlaceholderProps {
  reports: MapReport[];
  selectedReport: MapReport | null;
  zoom: number;
  heatmap: boolean;
  onSelect: (report: MapReport) => void;
}

export const MapPlaceholder = ({ reports, selectedReport, zoom, heatmap, onSelect }: MapPlaceholderProps) => {
  return (
    <InteractiveMap
      reports={reports}
      selectedReport={selectedReport}
      zoom={zoom}
      heatmap={heatmap}
      onSelect={onSelect}
    />
  );
};
