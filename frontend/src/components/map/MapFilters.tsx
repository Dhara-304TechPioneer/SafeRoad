import { FiRotateCcw, FiSliders } from 'react-icons/fi';
import type { MapFiltersState } from '../../types/map';

interface MapFiltersProps { filters: MapFiltersState; reporters: string[]; cities: string[]; vehicleTypes: string[]; departments: string[]; onChange: (filters: MapFiltersState) => void; onReset: () => void; }

export const MapFilters = ({ filters, reporters, cities, vehicleTypes, departments, onChange, onReset }: MapFiltersProps) => {
  const update = <K extends keyof MapFiltersState>(key: K, value: MapFiltersState[K]) => onChange({ ...filters, [key]: value });
  return <aside className="map-filters"><div className="map-filters__heading"><FiSliders /><h2>Filters</h2></div>
    <label>Severity<select value={filters.severity} onChange={(event) => update('severity', event.target.value as MapFiltersState['severity'])}><option>All</option><option>Low</option><option>Medium</option><option>High</option><option>Critical</option></select></label>
    <label>Status<select value={filters.status} onChange={(event) => update('status', event.target.value as MapFiltersState['status'])}><option>All</option><option>New</option><option>Verified</option><option>Assigned</option><option>In Progress</option><option>Resolved</option></select></label>
    <label>Reporter<select value={filters.reporter} onChange={(event) => update('reporter', event.target.value)}><option>All</option>{reporters.map((reporter) => <option key={reporter}>{reporter}</option>)}</select></label>
    <label>City<select value={filters.city} onChange={(event) => update('city', event.target.value)}><option>All</option>{cities.map((city) => <option key={city}>{city}</option>)}</select></label>
    <label>Vehicle type<select value={filters.vehicleType} onChange={(event) => update('vehicleType', event.target.value)}><option>All</option>{vehicleTypes.map((vehicle) => <option key={vehicle}>{vehicle}</option>)}</select></label>
    <label>Verification<select value={filters.verificationStatus} onChange={(event) => update('verificationStatus', event.target.value as MapFiltersState['verificationStatus'])}><option>All</option><option>Pending</option><option>AI Verified</option><option>Officer Verified</option></select></label>
    <label>Department<select value={filters.department} onChange={(event) => update('department', event.target.value)}><option>All</option>{departments.map((department) => <option key={department}>{department}</option>)}</select></label>
    <label>Date<select value={filters.date} onChange={(event) => update('date', event.target.value as MapFiltersState['date'])}><option>All</option><option>Today</option><option>This week</option><option>This month</option></select></label>
    <button className="map-filters__reset" type="button" onClick={onReset}><FiRotateCcw />Reset filters</button>
  </aside>;
};
