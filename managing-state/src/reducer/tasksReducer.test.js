/**
 * tasksReducer.test.js
 * -------------------------------------------------------------
 * Unit tests for the pure task reducer: every action must return a
 * NEW array and change only what it is supposed to change.
 * -------------------------------------------------------------
 */

import tasksReducer, { TASK_ACTIONS } from './tasksReducer';

const taskA = {
  id: 'a',
  name: 'Task A',
  description: 'First task',
  completed: false,
  createdAt: '2026-01-01T10:00:00.000Z',
};

const taskB = {
  id: 'b',
  name: 'Task B',
  description: 'Second task',
  completed: true,
  createdAt: '2026-01-02T10:00:00.000Z',
};

describe('tasksReducer', () => {
  test('adds a task at the top of the list', () => {
    const next = tasksReducer([taskB], { type: TASK_ACTIONS.ADD, payload: { task: taskA } });
    expect(next).toHaveLength(2);
    expect(next[0]).toBe(taskA);
  });

  test('updates only the matching task and keeps createdAt', () => {
    const next = tasksReducer([taskA, taskB], {
      type: TASK_ACTIONS.UPDATE,
      payload: { id: 'a', updates: { name: 'Renamed task' } },
    });
    expect(next[0].name).toBe('Renamed task');
    expect(next[0].createdAt).toBe(taskA.createdAt);
    expect(next[1]).toBe(taskB);
  });

  test('deletes only the matching task', () => {
    const next = tasksReducer([taskA, taskB], { type: TASK_ACTIONS.DELETE, payload: { id: 'a' } });
    expect(next).toEqual([taskB]);
  });

  test('toggles the completed flag of the matching task', () => {
    const next = tasksReducer([taskA, taskB], { type: TASK_ACTIONS.TOGGLE, payload: { id: 'a' } });
    expect(next[0].completed).toBe(true); // was false -> now true
    expect(next[1].completed).toBe(true); // untouched
  });

  test('never mutates the previous state', () => {
    const previous = [taskA, taskB];
    tasksReducer(previous, { type: TASK_ACTIONS.TOGGLE, payload: { id: 'a' } });
    expect(previous[0].completed).toBe(false); // original object unchanged
  });

  test('returns the same state for unknown actions', () => {
    const previous = [taskA];
    expect(tasksReducer(previous, { type: 'unknown/action' })).toBe(previous);
  });
});
