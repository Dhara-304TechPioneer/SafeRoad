import { useMemo } from 'react';
import type { MapReport } from '../../types/map';
import { MapMarker } from './MapMarker';

interface MapPlaceholderProps {
  reports: MapReport[];
  selectedReport: MapReport | null;
  zoom: number;
  heatmap: boolean;
  onSelect: (report: MapReport) => void;
}

const mapBounds = {
  minLatitude: 21,
  maxLatitude: 23.5,
  minLongitude: 69.4,
  maxLongitude: 73.4,
};

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));
const toPercent = (value: number, min: number, max: number) => ((value - min) / (max - min)) * 100;

export const MapPlaceholder = ({ reports, selectedReport, zoom, heatmap, onSelect }: MapPlaceholderProps) => {
  const points = useMemo(
    () =>
      reports.map((report) => ({
        report,
        left: clamp(toPercent(report.longitude, mapBounds.minLongitude, mapBounds.maxLongitude), 0, 100),
        top: clamp(100 - toPercent(report.latitude, mapBounds.minLatitude, mapBounds.maxLatitude), 0, 100),
      })),
    [reports],
  );

  return (
    <section className={`map-placeholder map-placeholder--zoom-${zoom} ${heatmap ? 'map-placeholder--heatmap' : ''}`} aria-label="Interactive road safety map">
      <div className="map-placeholder__roads" />
      <div className="map-placeholder__water" />
      <div className="map-placeholder__heat" />
      <div className="map-placeholder__legend">Live incidents across Gujarat</div>
      <div className="map-placeholder__markers">
        {points.map(({ report, left, top }) => (
          <MapMarker key={report.id} report={report} isSelected={selectedReport?.id === report.id} onSelect={onSelect} position={{ left, top }} />
        ))}
      </div>
    </section>
  );
};
