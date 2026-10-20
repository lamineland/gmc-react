/**
 * reducer.test.js
 * -------------------------------------------------------------
 * Unit tests for the Redux reducers: every action returns the
 * expected next state and never mutates the previous one.
 * -------------------------------------------------------------
 */

import rootReducer, { tasksReducer, filterReducer } from './reducer';
import { addTask, editTask, toggleTask, setFilter } from './actions';
import { FILTERS } from '../utils/taskUtils';

/** Fixed tasks used to build states by hand. */
const TASK_A = { id: 'a', description: 'Learn Redux', isDone: false };
const TASK_B = { id: 'b', description: 'Build a to-do app', isDone: true };

describe('tasksReducer', () => {
  test('starts with an empty task list', () => {
    expect(tasksReducer(undefined, { type: '@@INIT' })).toEqual([]);
  });

  test('ADD_TASK appends a complete task { id, description, isDone }', () => {
    const next = tasksReducer([TASK_A], addTask('  Learn React  '));

    expect(next).toHaveLength(2);
    expect(next[0]).toEqual(TASK_A); // previous tasks untouched
    expect(next[1]).toEqual({ id: next[1].id, description: 'Learn React', isDone: false });
    expect(typeof next[1].id).toBe('string');
    expect(next[1].id).not.toBe('');
  });

  test('EDIT_TASK changes only the description of the matching task', () => {
    const next = tasksReducer([TASK_A, TASK_B], editTask('a', '  Learn plain Redux  '));

    expect(next[0]).toEqual({ id: 'a', description: 'Learn plain Redux', isDone: false });
    expect(next[1]).toEqual(TASK_B); // other task untouched
  });

  test('TOGGLE_TASK flips isDone of the matching task only', () => {
    const next = tasksReducer([TASK_A, TASK_B], toggleTask('a'));

    expect(next[0].isDone).toBe(true);
    expect(next[1].isDone).toBe(true); // other task untouched

    // ...and flips it back
    expect(tasksReducer(next, toggleTask('a'))[0].isDone).toBe(false);
  });

  test('never mutates the previous state', () => {
    const previous = [TASK_A, TASK_B].map((task) => Object.freeze({ ...task }));
    Object.freeze(previous);

    expect(() => tasksReducer(previous, toggleTask('a'))).not.toThrow();
    expect(previous[0].isDone).toBe(false); // frozen state untouched
  });
});

describe('filterReducer', () => {
  test('defaults to "all"', () => {
    expect(filterReducer(undefined, { type: '@@INIT' })).toBe(FILTERS.ALL);
  });

  test('SET_FILTER stores the new filter', () => {
    expect(filterReducer(FILTERS.ALL, setFilter(FILTERS.DONE))).toBe(FILTERS.DONE);
    expect(filterReducer(FILTERS.DONE, setFilter(FILTERS.NOT_DONE))).toBe(FILTERS.NOT_DONE);
  });
});

describe('rootReducer', () => {
  test('shapes the store state as { tasks, filter }', () => {
    const state = rootReducer(undefined, { type: '@@INIT' });
    expect(state).toEqual({ tasks: [], filter: FILTERS.ALL });
  });

  test('handles an add action across both slices', () => {
    const state = rootReducer(undefined, addTask('Ship the checkpoint'));
    expect(state.tasks).toHaveLength(1);
    expect(state.tasks[0].description).toBe('Ship the checkpoint');
    expect(state.filter).toBe(FILTERS.ALL);
  });
});
