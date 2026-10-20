/**
 * App.js
 * -------------------------------------------------------------
 * Root component of the To-Do application.
 *
 * The GLOBAL state (the task list and the active filter) lives in
 * the Redux store (see src/redux/). App only composes the pieces:
 *  - <Addtask /> -> adds a new task (dispatches addTask)
 *  - filter bar  -> shows done / not done tasks (dispatches setFilter)
 *  - <ListTask />-> renders the filtered tasks from the store
 *
 * The counters in the header are derived from the store with
 * `useSelector`. State flows one way:
 *   component -> dispatch(action) -> reducer -> store -> UI.
 * -------------------------------------------------------------
 */

import { useDispatch, useSelector } from 'react-redux';
import './App.css';
import Addtask from './components/Addtask';
import ListTask from './components/ListTask';
import { setFilter } from './redux/actions';
import { FILTERS, countTasks } from './utils/taskUtils';

/** Buttons of the "done / not done" filter. */
const FILTER_OPTIONS = [
  { value: FILTERS.ALL, label: 'All' },
  { value: FILTERS.DONE, label: 'Done' },
  { value: FILTERS.NOT_DONE, label: 'Not done' },
];

function App() {
  // Read the global state...
  const tasks = useSelector((state) => state.tasks);
  const filter = useSelector((state) => state.filter);
  // ...and derive the live counters from it.
  const counts = countTasks(tasks);

  const dispatch = useDispatch();

  return (
    <div className="app">
      {/* ---------- Header with the live task counters ---------- */}
      <header className="app__header">
        <div className="app__header-inner">
          <div>
            <p className="app__eyebrow">Managing state with Redux</p>
            <h1 className="app__title">My To-Do List</h1>
            <p className="app__subtitle">
              Add, complete, edit and filter your tasks — the whole state is managed in one Redux
              store.
            </p>
          </div>
          <ul className="app__stats" aria-label="Task summary">
            <li className="stat-chip stat-chip--total">{counts.total} total</li>
            <li className="stat-chip stat-chip--active">{counts.notDone} not done</li>
            <li className="stat-chip stat-chip--completed">{counts.done} done</li>
          </ul>
        </div>
      </header>

      {/* ---------- Main content ---------- */}
      <main className="app__layout">
        {/* Form: adds a new task to the store */}
        <Addtask />

        {/* Task panel: filter toolbar + list read from the store */}
        <section className="panel" aria-labelledby="tasks-heading">
          <div className="panel__header">
            <h2 id="tasks-heading" className="panel__title">
              Your tasks
            </h2>

            {/* Filter the tasks by (done / not done) */}
            <div className="filter-group" role="group" aria-label="Filter tasks by status">
              {FILTER_OPTIONS.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  className={`filter-button${filter === option.value ? ' filter-button--active' : ''}`}
                  aria-pressed={filter === option.value}
                  onClick={() => dispatch(setFilter(option.value))}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          <ListTask />
        </section>
      </main>

      {/* ---------- Footer ---------- */}
      <footer className="app__footer">
        <p>
          The whole app state lives in a single <code>Redux</code> store — components read it with{' '}
          <code>useSelector</code> and change it with <code>useDispatch</code>.
        </p>
      </footer>
    </div>
  );
}

export default App;
