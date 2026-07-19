import type { MapReport } from './map';

export interface AnalyticsFilters { city: string; severity: string; status: string; dateRange: string; department: string; reporter: string; vehicleType: string; }
export interface Metric { label: string; value: string | number; change: string; trend: 'up' | 'down'; }
export interface NamedValue { label: string; value: number; }
export interface AnalyticsReport extends MapReport { resolutionHours: number; }
