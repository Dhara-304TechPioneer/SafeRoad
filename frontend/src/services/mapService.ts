import { getBackendMapReports, type BackendMapReport } from './reportService';
import type { MapReport, MapSeverity, MapStatus } from '../types/map';

const mapSeverity = (severity?: string): MapSeverity => {
  if (!severity) return 'Medium';
  switch (severity.toUpperCase()) {
    case 'LOW':
      return 'Low';
    case 'MEDIUM':
      return 'Medium';
    case 'HIGH':
      return 'High';
    case 'CRITICAL':
      return 'Critical';
    default:
      return 'Medium';
  }
};

const mapStatus = (status?: string): MapStatus => {
  if (!status) return 'New';
  switch (status.toUpperCase()) {
    case 'REPORTED':
      return 'New';
    case 'AI_VERIFIED':
    case 'NEEDS_REVIEW':
      return 'Verified';
    case 'OFFICER_ASSIGNED':
    case 'ASSIGNED':
      return 'Assigned';
    case 'IN_PROGRESS':
      return 'In Progress';
    case 'FIXED':
    case 'RESOLVED':
      return 'Resolved';
    default:
      return 'New';
  }
};

export const getMapReports = async (): Promise<MapReport[]> => {
  const backendReports = await getBackendMapReports();
  return backendReports.map((r: BackendMapReport) => {
    const severity = mapSeverity(r.severity);
    const status = mapStatus(r.status);
    const dateStr = r.createdAt ? new Date(r.createdAt).toISOString() : new Date().toISOString();

    return {
      id: r.id,
      title: r.title || 'Pothole Report',
      latitude: Number(r.latitude),
      longitude: Number(r.longitude),
      severity,
      status,
      reporter: 'Citizen User',
      address: 'Gujarat',
      description: r.title || 'Road incident report',
      createdAt: dateStr,
      updatedAt: dateStr,
      image: 'Evidence image pending upload',
      vehicleType: 'Car',
      verificationStatus: r.status === 'REPORTED' ? 'Pending' : 'Officer Verified',
      city: 'Gujarat',
      incidentType: 'Pothole',
      priority: severity === 'Critical' ? 'Urgent' : severity === 'High' ? 'Priority' : 'Standard',
      estimatedRepairCost: '₹10,000',
      estimatedRepairTime: severity === 'Critical' ? '4–8 hours' : '1–2 days',
      assignedOfficer: 'Assigned Team',
      department: 'Road Maintenance',
      citizenReports: 1,
      aiConfidence: 85,
      detectionMethod: 'Citizen mobile report',
      imageTimestamp: dateStr,
      actionHistory: [{ status: 'Reported', date: dateStr }],
    };
  });
};

export const getLatestReports = (reports: MapReport[], limit = 6): MapReport[] =>
  [...reports]
    .sort((first, second) => Date.parse(second.createdAt) - Date.parse(first.createdAt))
    .slice(0, limit);

export const formatReportDate = (date: string): string =>
  new Intl.DateTimeFormat('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }).format(new Date(date));

