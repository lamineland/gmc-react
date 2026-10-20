/**
 * App.js
 * -------------------------------------------------------------
 * Root component of the To-Do List application.
 *
 * It is the only place where the pieces are wired together:
 *  - `useTasks()` owns the task LIST state and its persistence,
 *  - App owns the UI state (which task is edited / deleted, the
 *    active filter and the sort option) with useState,
 *  - derived data (visible tasks, counters) is computed with useMemo,
 *  - every handler is passed down to the child components as props,
 *    so state flows one way: App -> components -> callbacks -> App.
 * -------------------------------------------------------------
 */

import { useCallback, useMemo, useState } from 'react';
import './App.css';
import TaskForm from './components/TaskForm';
import TaskList from './components/TaskList';
import TaskFilter from './components/TaskFilter';
import ConfirmDialog from './components/ConfirmDialog';
import useTasks from './hooks/useTasks';
import { FILTERS, SORT_OPTIONS, filterTasks, sortTasks, countTasks } from './utils/taskUtils';

function App() {
  // ---- Task list state + persistence (custom hook) ----
  const { tasks, addTask, updateTask, deleteTask, toggleTask } = useTasks();

  // ---- UI state ----
  const [editingTask, setEditingTask] = useState(null); // task being edited (null = adding)
  const [taskToDelete, setTaskToDelete] = useState(null); // task pending deletion
  const [filter, setFilter] = useState(FILTERS.ALL); // status filter
  const [sortBy, setSortBy] = useState(SORT_OPTIONS.NEWEST); // sort option

  // ---- Derived state (recomputed only when the inputs change) ----
  const counts = useMemo(() => countTasks(tasks), [tasks]);
  const visibleTasks = useMemo(
    () => sortTasks(filterTasks(tasks, filter), sortBy),
    [tasks, filter, sortBy]
  );

  // ---- Handlers ----

  /** Submit the form: add a new task, or save the changes of the edited one. */
  const handleSubmit = (values) => {
    if (editingTask) {
      updateTask(editingTask.id, values);
      setEditingTask(null); // leave edit mode -> the form resets itself
    } else {
      addTask(values);
    }
  };

  /** Open the edit form pre-filled with the clicked task. */
  const handleEdit = (task) => {
    setEditingTask(task);
  };

  /** Leave edit mode without saving. */
  const handleCancelEdit = () => {
    setEditingTask(null);
  };

  /** Ask for confirmation before deleting (opens the dialog). */
  const handleDeleteRequest = (task) => {
    setTaskToDelete(task);
  };

  /** Actually delete the task after the user confirms. */
  const handleConfirmDelete = useCallback(() => {
    if (!taskToDelete) return;
    deleteTask(taskToDelete.id);
    // Never keep editing a task that no longer exists.
    if (editingTask && editingTask.id === taskToDelete.id) {
      setEditingTask(null);
    }
    setTaskToDelete(null);
  }, [taskToDelete, editingTask, deleteTask]);

  /** Close the confirmation dialog without deleting anything. */
  const handleCancelDelete = useCallback(() => {
    setTaskToDelete(null);
  }, []);

  return (
    <div className="app">
      {/* ---------- Header with the live task counters ---------- */}
      <header className="app__header">
        <div className="app__header-inner">
          <div>
            <p className="app__eyebrow">Managing state with React</p>
            <h1 className="app__title">My To-Do List</h1>
            <p className="app__subtitle">
              Add, edit, complete and organise your tasks — saved automatically in your browser.
            </p>
          </div>
          <ul className="app__stats" aria-label="Task summary">
            <li className="stat-chip stat-chip--total">{counts.total} total</li>
            <li className="stat-chip stat-chip--active">{counts.active} active</li>
            <li className="stat-chip stat-chip--completed">{counts.completed} completed</li>
          </ul>
        </div>
      </header>

      {/* ---------- Main content ---------- */}
      <main className="app__layout">
        {/* Form: adds a task, or edits the selected one */}
        <TaskForm editingTask={editingTask} onSubmit={handleSubmit} onCancelEdit={handleCancelEdit} />

        {/* Task panel: toolbar + list */}
        <section className="panel" aria-labelledby="tasks-heading">
          <div className="panel__header">
            <h2 id="tasks-heading" className="panel__title">
              Your tasks
            </h2>
            <TaskFilter
              filter={filter}
              onFilterChange={setFilter}
              sortBy={sortBy}
              onSortChange={setSortBy}
              counts={counts}
            />
          </div>

          <TaskList
            tasks={visibleTasks}
            filter={filter}
            onToggle={toggleTask}
            onEdit={handleEdit}
            onDelete={handleDeleteRequest}
          />
        </section>
      </main>

      {/* ---------- Footer ---------- */}
      <footer className="app__footer">
        <p>
          Tasks are stored in <code>localStorage</code> — they survive page reloads and browser
          restarts on this device.
        </p>
      </footer>

      {/* ---------- Delete confirmation dialog (conditional) ---------- */}
      {taskToDelete && (
        <ConfirmDialog task={taskToDelete} onConfirm={handleConfirmDelete} onCancel={handleCancelDelete} />
      )}
    </div>
  );
}

export default App;
