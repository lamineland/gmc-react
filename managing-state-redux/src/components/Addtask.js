/**
 * Addtask.js
 * -------------------------------------------------------------
 * Form used to ADD a new task to the list.
 *
 * - The input value is LOCAL component state (a UI concern).
 * - The task itself lives in the Redux store: on submit the form
 *   dispatches addTask(description) and clears itself.
 * -------------------------------------------------------------
 */

import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { addTask } from '../redux/actions';
import { DESCRIPTION_LIMIT } from '../utils/taskUtils';
import './Addtask.css';

function Addtask() {
  const dispatch = useDispatch();

  // The text being typed is local UI state.
  const [description, setDescription] = useState('');

  // A task must have a real (non-blank) description.
  const canAdd = description.trim().length > 0;

  /** Dispatch the new task, then reset the form for the next one. */
  const handleSubmit = (event) => {
    event.preventDefault();
    if (!canAdd) return;

    dispatch(addTask(description));
    setDescription('');
  };

  return (
    <section className="add-task" aria-labelledby="add-task-heading">
      <h2 id="add-task-heading" className="add-task__title">
        Add a new task
      </h2>

      <form className="add-task__form" onSubmit={handleSubmit}>
        <div className="form-field">
          <label className="form-field__label" htmlFor="task-description">
            Task description
          </label>
          <input
            id="task-description"
            className="form-field__input"
            type="text"
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            placeholder="e.g. Learn Redux reducers"
            maxLength={DESCRIPTION_LIMIT}
            required
          />
        </div>

        <button type="submit" className="button button--primary" disabled={!canAdd}>
          Add task
        </button>
      </form>
    </section>
  );
}

export default Addtask;
