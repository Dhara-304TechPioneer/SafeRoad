export type AdminTab = 'Users' | 'Officers' | 'Departments' | 'Reports' | 'Audit Logs' | 'Settings';

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: string;
  status: string;
  createdAt: string;
  department: string;
}

export interface AdminOfficer {
  id?: string;
  userId?: string;
  name: string;
  email?: string;
  badgeNumber?: string;
  department: string;
  assigned: number;
  completed: number;
  status: string;
  availability: string;
}

export interface AdminDepartment {
  name: string;
  officers: number;
  pending: number;
  resolved: number;
  performance: number;
}

export interface AdminReport {
  id: string;
  title: string;
  city: string;
  status: string;
  severity: string;
  createdAt: string;
  department: string;
  assignedOfficer?: string | null;
  officerId?: string | null;
  verificationStatus?: string;
}

export interface AuditEvent {
  id: string;
  action: string;
  actor: string;
  date: string;
  detail: string;
}

export interface AdminFilters {
  department: string;
  role: string;
  status: string;
  date: string;
  search: string;
}

export interface AdminData {
  users: AdminUser[];
  officers: AdminOfficer[];
  departments: AdminDepartment[];
  reports: AdminReport[];
  audits: AuditEvent[];
}

export interface CreateOfficerInput {
  fullName: string;
  email: string;
  password: string;
  departmentName?: string;
  departmentId?: string;
  badgeNumber?: string;
}
