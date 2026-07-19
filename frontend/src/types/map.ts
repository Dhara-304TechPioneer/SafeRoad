export type MapSeverity = 'Low' | 'Medium' | 'High' | 'Critical';
export type MapStatus = 'New' | 'Verified' | 'Assigned' | 'In Progress' | 'Resolved';
export type VerificationStatus = 'Pending' | 'AI Verified' | 'Officer Verified';
export type IncidentType = 'Pothole' | 'Road Crack' | 'Waterlogging' | 'Construction' | 'Accident' | 'Road Block';
export type MapSort = 'Newest' | 'Oldest' | 'Highest Severity' | 'Most Reports' | 'Alphabetical';

export interface MapReport {
  id: string;
  title: string;
  latitude: number;
  longitude: number;
  severity: MapSeverity;
  status: MapStatus;
  reporter: string;
  address: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  image: string;
  vehicleType: string;
  verificationStatus: VerificationStatus;
  city: string;
  incidentType: IncidentType;
  priority: 'Standard' | 'Priority' | 'Urgent';
  estimatedRepairCost: string;
  estimatedRepairTime: string;
  assignedOfficer: string;
  department: string;
  citizenReports: number;
  aiConfidence: number;
  detectionMethod: string;
  imageTimestamp: string;
  actionHistory: ActionHistoryEvent[];
}

export interface ActionHistoryEvent { status: string; date: string; }

export interface MapFiltersState {
  search: string;
  severity: MapSeverity | 'All';
  status: MapStatus | 'All';
  reporter: string;
  date: 'All' | 'Today' | 'This week' | 'This month';
  city: string;
  vehicleType: string;
  verificationStatus: VerificationStatus | 'All';
  department: string;
}
