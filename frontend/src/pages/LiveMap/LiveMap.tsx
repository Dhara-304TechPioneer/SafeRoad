import { useEffect, useMemo, useRef, useState } from 'react';
import { InteractiveMap, MapControls, MapFilters, MapKpiCards, MapLegend, MapSidebar, MapToolbar, RecentMapReports } from '../../components/map';
import { getLatestReports, getMapReports } from '../../services/mapService';
import { matchesMapFilters, sortMapReports, uniqueMapValues } from '../../services/mapUtils';
import { useTransientNotice } from '../../hooks/useTransientNotice';
import type { MapFiltersState, MapReport, MapSort } from '../../types/map';
import './LiveMap.css';

const defaultFilters: MapFiltersState = {
  search: '',
  severity: 'All',
  status: 'All',
  reporter: 'All',
  date: 'All',
  city: 'All',
  vehicleType: 'All',
  verificationStatus: 'All',
  department: 'All',
};

export const LiveMap = () => {
  const [reports, setReports] = useState<MapReport[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<MapFiltersState>(defaultFilters);
  const [selectedReport, setSelectedReport] = useState<MapReport | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [heatmap, setHeatmap] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [sort, setSort] = useState<MapSort>('Newest');
  const { notice, showNotice } = useTransientNotice(3500);
  const detailsRef = useRef<HTMLDivElement>(null);

  const loadReports = () => {
    setIsRefreshing(true);
    setError(null);
    getMapReports()
      .then((data) => {
        setReports(data);
      })
      .catch((err) => {
        setError(err?.message || 'Failed to connect to backend server.');
      })
      .finally(() => {
        setIsRefreshing(false);
        setIsLoading(false);
      });
  };

  useEffect(() => {
    void loadReports();
  }, []);

  const filteredReports = useMemo(
    () => sortMapReports(reports.filter((report) => matchesMapFilters(report, filters)), sort),
    [reports, filters, sort],
  );

  const selectReport = (report: MapReport) => {
    setSelectedReport(report);
    window.setTimeout(() => detailsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' }), 0);
  };

  return (
    <main className="live-map-page">
      <MapToolbar
        search={filters.search}
        reportCount={filteredReports.length}
        sort={sort}
        isRefreshing={isRefreshing}
        onSearchChange={(search) => setFilters({ ...filters, search })}
        onSortChange={setSort}
        onRefresh={loadReports}
        onExport={() => showNotice('Export functionality will be available after backend integration.')}
      />
      <MapKpiCards reports={reports} />
      <div className="live-map-layout">
        <MapFilters
          filters={filters}
          reporters={uniqueMapValues(reports, 'reporter')}
          cities={uniqueMapValues(reports, 'city')}
          vehicleTypes={uniqueMapValues(reports, 'vehicleType')}
          departments={uniqueMapValues(reports, 'department')}
          onChange={setFilters}
          onReset={() => setFilters(defaultFilters)}
        />
        <div className="live-map-layout__centre">
          <InteractiveMap
            reports={filteredReports}
            selectedReport={selectedReport}
            zoom={zoom}
            heatmap={heatmap}
            isLoading={isLoading}
            error={error}
            onSelect={selectReport}
          />
          <MapControls
            heatmap={heatmap}
            onZoomIn={() => setZoom((value) => Math.min(value + 1, 2))}
            onZoomOut={() => setZoom((value) => Math.max(value - 1, 0))}
            onReset={() => setZoom(1)}
            onToggleHeatmap={() => setHeatmap((value) => !value)}
          />
          <MapLegend />
        </div>
        <div ref={detailsRef} className="live-map-layout__details">
          <MapSidebar report={selectedReport} onClose={() => setSelectedReport(null)} />
          <RecentMapReports reports={getLatestReports(filteredReports, 8)} selectedId={selectedReport?.id} onSelect={selectReport} />
        </div>
      </div>
      {notice ? <p className="map-notice">{notice}</p> : null}
    </main>
  );
};