/**
 * actions.js
 * -------------------------------------------------------------
 * Action types + action creators for the whole application.
 *
 * Components NEVER build action objects by hand: they import the
 * creators from here and dispatch them with `useDispatch`, so the
 * shape of every action stays in a single, predictable place.
 *
 * Action shape: { type, payload }
 * -------------------------------------------------------------
 */

import { generateId } from '../utils/taskUtils';

/* ------------------------- Action types ------------------------- */
export const ADD_TASK = 'tasks/add';
export const EDIT_TASK = 'tasks/edit';
export const TOGGLE_TASK = 'tasks/toggle';
export const SET_FILTER = 'filter/set';

/* ----------------------- Action creators ------------------------ */

/**
 * Add a new task to the list.
 * The task object ({ id, description, isDone }) is built here so that
 * every task stored in Redux always has exactly the same shape.
 * @param {string} description - text of the new task (trimmed before saving)
 * @returns {Object} action
 */
export const addTask = (description) => ({
  type: ADD_TASK,
  payload: {
    id: generateId(),
    description: description.trim(),
    isDone: false,
  },
});

/**
 * Replace the description of an existing task.
 * @param {string} id - id of the task to edit
 * @param {string} description - new description (trimmed before saving)
 * @returns {Object} action
 */
export const editTask = (id, description) => ({
  type: EDIT_TASK,
  payload: { id, description: description.trim() },
});

/**
 * Flip the isDone flag of a task (done <-> not done).
 * @param {string} id - id of the task to toggle
 * @returns {Object} action
 */
export const toggleTask = (id) => ({
  type: TOGGLE_TASK,
  payload: { id },
});

/**
 * Change the active status filter.
 * @param {string} filter - one of the FILTERS values ('all' | 'done' | 'not')
 * @returns {Object} action
 */
export const setFilter = (filter) => ({
  type: SET_FILTER,
  payload: { filter },
});
