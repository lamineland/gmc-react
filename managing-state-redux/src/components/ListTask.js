/**
 * ListTask.js
 * -------------------------------------------------------------
 * Renders the list of tasks from the Redux store.
 *
 * It reads the full task list and the active filter with
 * `useSelector`, derives the visible tasks with filterTasks()
 * (done / not done) and maps them to <Task /> components.
 * When there is nothing to show it renders a friendly empty state.
 * -------------------------------------------------------------
 */

import { useSelector } from 'react-redux';
import Task from './Task';
import { FILTERS, filterTasks } from '../utils/taskUtils';
import './ListTask.css';

/** Empty-state message for each status filter. */
const EMPTY_MESSAGES = {
  [FILTERS.ALL]: 'No tasks yet — add your first task using the form above.',
  [FILTERS.DONE]: 'No completed tasks yet. Tick a task off when you finish it!',
  [FILTERS.NOT_DONE]: 'Nothing to do — every task is done. Great job!',
};

function ListTask() {
  // Global state (Redux): the whole task list and the active filter.
  const tasks = useSelector((state) => state.tasks);
  const filter = useSelector((state) => state.filter);

  // Derived state: only the tasks matching the active filter.
  const visibleTasks = filterTasks(tasks, filter);

  // Nothing to display: show the empty state instead of an empty <ul>.
  if (visibleTasks.length === 0) {
    return (
      <div className="empty-state">
        <span className="empty-state__icon" aria-hidden="true">
          📝
        </span>
        <p className="empty-state__text">{EMPTY_MESSAGES[filter] || EMPTY_MESSAGES[FILTERS.ALL]}</p>
      </div>
    );
  }

  return (
    <ul className="task-list">
      {visibleTasks.map((task) => (
        <Task key={task.id} task={task} />
      ))}
    </ul>
  );
}

export default ListTask;
