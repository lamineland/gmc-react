/**
 * taskUtils.js
 * -------------------------------------------------------------
 * Small, pure helper functions shared by the Redux layer and the
 * components. Keeping them here makes the logic easy to reuse and
 * unit-test, and the components easier to read.
 * -------------------------------------------------------------
 */

/** Status filters the user can apply to the task list. */
export const FILTERS = {
  ALL: 'all',
  DONE: 'done',
  NOT_DONE: 'not',
};

/** Maximum length allowed for a task description. */
export const DESCRIPTION_LIMIT = 200;

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
 * Keep only the tasks matching the chosen filter.
 * @param {Array} tasks - full task list
 * @param {string} filter - one of the FILTERS values
 * @returns {Array} filtered copy of the list (the state is never mutated)
 */
export function filterTasks(tasks, filter) {
  switch (filter) {
    case FILTERS.DONE:
      return tasks.filter((task) => task.isDone);
    case FILTERS.NOT_DONE:
      return tasks.filter((task) => !task.isDone);
    case FILTERS.ALL:
    default:
      return tasks;
  }
}

/**
 * Summarise how many tasks are total / done / not done.
 * @param {Array} tasks
 * @returns {Object} { total, done, notDone }
 */
export function countTasks(tasks) {
  const done = tasks.filter((task) => task.isDone).length;
  return { total: tasks.length, done, notDone: tasks.length - done };
}
