import type { MapReport } from '../types/map';

type ReportSeed = Omit<MapReport, 'id' | 'image' | 'updatedAt' | 'city' | 'incidentType' | 'priority' | 'estimatedRepairCost' | 'estimatedRepairTime' | 'assignedOfficer' | 'department' | 'citizenReports' | 'aiConfidence' | 'detectionMethod' | 'imageTimestamp' | 'actionHistory'>;

const updatedAt = '2026-07-18T09:30:00+05:30';
const image = 'Evidence image pending upload';

const reportSeeds: ReportSeed[] = [
  { title: 'Deep pothole near Kalawad Road junction', latitude: 22.3039, longitude: 70.8022, severity: 'Critical', status: 'In Progress', reporter: 'Nirav Patel', address: 'Kalawad Road, Rajkot', description: 'Deep crater in the centre lane causing two-wheelers to swerve during peak traffic.', createdAt: '2026-07-18T08:42:00+05:30', vehicleType: 'Motorcycle', verificationStatus: 'Officer Verified' },
  { title: 'Surface collapse at SG Highway service lane', latitude: 23.0407, longitude: 72.5116, severity: 'High', status: 'Assigned', reporter: 'Kavita Shah', address: 'SG Highway, Ahmedabad', description: 'Damaged asphalt on the service lane beside a bus stop.', createdAt: '2026-07-18T08:10:00+05:30', vehicleType: 'Car', verificationStatus: 'AI Verified' },
  { title: 'Waterlogged pothole by Hamirsar Lake', latitude: 23.2487, longitude: 69.6663, severity: 'High', status: 'New', reporter: 'Mehul Joshi', address: 'Hamirsar Road, Bhuj', description: 'Large water-filled pothole is difficult to see after monsoon showers.', createdAt: '2026-07-18T07:55:00+05:30', vehicleType: 'Auto rickshaw', verificationStatus: 'Pending' },
  { title: 'Broken road edge near Ranjit Sagar Dam', latitude: 22.4707, longitude: 70.0800, severity: 'Medium', status: 'Verified', reporter: 'Riya Mehta', address: 'Ranjit Sagar Road, Jamnagar', description: 'Road edge has eroded near a curve; temporary caution marker recommended.', createdAt: '2026-07-18T07:20:00+05:30', vehicleType: 'Scooter', verificationStatus: 'AI Verified' },
  { title: 'Pothole cluster at Udhna crossroads', latitude: 21.1702, longitude: 72.8381, severity: 'Critical', status: 'In Progress', reporter: 'Aarav Desai', address: 'Udhna Main Road, Surat', description: 'Multiple connected potholes across the intersection are slowing traffic.', createdAt: '2026-07-18T06:48:00+05:30', vehicleType: 'Truck', verificationStatus: 'Officer Verified' },
  { title: 'Damaged asphalt near Gotri bridge', latitude: 22.3240, longitude: 73.1407, severity: 'Medium', status: 'Assigned', reporter: 'Hetal Trivedi', address: 'Gotri Road, Vadodara', description: 'A shallow but widening depression is present on the bridge approach.', createdAt: '2026-07-17T18:15:00+05:30', vehicleType: 'Car', verificationStatus: 'AI Verified' },
  { title: 'Crater on Junagadh bypass', latitude: 21.5298, longitude: 70.4579, severity: 'Critical', status: 'New', reporter: 'Dhruv Vora', address: 'Junagadh Bypass, Junagadh', description: 'A deep crater in the left lane presents a severe hazard at night.', createdAt: '2026-07-17T16:40:00+05:30', vehicleType: 'Bus', verificationStatus: 'Pending' },
  { title: 'Uneven patch near Sanala Road', latitude: 22.8162, longitude: 70.8370, severity: 'Low', status: 'Resolved', reporter: 'Pooja Parmar', address: 'Sanala Road, Morbi', description: 'Small residual depression remains after an earlier patch repair.', createdAt: '2026-07-17T15:30:00+05:30', vehicleType: 'Motorcycle', verificationStatus: 'Officer Verified' },
  { title: 'Pothole at Tagore Road freight route', latitude: 23.0758, longitude: 70.1352, severity: 'High', status: 'Assigned', reporter: 'Sanjay Gohil', address: 'Tagore Road, Gandhidham', description: 'Heavy vehicle route has a sharp-edged pothole beside the median.', createdAt: '2026-07-17T14:12:00+05:30', vehicleType: 'Truck', verificationStatus: 'AI Verified' },
  { title: 'Damaged lane near Science City', latitude: 23.0802, longitude: 72.4931, severity: 'Medium', status: 'Verified', reporter: 'Kavita Shah', address: 'Science City Road, Ahmedabad', description: 'Pothole near the cycle lane requires scheduled repair.', createdAt: '2026-07-17T12:10:00+05:30', vehicleType: 'Bicycle', verificationStatus: 'Officer Verified' },
  { title: 'Road dip near Kotecha Chowk', latitude: 22.2921, longitude: 70.7844, severity: 'Medium', status: 'New', reporter: 'Nirav Patel', address: 'Kotecha Chowk, Rajkot', description: 'Surface dip collects rainwater and affects turning traffic.', createdAt: '2026-07-17T10:30:00+05:30', vehicleType: 'Car', verificationStatus: 'Pending' },
  { title: 'Pothole beside ISKCON bridge', latitude: 23.0226, longitude: 72.5066, severity: 'High', status: 'In Progress', reporter: 'Rohan Dave', address: 'Sarkhej-Gandhinagar Highway, Ahmedabad', description: 'Large pothole at the bridge exit creates a sudden braking point.', createdAt: '2026-07-17T09:05:00+05:30', vehicleType: 'Car', verificationStatus: 'Officer Verified' },
  { title: 'Shoulder damage near Mandvi Gate', latitude: 23.2535, longitude: 69.6692, severity: 'Low', status: 'Resolved', reporter: 'Mehul Joshi', address: 'Mandvi Gate Road, Bhuj', description: 'Minor shoulder damage has been filled and marked for observation.', createdAt: '2026-07-16T17:30:00+05:30', vehicleType: 'Scooter', verificationStatus: 'Officer Verified' },
  { title: 'Pothole near Lakhota Lake road', latitude: 22.4752, longitude: 70.0707, severity: 'Medium', status: 'Verified', reporter: 'Riya Mehta', address: 'Lakhota Lake Road, Jamnagar', description: 'Pothole close to the pedestrian crossing needs a protective cone.', createdAt: '2026-07-16T15:20:00+05:30', vehicleType: 'Motorcycle', verificationStatus: 'AI Verified' },
  { title: 'Road collapse at Vesu canal crossing', latitude: 21.1458, longitude: 72.7838, severity: 'Critical', status: 'Assigned', reporter: 'Aarav Desai', address: 'Vesu Canal Road, Surat', description: 'Road surface has collapsed along the canal-side carriageway.', createdAt: '2026-07-16T13:45:00+05:30', vehicleType: 'Car', verificationStatus: 'Officer Verified' },
  { title: 'Cracked surface near Sayaji Baug', latitude: 22.3072, longitude: 73.1812, severity: 'Low', status: 'New', reporter: 'Hetal Trivedi', address: 'Sayaji Baug Road, Vadodara', description: 'Small crack network is beginning to form a shallow pothole.', createdAt: '2026-07-16T11:00:00+05:30', vehicleType: 'Scooter', verificationStatus: 'Pending' },
  { title: 'Pothole at Moti Baug circle', latitude: 21.5183, longitude: 70.4638, severity: 'High', status: 'In Progress', reporter: 'Dhruv Vora', address: 'Moti Baug Road, Junagadh', description: 'Deep pothole is located directly in a busy roundabout lane.', createdAt: '2026-07-16T09:25:00+05:30', vehicleType: 'Auto rickshaw', verificationStatus: 'Officer Verified' },
  { title: 'Loose surface near Machhu bridge', latitude: 22.8105, longitude: 70.8423, severity: 'Medium', status: 'Assigned', reporter: 'Pooja Parmar', address: 'Machhu Bridge Road, Morbi', description: 'Loose asphalt around a drainage cover is becoming uneven.', createdAt: '2026-07-15T18:40:00+05:30', vehicleType: 'Car', verificationStatus: 'AI Verified' },
  { title: 'Pothole at Adipur bus stand approach', latitude: 23.0810, longitude: 70.0953, severity: 'High', status: 'Verified', reporter: 'Sanjay Gohil', address: 'Adipur Bus Stand Road, Gandhidham', description: 'Bus bay entrance has a sizable pothole affecting public transport.', createdAt: '2026-07-15T16:05:00+05:30', vehicleType: 'Bus', verificationStatus: 'Officer Verified' },
  { title: 'Rutted lane near Prahlad Nagar', latitude: 23.0128, longitude: 72.5103, severity: 'Medium', status: 'New', reporter: 'Rohan Dave', address: 'Prahlad Nagar Road, Ahmedabad', description: 'Repeated wheel ruts have opened into a narrow pothole.', createdAt: '2026-07-15T13:10:00+05:30', vehicleType: 'Car', verificationStatus: 'Pending' },
  { title: 'Pothole near Race Course circle', latitude: 22.3030, longitude: 70.7914, severity: 'High', status: 'Assigned', reporter: 'Nirav Patel', address: 'Race Course Road, Rajkot', description: 'Road defect is in the outer lane near a high-footfall junction.', createdAt: '2026-07-15T10:50:00+05:30', vehicleType: 'Motorcycle', verificationStatus: 'AI Verified' },
  { title: 'Broken tarmac at Thaltej underpass', latitude: 23.0523, longitude: 72.5174, severity: 'Critical', status: 'In Progress', reporter: 'Kavita Shah', address: 'Thaltej Underpass, Ahmedabad', description: 'Broken tarmac spans almost half a lane at the underpass exit.', createdAt: '2026-07-14T17:00:00+05:30', vehicleType: 'Car', verificationStatus: 'Officer Verified' },
  { title: 'Drain-edge pothole near Bhujodi', latitude: 23.2118, longitude: 69.7032, severity: 'Low', status: 'Resolved', reporter: 'Mehul Joshi', address: 'Bhujodi Road, Bhuj', description: 'Small drain-edge pothole has been temporarily sealed.', createdAt: '2026-07-14T14:30:00+05:30', vehicleType: 'Motorcycle', verificationStatus: 'Officer Verified' },
  { title: 'Uneven lane at Patel Colony', latitude: 22.4686, longitude: 70.0634, severity: 'Medium', status: 'Verified', reporter: 'Riya Mehta', address: 'Patel Colony Road, Jamnagar', description: 'Uneven asphalt at the junction may destabilise two-wheelers.', createdAt: '2026-07-14T12:00:00+05:30', vehicleType: 'Scooter', verificationStatus: 'AI Verified' },
  { title: 'Pothole on Dumas Road shoulder', latitude: 21.0962, longitude: 72.7397, severity: 'High', status: 'Assigned', reporter: 'Aarav Desai', address: 'Dumas Road, Surat', description: 'Shoulder pothole forces vehicles into the main travel lane.', createdAt: '2026-07-13T16:20:00+05:30', vehicleType: 'Car', verificationStatus: 'Officer Verified' },
  { title: 'Damaged patch near Akota bridge', latitude: 22.2962, longitude: 73.1679, severity: 'Medium', status: 'New', reporter: 'Hetal Trivedi', address: 'Akota Bridge Road, Vadodara', description: 'Old repair patch has loosened after recent rain.', createdAt: '2026-07-13T13:35:00+05:30', vehicleType: 'Car', verificationStatus: 'Pending' },
  { title: 'Pothole near Girnar Taleti', latitude: 21.5158, longitude: 70.5157, severity: 'Low', status: 'Resolved', reporter: 'Dhruv Vora', address: 'Girnar Taleti Road, Junagadh', description: 'Small pothole near the visitor route was filled by the local team.', createdAt: '2026-07-12T11:40:00+05:30', vehicleType: 'Scooter', verificationStatus: 'Officer Verified' },
  { title: 'Road depression at Ravapar circle', latitude: 22.8250, longitude: 70.8261, severity: 'High', status: 'Verified', reporter: 'Pooja Parmar', address: 'Ravapar Circle, Morbi', description: 'Road depression at the circle causes a strong impact for buses.', createdAt: '2026-07-12T09:15:00+05:30', vehicleType: 'Bus', verificationStatus: 'AI Verified' },
  { title: 'Pothole near Kandla port gate', latitude: 23.0225, longitude: 70.2205, severity: 'Critical', status: 'In Progress', reporter: 'Sanjay Gohil', address: 'Kandla Port Road, Gandhidham', description: 'Critical road defect on a heavy freight corridor needs urgent repair.', createdAt: '2026-07-11T15:00:00+05:30', vehicleType: 'Truck', verificationStatus: 'Officer Verified' },
  { title: 'Uneven pavement at Maninagar crossing', latitude: 22.9998, longitude: 72.6029, severity: 'Medium', status: 'New', reporter: 'Rohan Dave', address: 'Maninagar Crossing, Ahmedabad', description: 'Uneven pavement at the crossing has developed into a shallow pothole.', createdAt: '2026-07-11T10:10:00+05:30', vehicleType: 'Auto rickshaw', verificationStatus: 'Pending' },
];

const incidentTypes: MapReport['incidentType'][] = ['Pothole', 'Road Crack', 'Waterlogging', 'Construction', 'Accident', 'Road Block'];
const officers = ['Asha Patel', 'Vivek Shah', 'Rohan Mehta', 'Neha Joshi'];
const departments = ['Road Maintenance', 'Urban Mobility', 'Drainage Operations'];
const historyFor = (createdAt: string, status: MapReport['status']) => {
  const events = [{ status: 'Reported', date: createdAt }, { status: 'AI Verified', date: updatedAt }];
  if (status !== 'New') events.push({ status: 'Officer Verified', date: updatedAt });
  if (status === 'Assigned' || status === 'In Progress' || status === 'Resolved') events.push({ status: 'Assigned', date: updatedAt });
  if (status === 'In Progress' || status === 'Resolved') events.push({ status: 'Repair Started', date: updatedAt });
  if (status === 'Resolved') events.push({ status: 'Repair Completed', date: updatedAt });
  return events;
};

export const mapReports: MapReport[] = reportSeeds.map((report, index) => {
  const city = report.address.split(', ').at(-1) ?? 'Gujarat';
  return {
    ...report,
    id: `SR-GJ-${String(index + 1).padStart(4, '0')}`,
    image,
    updatedAt,
    city,
    incidentType: incidentTypes[index % incidentTypes.length],
    priority: report.severity === 'Critical' ? 'Urgent' : report.severity === 'High' ? 'Priority' : 'Standard',
    estimatedRepairCost: `₹${(8500 + index * 1250).toLocaleString('en-IN')}`,
    estimatedRepairTime: report.severity === 'Critical' ? '4–8 hours' : report.severity === 'High' ? '1 day' : '2–3 days',
    assignedOfficer: report.status === 'New' ? 'Unassigned' : officers[index % officers.length],
    department: departments[index % departments.length],
    citizenReports: 2 + (index % 9),
    aiConfidence: 82 + (index % 17),
    detectionMethod: index % 2 === 0 ? 'Citizen mobile report' : 'AI road scan',
    imageTimestamp: report.createdAt,
    actionHistory: historyFor(report.createdAt, report.status),
  };
});
