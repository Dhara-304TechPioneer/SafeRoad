import { authenticatedRequestJson } from './authService';
import type { AdminData, AdminFilters, CreateOfficerInput } from '../types/admin';

export const defaultAdminFilters: AdminFilters = { department: 'All', role: 'All', status: 'All', date: 'All', search: '' };

export const adminData: AdminData = { users: [], departments: [], officers: [], reports: [], audits: [] };

export const filterAdminData = (data: AdminData, filters: AdminFilters): AdminData => {
  const query = filters.search.toLowerCase();
  const matches = (value: string) => !query || value.toLowerCase().includes(query);
  return {
    ...data,
    users: data.users.filter((user) => matches(`${user.id} ${user.name} ${user.email}`) && (filters.department === 'All' || user.department === filters.department) && (filters.role === 'All' || user.role === filters.role) && (filters.status === 'All' || user.status === filters.status)),
    officers: data.officers.filter((officer) => matches(`${officer.name} ${officer.email ?? ''} ${officer.badgeNumber ?? ''} ${officer.department}`) && (filters.department === 'All' || officer.department === filters.department) && (filters.status === 'All' || officer.status === filters.status)),
    reports: data.reports.filter((report) => matches(`${report.id} ${report.title} ${report.city}`) && (filters.department === 'All' || report.department === filters.department) && (filters.status === 'All' || report.status === filters.status)),
    audits: data.audits.filter((audit) => matches(`${audit.action} ${audit.actor} ${audit.detail}`)),
    departments: data.departments.filter((department) => matches(department.name) && (filters.department === 'All' || department.name === filters.department)),
  };
};

import { mapBackendSeverityToFrontend, mapBackendStatusToFrontend } from './reportService';

export const fetchOfficers = async () => {
  const response = await authenticatedRequestJson<{
    status: string;
    data: {
      officers: Array<{
        id: string;
        badgeNumber: string;
        status: string;
        user: { id: string; fullName: string; email: string; role: string };
        department: { id: string; name: string };
      }>;
    };
  }>('/users/officers');

  return response.data.officers.map((officer) => ({
    id: officer.id,
    userId: officer.user.id,
    name: officer.user.fullName,
    email: officer.user.email,
    badgeNumber: officer.badgeNumber,
    department: officer.department?.name || 'Road Maintenance',
    assigned: 0,
    completed: 0,
    status: officer.status || 'Available',
    availability: officer.status === 'Available' ? 'Available' : (officer.status || 'Available'),
  }));
};

export const fetchAdminOverview = async () => {
  const [usersResponse, officersResponse, reportsResponse] = await Promise.all([
    authenticatedRequestJson<{ status: string; data: { users: Array<{ id: string; fullName: string; email: string; role: string; createdAt: string; officer?: { status?: string; department?: { name?: string } | null } }> } }>('/users'),
    authenticatedRequestJson<{ status: string; data: { officers: Array<{ id: string; badgeNumber: string; status: string; user: { id: string; fullName: string; email: string; role: string }; department: { name: string } }> } }>('/users/officers'),
    authenticatedRequestJson<{ status: string; data: Array<{ id: string; title: string; city: string; status: string; severity: string; createdAt: string; department?: { name?: string } | null; officer?: { id: string; user?: { fullName: string } } | null; officerId?: string | null; aiResults?: Array<{ potholeDetected: boolean }> }> }>('/reports?limit=100'),
  ]);

  return {
    users: usersResponse.data.users.map((user) => ({
      id: user.id,
      name: user.fullName,
      email: user.email,
      role: user.role === 'ADMIN' ? 'Administrator' : user.role === 'OFFICER' ? 'Officer' : 'Citizen',
      status: 'Active',
      createdAt: new Date(user.createdAt).toLocaleDateString(),
      department: user.officer?.department?.name ?? 'Unassigned',
    })),
    officers: officersResponse.data.officers.map((officer) => ({
      id: officer.id,
      userId: officer.user.id,
      name: officer.user.fullName,
      email: officer.user.email,
      badgeNumber: officer.badgeNumber,
      department: officer.department?.name || 'Road Maintenance',
      assigned: 0,
      completed: 0,
      status: officer.status || 'Available',
      availability: officer.status === 'Available' ? 'Available' : (officer.status || 'Available'),
    })),
    reports: reportsResponse.data.map((report) => ({
      id: report.id,
      title: report.title,
      city: report.city,
      status: mapBackendStatusToFrontend(report.status),
      severity: mapBackendSeverityToFrontend(report.severity),
      createdAt: new Date(report.createdAt).toLocaleDateString(),
      department: report.department?.name || 'Road Maintenance',
      assignedOfficer: report.officer?.user?.fullName || null,
      officerId: report.officerId || report.officer?.id || null,
      verificationStatus: report.aiResults?.[0]?.potholeDetected ? 'AI Verified' : (report.status !== 'REPORTED' ? 'Verified' : 'Pending'),
    })),
    departments: [{ name: 'Road Maintenance', officers: officersResponse.data.officers.length, pending: 0, resolved: 0, performance: 100 }],
    audits: [],
  };
};

export const createOfficer = async (input: CreateOfficerInput) => {
  return authenticatedRequestJson<{
    status: string;
    data: {
      user: { id: string; fullName: string; email: string; role: string };
      officer: { id: string; badgeNumber: string; departmentId: string };
    };
  }>('/users/officers', {
    method: 'POST',
    body: JSON.stringify(input),
  });
};

export const updateUserRole = async (userId: string, role: 'USER' | 'OFFICER' | 'ADMIN') => {
  return authenticatedRequestJson<{
    status: string;
    data: { user: { id: string; role: string } };
  }>(`/users/${userId}/role`, {
    method: 'PATCH',
    body: JSON.stringify({ role }),
  });
};
