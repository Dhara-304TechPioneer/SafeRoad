// Async placeholders for future FastAPI reporting endpoints.
import type { ReportRequest } from '../types/Report';
export const submitReport = (report: ReportRequest) => { void report; return Promise.resolve(); };
export const uploadImage = (image: File) => { void image; return Promise.resolve(); };
export const getLocation = () => Promise.resolve();
export const runAI = () => Promise.resolve();
