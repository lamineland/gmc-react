/**
 * useTasks.js
 * -------------------------------------------------------------
 * Custom hook that owns all task STATE and PERSISTENCE.
 *
 * Responsibilities:
 *  1. Hold the task list with useReducer (see tasksReducer.js).
 *  2. Hydrate the list from localStorage on first render
 *     (lazy initialisation - storage is read exactly once).
 *  3. Persist the list to localStorage whenever it changes
 *     (a useEffect runs after every state update).
 *  4. Expose small, memoised action helpers to the components.
 *
 * Components never talk to the reducer or to localStorage directly,
 * which keeps state management in a single, testable place.
 * -------------------------------------------------------------
 */

import { useCallback, useEffect, useReducer } from 'react';
import tasksReducer, { TASK_ACTIONS } from '../reducer/tasksReducer';
import { loadTasks, saveTasks } from '../utils/storage';
import { createTask } from '../utils/taskUtils';

/**
 * Manage the to-do task list.
 * @returns {Object} { tasks, addTask, updateTask, deleteTask, toggleTask }
 */
export default function useTasks() {
  // Second argument `undefined` + third argument `loadTasks` means:
  // "initialise the state lazily by calling loadTasks() on first render".
  const [tasks, dispatch] = useReducer(tasksReducer, undefined, loadTasks);

  // Persist every change: runs once on mount (saving what was loaded)
  // and again after each add / edit / delete / toggle.
  useEffect(() => {
    saveTasks(tasks);
  }, [tasks]);

  /**
   * Create a task from form values and add it to the top of the list.
   * @param {Object} values - { name, description, dueDate, priority }
   * @returns {Object} the created task
   */
  const addTask = useCallback((values) => {
    const task = createTask(values);
    dispatch({ type: TASK_ACTIONS.ADD, payload: { task } });
    return task;
  }, []);

  /**
   * Update the editable fields of an existing task.
   * @param {string} id - task id
   * @param {Object} updates - fields to merge (name, description, dueDate, priority)
   */
  const updateTask = useCallback((id, updates) => {
    dispatch({ type: TASK_ACTIONS.UPDATE, payload: { id, updates } });
  }, []);

  /** Remove a task permanently. @param {string} id - task id */
  const deleteTask = useCallback((id) => {
    dispatch({ type: TASK_ACTIONS.DELETE, payload: { id } });
  }, []);

  /** Toggle the completed flag of a task. @param {string} id - task id */
  const toggleTask = useCallback((id) => {
    dispatch({ type: TASK_ACTIONS.TOGGLE, payload: { id } });
  }, []);

  return { tasks, addTask, updateTask, deleteTask, toggleTask };
}
