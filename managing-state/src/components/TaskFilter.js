/**
 * TaskFilter.js
 * -------------------------------------------------------------
 * Toolbar with the optional list controls:
 *  - status filter: All / Active / Completed
 *  - sorting: newest, oldest, due date, priority or name
 *
 * The component is "controlled": App owns the filter/sort state and
 * this component only reports the user's choices upward.
 * -------------------------------------------------------------
 */

import { FILTERS, SORT_OPTIONS } from '../utils/taskUtils';
import './TaskFilter.css';

/** Buttons of the status filter. */
const FILTER_OPTIONS = [
  { value: FILTERS.ALL, label: 'All', countKey: 'total' },
  { value: FILTERS.ACTIVE, label: 'Active', countKey: 'active' },
  { value: FILTERS.COMPLETED, label: 'Completed', countKey: 'completed' },
];

/** Entries of the "Sort by" dropdown. */
const SORT_LABELS = [
  { value: SORT_OPTIONS.NEWEST, label: 'Newest first' },
  { value: SORT_OPTIONS.OLDEST, label: 'Oldest first' },
  { value: SORT_OPTIONS.DUE_DATE, label: 'Due date' },
  { value: SORT_OPTIONS.PRIORITY, label: 'Priority' },
  { value: SORT_OPTIONS.NAME, label: 'Name (A–Z)' },
];

/**
 * @param {Object} props
 * @param {string} props.filter - active status filter
 * @param {Function} props.onFilterChange - called with the new filter
 * @param {string} props.sortBy - active sort option
 * @param {Function} props.onSortChange - called with the new sort option
 * @param {Object} props.counts - { total, active, completed } for the badges
 */
function TaskFilter({ filter, onFilterChange, sortBy, onSortChange, counts }) {
  return (
    <div className="toolbar">
      {/* Status filter buttons */}
      <div className="filter-group" role="group" aria-label="Filter tasks by status">
        {FILTER_OPTIONS.map((option) => (
          <button
            key={option.value}
            type="button"
            className={`filter-button${filter === option.value ? ' filter-button--active' : ''}`}
            aria-pressed={filter === option.value}
            onClick={() => onFilterChange(option.value)}
          >
            {option.label}
            <span className="filter-button__count">{counts[option.countKey]}</span>
          </button>
        ))}
      </div>

      {/* Sorting dropdown */}
      <div className="sort-field">
        <label className="sort-field__label" htmlFor="task-sort">
          Sort by
        </label>
        <select
          id="task-sort"
          className="sort-field__select"
          value={sortBy}
          onChange={(event) => onSortChange(event.target.value)}
        >
          {SORT_LABELS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}

export default TaskFilter;
