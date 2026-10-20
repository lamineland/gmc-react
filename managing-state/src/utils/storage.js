/**
 * storage.js
 * -------------------------------------------------------------
 * Tiny persistence layer on top of window.localStorage.
 * Every read/write is defensive: corrupt or missing data must never
 * crash the app - it simply falls back to an empty task list.
 * -------------------------------------------------------------
 */

import { PRIORITIES } from './taskUtils';

/** Key under which the task list is stored in the browser. */
export const STORAGE_KEY = 'gmc-todo-tasks';

/**
 * Normalise a raw entry coming from storage so the rest of the app
 * can rely on a consistent task shape.
 * @param {Object} raw - entry parsed from JSON
 * @returns {Object|null} a valid task or null when the entry is unusable
 */
function normaliseTask(raw) {
  if (!raw || typeof raw !== 'object' || typeof raw.id !== 'string') return null;
  return {
    id: raw.id,
    name: typeof raw.name === 'string' ? raw.name : '',
    description: typeof raw.description === 'string' ? raw.description : '',
    dueDate: typeof raw.dueDate === 'string' ? raw.dueDate : null,
    priority: PRIORITIES.includes(raw.priority) ? raw.priority : 'medium',
    completed: Boolean(raw.completed),
    createdAt: typeof raw.createdAt === 'string' ? raw.createdAt : new Date().toISOString(),
  };
}

/**
 * Read the task list from localStorage.
 * Called once when the app boots (lazy initialiser of useReducer).
 * @returns {Array} the stored tasks, or an empty list when nothing valid is stored
 */
export function loadTasks() {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.map(normaliseTask).filter(Boolean);
  } catch (error) {
    // JSON errors / private-mode restrictions: fall back to an empty list.
    console.warn('Could not read tasks from localStorage:', error);
    return [];
  }
}

/**
 * Persist the task list to localStorage.
 * Called whenever the task list changes.
 * @param {Array} tasks - current task list
 */
export function saveTasks(tasks) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  } catch (error) {
    console.warn('Could not save tasks to localStorage:', error);
  }
}
