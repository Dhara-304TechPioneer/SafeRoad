// Types for static citizen report-management presentation data.
import type { Severity } from './Report';
export type ReportStatus = 'Reported' | 'AI Verified' | 'Officer Verified' | 'Repair Assigned' | 'Under Repair' | 'Completed';
export interface ManagedReport {
  id: string;
  date: string;
  location: string;
  description: string;
  roadType: string;
  severity: Severity;
  traffic: string;
  status: ReportStatus;
  aiVerified: boolean;
  priority: string;
  imageLabel: string;
  image_url?: string | null;
  aiConfidence?: number | null;
  aiSeverity?: string | null;
  reporterName?: string | null;
  reporterEmail?: string | null;
  assignedOfficerName?: string | null;
  assignedOfficerBadge?: string | null;
  assignedOfficerDepartment?: string | null;
  officerId?: string | null;
}
export interface ReportComment { author: string; role: string; message: string; timestamp: string; initials: string; }

