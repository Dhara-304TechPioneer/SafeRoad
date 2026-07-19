import { mapReports as fallbackReports } from '../data/mapData';
import type { MapReport, MapSeverity, MapStatus } from '../types/map';

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8000/api').replace(/\/$/, '');

const normalizeSeverity = (value?: string): MapSeverity => {
  switch (value?.toUpperCase()) {
    case 'CRITICAL':
      return 'Critical';
    case 'HIGH':
      return 'High';
    case 'LOW':
      return 'Low';
    default:
      return 'Medium';
  }
};

const normalizeStatus = (value?: string): MapStatus => {
  switch (value?.toUpperCase()) {
    case 'REPORTED':
      return 'New';
    case 'AI_VERIFIED':
    case 'OFFICER_VERIFIED':
      return 'Verified';
    case 'ASSIGNED':
      return 'Assigned';
    case 'IN_PROGRESS':
      return 'In Progress';
    case 'RESOLVED':
    case 'CLOSED':
      return 'Resolved';
    default:
      return 'New';
  }
};

const mapBackendReport = (item: Record<string, unknown>, fallback: MapReport): MapReport => {
  const severity = normalizeSeverity(String((item.severity as string | undefined) ?? fallback.severity));
  const status = normalizeStatus(String((item.status as string | undefined) ?? fallback.status));
  const address = String((item.address as string | undefined) ?? fallback.address);
  const createdAt = String((item.created_at as string | undefined) ?? fallback.createdAt);
  const updatedAt = String((item.updated_at as string | undefined) ?? fallback.updatedAt);
  const latitude = Number((item.latitude as number | undefined) ?? fallback.latitude);
  const longitude = Number((item.longitude as number | undefined) ?? fallback.longitude);

  return {
    ...fallback,
    id: String((item.id as string | undefined) ?? fallback.id),
    title: String((item.title as string | undefined) ?? fallback.title),
    latitude,
    longitude,
    severity,
    status,
    reporter: (item.reported_by ? `User #${item.reported_by}` : fallback.reporter) as string,
    address,
    description: String((item.description as string | undefined) ?? fallback.description),
    createdAt,
    updatedAt,
    image: String((item.image_url as string | undefined) ?? fallback.image),
    city: address.split(', ').at(-1) ?? fallback.city,
    assignedOfficer: (item.assigned_to ? `Officer #${item.assigned_to}` : fallback.assignedOfficer) as string,
    imageTimestamp: createdAt,
  };
};

export const getMapReports = async (): Promise<MapReport[]> => {
  const token = localStorage.getItem('access_token');

  try {
    const response = await fetch(`${API_BASE_URL}/reports?size=100`, {
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    });

    if (!response.ok) {
      throw new Error('Unable to load reports');
    }

    const payload = (await response.json()) as { items?: Record<string, unknown>[] };
    const items = Array.isArray(payload.items) ? payload.items : [];

    return items.length ? items.map((item) => mapBackendReport(item, fallbackReports[0])) : fallbackReports;
  } catch (error) {
    console.warn('Using fallback map data because the reports API is unavailable.', error);
    return fallbackReports;
  }
};

export const getLatestReports = (reports: MapReport[], limit = 6): MapReport[] =>
  [...reports]
    .sort((first, second) => Date.parse(second.createdAt) - Date.parse(first.createdAt))
    .slice(0, limit);

export const formatReportDate = (date: string): string =>
  new Intl.DateTimeFormat('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }).format(new Date(date));
