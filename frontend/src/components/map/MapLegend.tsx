const levels = ['Low', 'Medium', 'High', 'Critical'];
export const MapLegend = () => <section className="map-legend" aria-label="Severity legend"><span>Severity</span>{levels.map((level) => <div key={level}><i className={`map-legend__dot map-legend__dot--${level.toLowerCase()}`} />{level}</div>)}</section>;
