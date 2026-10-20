/**
 * TaskList.js
 * -------------------------------------------------------------
 * Renders the (already filtered and sorted) list of tasks as a <ul>.
 * When there is nothing to show it renders a friendly empty-state
 * message that changes depending on the active filter.
 * -------------------------------------------------------------
 */

import TaskItem from './TaskItem';
import { FILTERS } from '../utils/taskUtils';
import './TaskList.css';

/** Empty-state message for each status filter. */
const EMPTY_MESSAGES = {
  [FILTERS.ALL]: 'No tasks yet — add your first task using the form above.',
  [FILTERS.ACTIVE]: 'Nothing in progress — every task is completed. Great job!',
  [FILTERS.COMPLETED]: 'No completed tasks yet. Tick a task off when you finish it!',
};

/**
 * @param {Object} props
 * @param {Array} props.tasks - tasks to display
 * @param {string} props.filter - active status filter (for the empty state)
 * @param {Function} props.onToggle - toggle completed
 * @param {Function} props.onEdit - start editing a task
 * @param {Function} props.onDelete - request deletion of a task
 */
function TaskList({ tasks, filter, onToggle, onEdit, onDelete }) {
  // Nothing to display: show the empty state instead of an empty <ul>.
  if (tasks.length === 0) {
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
      {tasks.map((task) => (
        <TaskItem key={task.id} task={task} onToggle={onToggle} onEdit={onEdit} onDelete={onDelete} />
      ))}
    </ul>
  );
}

export default TaskList;
