/**
 * TaskForm.js
 * -------------------------------------------------------------
 * Controlled form used to ADD a new task or EDIT an existing one.
 *
 * - Every keystroke updates local component state (useState).
 * - Validation runs on submit (errors clear as the user types),
 *   so a task can never be added or saved while invalid.
 * - When `editingTask` is provided the fields are pre-filled with the
 *   task details; the same form then saves the changes.
 * -------------------------------------------------------------
 */

import { useEffect, useState } from 'react';
import { PRIORITIES, LIMITS } from '../utils/taskUtils';
import { validateTaskForm, hasErrors } from '../utils/validation';
import './TaskForm.css';

/** Starting values of the form (used for adding and after a reset). */
const EMPTY_FORM = { name: '', description: '', dueDate: '', priority: 'medium' };

/**
 * @param {Object} props
 * @param {Object|null} props.editingTask - task being edited, or null when adding
 * @param {Function} props.onSubmit - receives the validated form values
 * @param {Function} props.onCancelEdit - leaves edit mode and resets the form
 */
function TaskForm({ editingTask, onSubmit, onCancelEdit }) {
  // Form values and validation errors are LOCAL state (UI concerns).
  const [values, setValues] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});

  const isEditing = Boolean(editingTask);
  const editingId = editingTask ? editingTask.id : null;

  /**
   * Keep the form in sync with the task being edited:
   * - entering edit mode pre-fills the fields with the task details,
   * - leaving edit mode (or adding) clears the form back to EMPTY_FORM.
   * The effect only re-runs when the edited task CHANGES (not on every
   * render), so it never wipes out what the user is currently typing.
   */
  useEffect(() => {
    if (editingTask) {
      setValues({
        name: editingTask.name,
        description: editingTask.description,
        dueDate: editingTask.dueDate || '',
        priority: editingTask.priority || 'medium',
      });
    } else {
      setValues(EMPTY_FORM);
    }
    setErrors({});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editingId]);

  /**
   * Generic change handler for every field of the form.
   * It also clears the error of the field being fixed.
   */
  const handleChange = (event) => {
    const { name, value } = event.target;
    setValues((previous) => ({ ...previous, [name]: value }));
    setErrors((previous) => {
      if (!previous[name]) return previous;
      const next = { ...previous };
      delete next[name];
      return next;
    });
  };

  /**
   * Validate, then submit the values to the parent (App).
   * Invalid submissions only update the error state.
   */
  const handleSubmit = (event) => {
    event.preventDefault();

    const validationErrors = validateTaskForm(values);
    setErrors(validationErrors);
    if (hasErrors(validationErrors)) return; // stop: nothing is added or saved

    onSubmit({
      name: values.name.trim(),
      description: values.description.trim(),
      dueDate: values.dueDate || null,
      priority: values.priority,
    });

    // Clear the form after adding. When editing, App clears `editingTask`
    // which resets the fields through the effect above.
    if (!isEditing) setValues(EMPTY_FORM);
  };

  return (
    <section className="task-form-card" aria-labelledby="task-form-heading">
      <h2 id="task-form-heading" className="task-form-card__title">
        {isEditing ? 'Edit task' : 'Add a new task'}
      </h2>

      {/* Banner shown while a task is being edited */}
      {isEditing && (
        <div className="task-form__banner" role="status">
          <span>
            You are editing <strong>“{editingTask.name}”</strong>
          </span>
          <button type="button" className="button button--ghost button--small" onClick={onCancelEdit}>
            Cancel edit
          </button>
        </div>
      )}

      <form className="task-form" onSubmit={handleSubmit} noValidate>
        {/* Task name (required) */}
        <div className="form-field">
          <label className="form-field__label" htmlFor="task-name">
            Task name <span className="form-field__required" aria-hidden="true">*</span>
          </label>
          <input
            id="task-name"
            className="form-field__input"
            type="text"
            name="name"
            value={values.name}
            onChange={handleChange}
            placeholder="e.g. Book a dentist appointment"
            maxLength={LIMITS.name}
            aria-required="true"
            aria-invalid={Boolean(errors.name)}
            aria-describedby={errors.name ? 'task-name-error' : undefined}
          />
          {errors.name && (
            <p id="task-name-error" className="field-error" role="alert">
              {errors.name}
            </p>
          )}
        </div>

        {/* Task description (required) */}
        <div className="form-field">
          <label className="form-field__label" htmlFor="task-description">
            Task description <span className="form-field__required" aria-hidden="true">*</span>
          </label>
          <textarea
            id="task-description"
            className="form-field__input form-field__textarea"
            name="description"
            value={values.description}
            onChange={handleChange}
            placeholder="Add a few details about the task..."
            rows="3"
            maxLength={LIMITS.description}
            aria-required="true"
            aria-invalid={Boolean(errors.description)}
            aria-describedby={errors.description ? 'task-description-error' : undefined}
          />
          {errors.description && (
            <p id="task-description-error" className="field-error" role="alert">
              {errors.description}
            </p>
          )}
        </div>

        {/* Optional extras: due date and priority */}
        <div className="form-field-row">
          <div className="form-field">
            <label className="form-field__label" htmlFor="task-due-date">
              Due date <span className="form-field__optional">(optional)</span>
            </label>
            <input
              id="task-due-date"
              className="form-field__input"
              type="date"
              name="dueDate"
              value={values.dueDate}
              onChange={handleChange}
            />
          </div>

          <div className="form-field">
            <label className="form-field__label" htmlFor="task-priority">
              Priority
            </label>
            <select
              id="task-priority"
              className="form-field__input"
              name="priority"
              value={values.priority}
              onChange={handleChange}
            >
              {PRIORITIES.map((priority) => (
                <option key={priority} value={priority}>
                  {priority.charAt(0).toUpperCase() + priority.slice(1)}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Submit / cancel actions */}
        <div className="form-actions">
          <button type="submit" className="button button--primary">
            {isEditing ? 'Save changes' : 'Add task'}
          </button>
          {isEditing && (
            <button type="button" className="button button--ghost" onClick={onCancelEdit}>
              Cancel
            </button>
          )}
        </div>
      </form>
    </section>
  );
}

export default TaskForm;
