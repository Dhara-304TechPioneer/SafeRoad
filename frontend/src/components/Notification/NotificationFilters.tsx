import React from 'react';

export type FilterType = 'all' | 'unread' | 'report' | 'warning' | 'success' | 'admin' | 'assignment';

interface NotificationFiltersProps {
  activeFilter: FilterType;
  onChangeFilter: (filter: FilterType) => void;
  searchQuery: string;
  onChangeSearchQuery: (query: string) => void;
}

export const NotificationFilters: React.FC<NotificationFiltersProps> = ({
  activeFilter,
  onChangeFilter,
  searchQuery,
  onChangeSearchQuery,
}) => {
  const filters: { value: FilterType; label: string }[] = [
    { value: 'all', label: 'All' },
    { value: 'unread', label: 'Unread' },
    { value: 'report', label: 'Report' },
    { value: 'warning', label: 'Warning' },
    { value: 'success', label: 'Success' },
    { value: 'admin', label: 'Admin' },
    { value: 'assignment', label: 'Assignment' },
  ];

  return (
    <div className="notification-filters">
      <div className="notification-filters__search">
        <input
          type="text"
          placeholder="Search notifications..."
          value={searchQuery}
          onChange={(e) => onChangeSearchQuery(e.target.value)}
          aria-label="Search notifications"
        />
      </div>

      <div
        className="notification-filters__tabs"
        role="tablist"
        aria-label="Notification filters"
      >
        {filters.map((filter) => (
          <button
            key={filter.value}
            type="button"
            role="tab"
            aria-selected={activeFilter === filter.value}
            className={`notification-filters__tab ${
              activeFilter === filter.value
                ? 'notification-filters__tab--active'
                : ''
            }`}
            onClick={() => onChangeFilter(filter.value)}
          >
            {filter.label}
          </button>
        ))}
      </div>
    </div>
  );
};
