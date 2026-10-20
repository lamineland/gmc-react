/**
 * Task.js
 * -------------------------------------------------------------
 * Renders ONE task ({ id, description, isDone }) and its actions:
 *  - checkbox -> mark the task as done / not done (toggleTask)
 *  - Edit     -> edit the description inline (editTask)
 *
 * The component reads nothing from the store: it receives the task
 * as a prop from <ListTask /> and dispatches actions with
 * `useDispatch`. Done tasks are struck through via "task--done".
 * -------------------------------------------------------------
 */

import { useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import { editTask, toggleTask } from '../redux/actions';
import { DESCRIPTION_LIMIT } from '../utils/taskUtils';
import './Task.css';

/**
 * @param {Object} props
 * @param {Object} props.task - task to render { id, description, isDone }
 */
function Task({ task }) {
  const dispatch = useDispatch();

  // LOCAL UI state: whether this task is being edited and the text
  // currently typed. The saved task lives in the Redux store.
  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState(task.description);
  const inputRef = useRef(null);

  // Move the focus into the input as soon as the edit form opens.
  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  // A description can never be saved empty.
  const canSave = draft.trim().length > 0;

  /** Enter edit mode with the current description pre-filled. */
  const handleEdit = () => {
    setDraft(task.description);
    setIsEditing(true);
  };

  /** Save the new description in the store and leave edit mode. */
  const handleSave = (event) => {
    event.preventDefault();
    if (!canSave) return;

    dispatch(editTask(task.id, draft));
    setIsEditing(false);
  };

  /** Leave edit mode without saving: discard what was typed. */
  const handleCancel = () => {
    setDraft(task.description);
    setIsEditing(false);
  };

  return (
    <li className={`task${task.isDone ? ' task--done' : ''}`}>
      {/* Mark the task as done / not done */}
      <input
        type="checkbox"
        className="task__checkbox"
        checked={task.isDone}
        onChange={() => dispatch(toggleTask(task.id))}
        aria-label={`Mark "${task.description}" as ${task.isDone ? 'not done' : 'done'}`}
      />

      {isEditing ? (
        /* ---------- Edit mode: inline form ---------- */
        <form className="task__edit-form" onSubmit={handleSave}>
          <input
            ref={inputRef}
            className="form-field__input"
            type="text"
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            aria-label="Edit task description"
            maxLength={DESCRIPTION_LIMIT}
          />
          <div className="task__actions">
            <button type="submit" className="button button--primary button--small" disabled={!canSave}>
              Save
            </button>
            <button type="button" className="button button--ghost button--small" onClick={handleCancel}>
              Cancel
            </button>
          </div>
        </form>
      ) : (
        /* ---------- Read mode ---------- */
        <>
          <p className="task__description">{task.description}</p>
          <div className="task__actions">
            <button type="button" className="button button--ghost button--small" onClick={handleEdit}>
              Edit
            </button>
          </div>
        </>
      )}
    </li>
  );
}

export default Task;
