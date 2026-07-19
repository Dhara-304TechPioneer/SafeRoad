import { mapReports } from '../data/mapData';
import type { MapReport } from '../types/map';

/** API-ready boundary for the future map provider. */
export const getMapReports = (): Promise<MapReport[]> => Promise.resolve(mapReports);

export const getLatestReports = (reports: MapReport[], limit = 6): MapReport[] =>
  [...reports]
    .sort((first, second) => Date.parse(second.createdAt) - Date.parse(first.createdAt))
    .slice(0, limit);

export const formatReportDate = (date: string): string =>
  new Intl.DateTimeFormat('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }).format(new Date(date));
