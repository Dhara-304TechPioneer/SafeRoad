import { mapReports } from '../data/mapData';
import { getMyReports, getServerUrl, mapBackendSeverityToFrontend, mapBackendStatusToFrontend } from './reportService';
import type { MapReport } from '../types/map';

export const getMapReports = async (): Promise<MapReport[]> => {
  try {
    const res = await getMyReports();
    const liveReports = res.items || [];
    if (liveReports && liveReports.length > 0) {

      return liveReports.map((r: any) => ({
        id: r.id,
        title: r.title || 'Pothole Report',
        severity: mapBackendSeverityToFrontend(r.severity || 'MEDIUM'),
        status: mapBackendStatusToFrontend(r.status || 'REPORTED'),
        reporter: r.reporterName || 'Citizen User',
        createdAt: r.createdAt || new Date().toISOString(),
        location: {
          roadName: r.address || 'Local Street',
          area: 'Sector 1',
          city: 'Ahmedabad',
          latitude: Number(r.latitude || 23.0225),
          longitude: Number(r.longitude || 72.5714),
        },
        vehicleType: 'Car',
        verificationStatus: r.status === 'REPORTED' ? 'Pending' : 'Verified',
        department: r.departmentName || 'Road Maintenance',
        assignedTo: r.officerName,
        aiVerified: Boolean(r.aiResult),
        imageUrl: r.imageUrl ? getServerUrl(r.imageUrl) : undefined,
        description: r.description || '',
      }));
    }
  } catch (error) {
    console.warn('[MapService] Could not fetch live map reports from backend API, falling back to static map data:', error);
  }
  return mapReports;
};

export const getLatestReports = (reports: MapReport[], limit = 6): MapReport[] =>
  [...reports]
    .sort((first, second) => Date.parse(second.createdAt) - Date.parse(first.createdAt))
    .slice(0, limit);

export const formatReportDate = (date: string): string =>
  new Intl.DateTimeFormat('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }).format(new Date(date));
