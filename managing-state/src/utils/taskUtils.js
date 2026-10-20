/**
 * taskUtils.js
 * -------------------------------------------------------------
 * Small, pure helper functions shared across the to-do app.
 * Keeping them here makes the components easier to read and the
 * logic easy to reuse and unit-test.
 * -------------------------------------------------------------
 */

/** Priority levels supported by the app (badges + sorting). */
export const PRIORITIES = ['low', 'medium', 'high'];

/** Maximum length allowed in each text field. */
export const LIMITS = { name: 100, description: 500 };

/** Status filters available in the toolbar. */
export const FILTERS = {
  ALL: 'all',
  ACTIVE: 'active',
  COMPLETED: 'completed',
};

/** Sorting options available in the toolbar. */
export const SORT_OPTIONS = {
  NEWEST: 'newest',
  OLDEST: 'oldest',
  DUE_DATE: 'dueDate',
  PRIORITY: 'priority',
  NAME: 'name',
};

/**
 * Generate a unique id for a task.
 * Uses crypto.randomUUID() when available, with a fallback for
 * older browsers / test environments that do not expose it.
 * @returns {string} unique id
 */
export function generateId() {
  if (typeof window !== 'undefined' && window.crypto && typeof window.crypto.randomUUID === 'function') {
    return window.crypto.randomUUID();
  }
  return `task-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

/**
 * Build a complete task object from raw form values.
 * @param {Object} values - { name, description, dueDate, priority }
 * @returns {Object} a new task ready to be stored in state
 */
export function createTask({ name, description, dueDate = null, priority = 'medium' }) {
  return {
    id: generateId(),
    name: name.trim(),
    description: description.trim(),
    dueDate: dueDate || null,
    priority: PRIORITIES.includes(priority) ? priority : 'medium',
    completed: false,
    createdAt: new Date().toISOString(),
  };
}

/**
 * Keep only the tasks matching the chosen status filter.
 * @param {Array} tasks - full task list
 * @param {string} filter - one of the FILTERS values
 * @returns {Array} filtered copy of the list
 */
export function filterTasks(tasks, filter) {
  switch (filter) {
    case FILTERS.ACTIVE:
      return tasks.filter((task) => !task.completed);
    case FILTERS.COMPLETED:
      return tasks.filter((task) => task.completed);
    case FILTERS.ALL:
    default:
      return tasks;
  }
}

/** Internal ranking used when sorting by priority (high first). */
const PRIORITY_RANK = { high: 0, medium: 1, low: 2 };

/**
 * Return a NEW sorted array (state arrays are never mutated).
 * Tasks without a due date are always placed last when sorting by date.
 * @param {Array} tasks - task list to sort
 * @param {string} sortBy - one of the SORT_OPTIONS values
 * @returns {Array} sorted copy of the list
 */
export function sortTasks(tasks, sortBy) {
  const sorted = [...tasks];
  switch (sortBy) {
    case SORT_OPTIONS.OLDEST:
      return sorted.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    case SORT_OPTIONS.DUE_DATE:
      return sorted.sort((a, b) => {
        if (!a.dueDate && !b.dueDate) return 0;
        if (!a.dueDate) return 1; // tasks without a due date go last
        if (!b.dueDate) return -1;
        return new Date(a.dueDate) - new Date(b.dueDate);
      });
    case SORT_OPTIONS.PRIORITY:
      return sorted.sort(
        (a, b) => (PRIORITY_RANK[a.priority] ?? 1) - (PRIORITY_RANK[b.priority] ?? 1)
      );
    case SORT_OPTIONS.NAME:
      return sorted.sort((a, b) => a.name.localeCompare(b.name));
    case SORT_OPTIONS.NEWEST:
    default:
      return sorted.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }
}

/**
 * A task is overdue when its due date has passed and it is not completed.
 * @param {Object} task
 * @returns {boolean}
 */
export function isOverdue(task) {
  if (!task.dueDate || task.completed) return false;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return new Date(`${task.dueDate}T00:00:00`) < today;
}

/**
 * Format an ISO due date (yyyy-mm-dd) for display, e.g. "12 Jan 2026".
 * @param {string|null} isoDate
 * @returns {string} human readable date (empty string when absent)
 */
export function formatDueDate(isoDate) {
  if (!isoDate) return '';
  return new Date(`${isoDate}T00:00:00`).toLocaleDateString(undefined, {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

/**
 * Short format for timestamps such as the creation date.
 * @param {string} isoString - full ISO timestamp
 * @returns {string} human readable date
 */
export function formatShortDate(isoString) {
  return new Date(isoString).toLocaleDateString(undefined, {
    day: 'numeric',
    month: 'short',
  });
}

/**
 * Summarise how many tasks are total / active / completed.
 * @param {Array} tasks
 * @returns {Object} { total, active, completed }
 */
export function countTasks(tasks) {
  const completed = tasks.filter((task) => task.completed).length;
  return { total: tasks.length, completed, active: tasks.length - completed };
}
