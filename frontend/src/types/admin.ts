import type { MapReport } from './map';
export type AdminTab = 'Users' | 'Officers' | 'Departments' | 'Reports' | 'Audit Logs' | 'Settings';
export interface AdminUser { id: string; name: string; email: string; role: 'Administrator' | 'Officer' | 'Analyst' | 'Citizen'; status: 'Active' | 'Suspended'; createdAt: string; department: string; }
export interface AdminOfficer { name: string; department: string; assigned: number; completed: number; status: 'On duty' | 'On leave'; availability: 'Available' | 'Busy'; }
export interface AdminDepartment { name: string; officers: number; pending: number; resolved: number; performance: number; }
export interface AuditEvent { id: string; action: string; actor: string; date: string; detail: string; }
export interface AdminFilters { department: string; role: string; status: string; date: string; search: string; }
export interface AdminData { users: AdminUser[]; officers: AdminOfficer[]; departments: AdminDepartment[]; reports: MapReport[]; audits: AuditEvent[]; }
