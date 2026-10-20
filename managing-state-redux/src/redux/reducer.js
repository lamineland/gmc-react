/**
 * reducer.js
 * -------------------------------------------------------------
 * Pure reducers that own EVERY change to the global state.
 *
 * The store state has this shape:
 *   {
 *     tasks:  [ { id, description, isDone }, ... ],
 *     filter: 'all' | 'done' | 'not'
 *   }
 *
 * A reducer NEVER mutates the previous state: it always returns a
 * new array / value, which makes every transition predictable and
 * trivial to unit-test. State flows one way:
 *   dispatch(action) -> reducer -> store -> UI.
 * -------------------------------------------------------------
 */

import { combineReducers } from 'redux';
import { ADD_TASK, EDIT_TASK, TOGGLE_TASK, SET_FILTER } from './actions';
import { FILTERS } from '../utils/taskUtils';

/**
 * Task list reducer.
 * @param {Array} state - current task list (never mutated)
 * @param {Object} action - { type, payload }
 * @returns {Array} the next task list
 */
export function tasksReducer(state = [], action) {
  switch (action.type) {
    case ADD_TASK:
      // payload is already a complete task: { id, description, isDone }
      return [...state, action.payload];

    case EDIT_TASK:
      // Merge the new description into the matching task only.
      return state.map((task) =>
        task.id === action.payload.id ? { ...task, description: action.payload.description } : task
      );

    case TOGGLE_TASK:
      // Flip the isDone flag of the matching task only.
      return state.map((task) =>
        task.id === action.payload.id ? { ...task, isDone: !task.isDone } : task
      );

    default:
      // Unknown actions leave the state untouched.
      return state;
  }
}

/**
 * Filter reducer.
 * @param {string} state - active filter (never mutated)
 * @param {Object} action - { type, payload }
 * @returns {string} the next filter
 */
export function filterReducer(state = FILTERS.ALL, action) {
  switch (action.type) {
    case SET_FILTER:
      return action.payload.filter;

    default:
      return state;
  }
}

/** Root reducer: combines the two slices into the store state. */
const rootReducer = combineReducers({
  tasks: tasksReducer,
  filter: filterReducer,
});

export default rootReducer;
