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

import type { ReportRequest } from '../types/Report';

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
