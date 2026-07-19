// Static options and placeholders until reporting services are connected.
import type { AIResult, Location, RoadType, Severity, Traffic } from '../types/Report';
export const roadTypes: RoadType[] = ['Highway', 'Main Road', 'Street', 'Village Road', 'Bridge'];
export const severityLevels: Severity[] = ['Low', 'Medium', 'High', 'Critical'];
export const trafficLevels: Traffic[] = ['Low', 'Medium', 'Heavy'];
export const mockLocation: Location = { latitude: '28.6139', longitude: '77.2090', roadName: '', area: '', city: 'New Delhi', landmark: '' };
export const mockAIResult: AIResult = { confidence: '94%', severity: 'High', damageType: 'Pothole', priority: 'Urgent' };
export const mockReferenceId = 'SR-2026-000123';
