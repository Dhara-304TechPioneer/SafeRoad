import { mapReports } from '../data/mapData';
import type { AnalyticsFilters, AnalyticsReport, NamedValue } from '../types/analytics';
import type { MapSeverity } from '../types/map';

const severityOrder: Record<MapSeverity, number> = { Critical: 4, High: 3, Medium: 2, Low: 1 };
export const analyticsReports: AnalyticsReport[] = mapReports.map((report, index) => ({ ...report, resolutionHours: 8 + (index % 6) * 7 }));
export const defaultAnalyticsFilters: AnalyticsFilters = { city: 'All', severity: 'All', status: 'All', dateRange: 'All', department: 'All', reporter: 'All', vehicleType: 'All' };
export const uniqueValues = (reports: AnalyticsReport[], key: keyof AnalyticsReport): string[] => [...new Set(reports.map((report) => String(report[key])))].sort();
export const filterAnalyticsReports = (reports: AnalyticsReport[], filters: AnalyticsFilters): AnalyticsReport[] => reports.filter((report) => (filters.city === 'All' || report.city === filters.city) && (filters.severity === 'All' || report.severity === filters.severity) && (filters.status === 'All' || report.status === filters.status) && (filters.department === 'All' || report.department === filters.department) && (filters.reporter === 'All' || report.reporter === filters.reporter) && (filters.vehicleType === 'All' || report.vehicleType === filters.vehicleType) && (filters.dateRange === 'All' || Date.parse(report.createdAt) >= Date.parse(filters.dateRange === '7 days' ? '2026-07-11' : '2026-06-18')));
export const countBy = <K extends keyof AnalyticsReport>(reports: AnalyticsReport[], key: K): NamedValue[] => Object.entries(reports.reduce<Record<string, number>>((result, report) => { const value = String(report[key]); result[value] = (result[value] ?? 0) + 1; return result; }, {})).map(([label, value]) => ({ label, value }));
export const highestSeverityFirst = (reports: AnalyticsReport[]) => [...reports].sort((first, second) => severityOrder[second.severity] - severityOrder[first.severity] || Date.parse(second.createdAt) - Date.parse(first.createdAt));
