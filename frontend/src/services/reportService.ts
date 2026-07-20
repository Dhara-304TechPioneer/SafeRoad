const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8000/api').replace(/\/$/, '');

const requestJson = async <T>(path: string, init?: RequestInit): Promise<T> => {
  const token = localStorage.getItem('access_token');
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(init?.headers ?? {}),
    },
    ...init,
  });

  const payload = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(payload?.detail ?? payload?.message ?? 'Request failed');
  }

  return payload as T;
};

const requestFormData = async <T>(path: string, formData: FormData): Promise<T> => {
  const token = localStorage.getItem('access_token');
  const response = await fetch(`${API_BASE_URL}${path}`, {
    method: 'POST',
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: formData,
  });

  const payload = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(payload?.detail ?? payload?.message ?? 'Request failed');
  }

  return payload as T;
};

import type { ReportRequest, Severity } from '../types/Report';
import type { ManagedReport, ReportComment, ReportStatus } from '../types/reportManagement';

export const getServerUrl = (url: string | null) => {
  if (!url) return '';
  if (url.startsWith('http')) return url;
  const baseUrl = (import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8000/api').replace(/\/$/, '');
  const origin = baseUrl.replace(/\/api$/, '');
  return `${origin}${url}`;
};

export const mapBackendSeverityToFrontend = (severity: string): Severity => {
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

export const mapBackendStatusToFrontend = (status: string): ReportStatus => {
  switch (status.toUpperCase()) {
    case 'REPORTED':
      return 'Reported';
    case 'AI_VERIFIED':
      return 'AI Verified';
    case 'OFFICER_VERIFIED':
    case 'ACKNOWLEDGED':
      return 'Officer Verified';
    case 'ASSIGNED':
      return 'Repair Assigned';
    case 'IN_PROGRESS':
    case 'QUALITY_CHECK':
      return 'Under Repair';
    case 'RESOLVED':
    case 'CLOSED':
      return 'Completed';
    default:
      return 'Reported';
  }
};

export const mapBackendReportToManagedReport = (report: any): ManagedReport => {
  const severity = mapBackendSeverityToFrontend(report.severity);
  const status = mapBackendStatusToFrontend(report.status);

  let formattedDate = '';
  try {
    const d = new Date(report.created_at);
    const day = String(d.getDate()).padStart(2, '0');
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const month = months[d.getMonth()];
    const year = d.getFullYear();
    let hours = d.getHours();
    const minutes = String(d.getMinutes()).padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12;
    const strTime = `${String(hours).padStart(2, '0')}:${minutes} ${ampm}`;
    formattedDate = `${day} ${month} ${year}, ${strTime}`;
  } catch (e) {
    formattedDate = report.created_at;
  }

  const priority = (severity === 'Critical' || severity === 'High') ? 'Urgent' : 'Standard';
  const aiVerified = report.status !== 'REPORTED';

  return {
    id: report.id,
    date: formattedDate,
    location: report.address || report.title || 'Unknown Location',
    description: report.description,
    roadType: 'Main Road',
    severity: severity,
    traffic: 'Medium',
    status: status,
    aiVerified: aiVerified,
    priority: priority,
    imageLabel: report.image_url ? 'Pothole Image' : 'No image',
    image_url: report.image_url,
  };
};

export const mapBackendCommentToReportComment = (comment: any): ReportComment => {
  let formattedTime = '';
  try {
    const d = new Date(comment.created_at);
    const day = String(d.getDate()).padStart(2, '0');
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const month = months[d.getMonth()];
    const hours = String(d.getHours()).padStart(2, '0');
    const minutes = String(d.getMinutes()).padStart(2, '0');
    formattedTime = `${day} ${month}, ${hours}:${minutes}`;
  } catch (e) {
    formattedTime = 'Just now';
  }

  // Generate initials based on role/userId
  const initials = comment.user_id === 1 ? 'AP' : 'O';
  const author = comment.user_id === 1 ? 'Ananya Patel' : `Officer #${comment.user_id}`;
  const role = comment.user_id === 1 ? 'Citizen' : 'Officer';

  return {
    author,
    role,
    message: comment.comment,
    timestamp: formattedTime,
    initials,
  };
};

const mapStatusToBackend = (status: string): string | undefined => {
  if (!status || status === 'All') return undefined;
  switch (status) {
    case 'Reported':
      return 'REPORTED';
    case 'AI Verified':
      return 'AI_VERIFIED';
    case 'Officer Verified':
      return 'OFFICER_VERIFIED';
    case 'Repair Assigned':
      return 'ASSIGNED';
    case 'Under Repair':
      return 'IN_PROGRESS';
    case 'Completed':
      return 'CLOSED';
    default:
      return status.toUpperCase().replace(' ', '_');
  }
};

export interface GetReportsParams {
  page?: number;
  size?: number;
  search?: string;
  status?: string;
  severity?: string;
  sort_by?: string;
}

export const getMyReports = async (params: GetReportsParams = {}) => {
  const query = new URLSearchParams();
  if (params.page) query.append('page', String(params.page));
  if (params.size) query.append('size', String(params.size));
  if (params.search) query.append('search', params.search);
  
  if (params.status && params.status !== 'All') {
    const backendStatus = mapStatusToBackend(params.status);
    if (backendStatus) query.append('status', backendStatus);
  }
  
  if (params.severity && params.severity !== 'All') {
    query.append('severity', params.severity.toUpperCase());
  }
  
  if (params.sort_by) {
    query.append('sort_by', params.sort_by);
  }

  const path = `/reports?${query.toString()}`;
  const response = await requestJson<{ items: any[]; total: number; page: number; size: number }>(path, {
    method: 'GET',
  });

  return {
    items: response.items.map(mapBackendReportToManagedReport),
    total: response.total,
    page: response.page,
    size: response.size,
  };
};

export const getReportById = async (reportId: string): Promise<ManagedReport> => {
  const report = await requestJson<any>(`/reports/${reportId}`, {
    method: 'GET',
  });
  return mapBackendReportToManagedReport(report);
};

export const listComments = async (reportId: string): Promise<ReportComment[]> => {
  const comments = await requestJson<any[]>(`/reports/${reportId}/comments`, {
    method: 'GET',
  });
  return comments.map(mapBackendCommentToReportComment);
};

export const addComment = async (reportId: string, comment: string): Promise<ReportComment> => {
  const newComment = await requestJson<any>(`/reports/${reportId}/comments`, {
    method: 'POST',
    body: JSON.stringify({ comment }),
  });
  return mapBackendCommentToReportComment(newComment);
};

export const updateReportStatus = async (reportId: string, status: string, remarks?: string) => {
  return requestJson<{ success: boolean; status: string }>(`/reports/${reportId}/status`, {
    method: 'POST',
    body: JSON.stringify({ status: status.toUpperCase().replace(' ', '_'), remarks }),
  });
};

export const verifyReport = async (reportId: string, remarks?: string) => {
  return requestJson<{ success: boolean; status: string }>(`/reports/${reportId}/verify`, {
    method: 'POST',
    body: JSON.stringify({ remarks }),
  });
};

export const submitReport = async (report: ReportRequest) => {
  return requestJson<{ id: string }>('/reports', {
    method: 'POST',
    body: JSON.stringify({
      title: report.location.roadName || 'Pothole report',
      description: report.description,
      severity: (report.severity || 'Medium').toUpperCase(),
      latitude: Number(report.location.latitude || 0),
      longitude: Number(report.location.longitude || 0),
      address: [report.location.roadName, report.location.area, report.location.city].filter(Boolean).join(', '),
      image_url: report.image,
    }),
  });
};

export const uploadImage = async (image: File) => {
  const formData = new FormData();
  formData.append('file', image);
  const response = await requestFormData<{ image_url: string }>('/reports/upload', formData);
  return response.image_url;
};

export const getLocation = () => Promise.resolve();
export const runAI = () => Promise.resolve();

