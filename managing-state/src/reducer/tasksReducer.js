/**
 * tasksReducer.js
 * -------------------------------------------------------------
 * Pure reducer that owns EVERY change to the task list.
 * Using useReducer (instead of several useState calls) keeps the
 * state transitions predictable and trivial to unit-test: the
 * reducer never mutates the previous state, it always returns a new
 * array. State flows one way: dispatch(action) -> reducer -> UI.
 * -------------------------------------------------------------
 */

/** Every action the task list understands. */
export const TASK_ACTIONS = {
  ADD: 'tasks/add',
  UPDATE: 'tasks/update',
  DELETE: 'tasks/delete',
  TOGGLE: 'tasks/toggle',
};

/**
 * Reduce the task list for a given action.
 * @param {Array} tasks - current task list (never mutated)
 * @param {Object} action - { type, payload }
 * @returns {Array} the next task list
 */
export default function tasksReducer(tasks, action) {
  switch (action.type) {
    case TASK_ACTIONS.ADD:
      // Newest tasks first so the list reads naturally.
      return [action.payload.task, ...tasks];

    case TASK_ACTIONS.UPDATE:
      // Merge the edited fields into the matching task only.
      return tasks.map((task) =>
        task.id === action.payload.id ? { ...task, ...action.payload.updates } : task
      );

    case TASK_ACTIONS.DELETE:
      // Keep every task except the deleted one.
      return tasks.filter((task) => task.id !== action.payload.id);

    case TASK_ACTIONS.TOGGLE:
      // Flip the completed flag of the matching task only.
      return tasks.map((task) =>
        task.id === action.payload.id ? { ...task, completed: !task.completed } : task
      );

    default:
      // Unknown actions leave the state untouched.
      return tasks;
  }
}
