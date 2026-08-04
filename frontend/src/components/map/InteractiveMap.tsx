import { useEffect } from 'react';
import { MapContainer, Marker, Popup, TileLayer, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import type { MapReport, MapSeverity } from '../../types/map';

interface InteractiveMapProps {
  reports?: MapReport[];
  selectedReport?: MapReport | null;
  zoom?: number;
  heatmap?: boolean;
  isLoading?: boolean;
  error?: string | null;
  onSelect?: (report: MapReport) => void;
}

const DEFAULT_CENTER: [number, number] = [22.2587, 71.1924]; // Gujarat center
const DEFAULT_ZOOM = 7;

const getSeverityColor = (severity: MapSeverity): string => {
  switch (severity) {
    case 'Critical':
      return '#ef4444';
    case 'High':
      return '#f97316';
    case 'Medium':
      return '#eab308';
    case 'Low':
    default:
      return '#22c55e';
  }
};

const createCustomMarkerIcon = (severity: MapSeverity, isSelected: boolean) => {
  const color = getSeverityColor(severity);
  const size = isSelected ? 34 : 26;
  const pulseClass = isSelected ? 'leaflet-marker-pulse' : '';

  const html = `
    <div class="custom-map-pin ${pulseClass}" style="
      width: ${size}px;
      height: ${size}px;
      background-color: ${color};
      border: 2px solid #ffffff;
      border-radius: 50% 50% 50% 0;
      transform: rotate(-45deg);
      box-shadow: 0 3px 8px rgba(15, 23, 42, 0.35);
      display: flex;
      align-items: center;
      justify-content: center;
    ">
      <div style="
        width: 8px;
        height: 8px;
        background: #ffffff;
        border-radius: 50%;
        transform: rotate(45deg);
      "></div>
    </div>
  `;

  return L.divIcon({
    className: 'custom-leaflet-marker-wrapper',
    html,
    iconSize: [size, size],
    iconAnchor: [size / 2, size],
    popupAnchor: [0, -size],
  });
};

const MapResizeHandler = () => {
  const map = useMap();
  useEffect(() => {
    const timer = setTimeout(() => {
      map.invalidateSize();
    }, 150);
    return () => clearTimeout(timer);
  }, [map]);
  return null;
};

const MapViewController = ({
  selectedReport,
  zoomOffset,
}: {
  selectedReport?: MapReport | null;
  zoomOffset?: number;
}) => {
  const map = useMap();

  useEffect(() => {
    if (selectedReport) {
      map.flyTo([selectedReport.latitude, selectedReport.longitude], 13, {
        duration: 1.2,
      });
    }
  }, [map, selectedReport]);

  useEffect(() => {
    if (typeof zoomOffset === 'number') {
      const targetZoom = DEFAULT_ZOOM + (zoomOffset - 1);
      map.setZoom(targetZoom);
    }
  }, [map, zoomOffset]);

  return null;
};

const formatReportDateDisplay = (dateStr?: string): string => {
  if (!dateStr) return 'N/A';
  try {
    return new Intl.DateTimeFormat('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    }).format(new Date(dateStr));
  } catch {
    return dateStr;
  }
};

export const InteractiveMap = ({
  reports = [],
  selectedReport,
  zoom = 1,
  heatmap = false,
  isLoading = false,
  error = null,
  onSelect,
}: InteractiveMapProps) => {
  return (
    <section className={`interactive-map-container ${heatmap ? 'interactive-map--heatmap' : ''}`} aria-label="Interactive OpenStreetMap road safety map">
      <div className="map-placeholder__legend">Live incidents across Gujarat (OpenStreetMap)</div>

      {isLoading ? (
        <div className="map-overlay-banner map-overlay-banner--loading">
          Loading live incident markers...
        </div>
      ) : null}

      {error ? (
        <div className="map-overlay-banner map-overlay-banner--error">
          Error loading map data: {error}
        </div>
      ) : null}

      {!isLoading && !error && reports.length === 0 ? (
        <div className="map-overlay-banner map-overlay-banner--empty">
          No road reports found for the selected view.
        </div>
      ) : null}

      <MapContainer
        center={DEFAULT_CENTER}
        zoom={DEFAULT_ZOOM}
        zoomControl={false}
        scrollWheelZoom={true}
        className="leaflet-map-root"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <MapResizeHandler />
        <MapViewController selectedReport={selectedReport} zoomOffset={zoom} />
        {reports.map((report) => {
          const isSelected = selectedReport?.id === report.id;
          const markerIcon = createCustomMarkerIcon(report.severity, isSelected);

          return (
            <Marker
              key={report.id}
              position={[report.latitude, report.longitude]}
              icon={markerIcon}
              eventHandlers={{
                click: () => {
                  if (onSelect) {
                    onSelect(report);
                  }
                },
              }}
            >
              <Popup className="safe-road-map-popup">
                <div className="map-popup-content">
                  <h4 className="map-popup-title">{report.title}</h4>
                  <div className="map-popup-badges">
                    <span className={`severity-badge severity-badge--${report.severity.toLowerCase()}`}>
                      {report.severity}
                    </span>
                    <span className="status-badge">
                      {report.status}
                    </span>
                  </div>
                  <p className="map-popup-date">
                    <strong>Reported:</strong> {formatReportDateDisplay(report.createdAt)}
                  </p>
                  <p className="map-popup-coords">
                    <strong>Coordinates:</strong> {report.latitude.toFixed(4)}, {report.longitude.toFixed(4)}
                  </p>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </section>
  );
};

