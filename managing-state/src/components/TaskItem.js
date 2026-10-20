/**
 * TaskItem.js
 * -------------------------------------------------------------
 * Renders ONE task with all of its actions:
 *  - checkbox  -> mark the task as completed / active
 *  - click on the task body (or the Edit button) -> edit the task
 *  - Delete button -> ask for confirmation before removing it
 *
 * Completed tasks are visually distinguished via the
 * "task-item--completed" class (strikethrough + muted colours).
 * -------------------------------------------------------------
 */

import { isOverdue, formatDueDate, formatShortDate } from '../utils/taskUtils';
import './TaskItem.css';

/**
 * @param {Object} props
 * @param {Object} props.task - task to render
 * @param {Function} props.onToggle - toggle completed (receives the id)
 * @param {Function} props.onEdit - start editing (receives the task)
 * @param {Function} props.onDelete - request deletion (receives the task)
 */
function TaskItem({ task, onToggle, onEdit, onDelete }) {
  const overdue = isOverdue(task);

  // The task body behaves like a button: Enter / Space also open the
  // edit form, so the "click on the task to edit" behaviour is keyboard
  // accessible too.
  const handleEditKeyDown = (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      onEdit(task);
    }
  };

  return (
    <li className={`task-item${task.completed ? ' task-item--completed' : ''}`}>
      {/* Mark as completed / active */}
      <input
        type="checkbox"
        className="task-item__checkbox"
        checked={task.completed}
        onChange={() => onToggle(task.id)}
        aria-label={`Mark "${task.name}" as ${task.completed ? 'active' : 'completed'}`}
      />

      {/* Task body: clicking here opens the edit form (see handleEditKeyDown) */}
      <div
        className="task-item__content"
        role="button"
        tabIndex={0}
        title="Click to edit this task"
        onClick={() => onEdit(task)}
        onKeyDown={handleEditKeyDown}
      >
        <h3 className="task-item__name">{task.name}</h3>
        <p className="task-item__description">{task.description}</p>

        {/* Meta information: priority, due date, creation date */}
        <div className="task-item__meta">
          <span className={`badge badge--priority-${task.priority}`}>{task.priority} priority</span>
          {task.dueDate && (
            <span className={`badge ${overdue ? 'badge--overdue' : 'badge--due'}`}>
              {overdue ? 'Overdue · ' : 'Due '}
              {formatDueDate(task.dueDate)}
            </span>
          )}
          <span className="task-item__created">Added {formatShortDate(task.createdAt)}</span>
        </div>
      </div>

      {/* Explicit actions */}
      <div className="task-item__actions">
        <button type="button" className="button button--ghost button--small" onClick={() => onEdit(task)}>
          Edit
        </button>
        <button type="button" className="button button--danger button--small" onClick={() => onDelete(task)}>
          Delete
        </button>
      </div>
    </li>
  );
}

export default TaskItem;
