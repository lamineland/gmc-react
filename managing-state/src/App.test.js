/**
 * App.test.js
 * -------------------------------------------------------------
 * Integration tests for the whole To-Do List application:
 * rendering, form validation, adding, editing (via a click on the
 * task), toggling, deleting with confirmation, filtering and
 * persistence in localStorage.
 * -------------------------------------------------------------
 */

import { render, screen, within, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from './App';
import { STORAGE_KEY } from './utils/storage';

/** Fill in and submit the add-task form. */
function addTask(name, description) {
  userEvent.type(screen.getByLabelText(/^task name/i), name);
  userEvent.type(screen.getByLabelText(/^task description/i), description);
  userEvent.click(screen.getByRole('button', { name: /add task/i }));
}

/** Return the <li> element that renders the given task name. */
function getTaskItem(name) {
  return screen.getByText(name).closest('li');
}

beforeEach(() => {
  window.localStorage.clear();
});

describe('To-Do List application', () => {
  test('renders the heading and an empty state when there are no tasks', () => {
    render(<App />);
    expect(screen.getByRole('heading', { name: /my to-do list/i })).toBeInTheDocument();
    expect(screen.getByText(/add your first task/i)).toBeInTheDocument();
  });

  test('shows validation errors and adds nothing when the form is empty', () => {
    render(<App />);
    userEvent.click(screen.getByRole('button', { name: /add task/i }));
    expect(screen.getByText(/task name is required/i)).toBeInTheDocument();
    expect(screen.getByText(/task description is required/i)).toBeInTheDocument();
    expect(screen.getByText(/add your first task/i)).toBeInTheDocument(); // still empty
  });

  test('adds a new task to the list', () => {
    render(<App />);
    addTask('Buy milk', 'Semi-skimmed, two pints');
    expect(getTaskItem('Buy milk')).toBeInTheDocument();
    expect(screen.getByText('Semi-skimmed, two pints')).toBeInTheDocument();
  });

  test('marks a task as completed and back to active', () => {
    render(<App />);
    addTask('Walk the dog', 'Around the park');
    const item = getTaskItem('Walk the dog');
    const checkbox = within(item).getByRole('checkbox');

    expect(item).not.toHaveClass('task-item--completed');
    userEvent.click(checkbox);
    expect(item).toHaveClass('task-item--completed'); // visually distinguished
    expect(checkbox).toBeChecked();

    userEvent.click(checkbox); // toggle back to active
    expect(item).not.toHaveClass('task-item--completed');
  });

  test('edits a task by clicking on it (the form is pre-filled)', () => {
    render(<App />);
    addTask('Old title', 'Old description');

    userEvent.click(screen.getByText('Old title')); // click on the task
    expect(screen.getByLabelText(/^task name/i)).toHaveValue('Old title');
    expect(screen.getByLabelText(/^task description/i)).toHaveValue('Old description');

    userEvent.clear(screen.getByLabelText(/^task name/i));
    userEvent.type(screen.getByLabelText(/^task name/i), 'New title');
    userEvent.click(screen.getByRole('button', { name: /save changes/i }));

    expect(screen.getByText('New title')).toBeInTheDocument();
    expect(screen.queryByText('Old title')).not.toBeInTheDocument();
  });

  test('edits through the Edit button and can be cancelled', () => {
    render(<App />);
    addTask('Task A', 'First task');

    userEvent.click(within(getTaskItem('Task A')).getByRole('button', { name: /^edit$/i }));
    expect(screen.getByLabelText(/^task description/i)).toHaveValue('First task');

    userEvent.click(screen.getByRole('button', { name: /^cancel edit$/i }));
    expect(screen.getByLabelText(/^task name/i)).toHaveValue(''); // form reset
  });

  test('asks for confirmation before deleting a task', () => {
    render(<App />);
    addTask('Temp task', 'Will be deleted');

    userEvent.click(within(getTaskItem('Temp task')).getByRole('button', { name: /^delete$/i }));
    const dialog = screen.getByRole('alertdialog');
    expect(within(dialog).getByText(/are you sure/i)).toBeInTheDocument();

    // Cancelling keeps the task
    userEvent.click(within(dialog).getByRole('button', { name: /^cancel$/i }));
    expect(screen.getByText('Temp task')).toBeInTheDocument();

    // Confirming removes it
    userEvent.click(within(getTaskItem('Temp task')).getByRole('button', { name: /^delete$/i }));
    userEvent.click(within(screen.getByRole('alertdialog')).getByRole('button', { name: /^delete$/i }));
    expect(screen.queryByText('Temp task')).not.toBeInTheDocument();
  });

  test('filters tasks by status', () => {
    render(<App />);
    addTask('Active task', 'Still to do');
    addTask('Done task', 'Already finished');
    userEvent.click(within(getTaskItem('Done task')).getByRole('checkbox'));

    const filters = screen.getByRole('group', { name: /filter tasks by status/i });

    userEvent.click(within(filters).getByRole('button', { name: /completed/i }));
    expect(screen.getByText('Done task')).toBeInTheDocument();
    expect(screen.queryByText('Active task')).not.toBeInTheDocument();

    userEvent.click(within(filters).getByRole('button', { name: /^active/i }));
    expect(screen.getByText('Active task')).toBeInTheDocument();
    expect(screen.queryByText('Done task')).not.toBeInTheDocument();
  });

  test('shows an overdue badge for tasks past their due date', () => {
    render(<App />);
    userEvent.type(screen.getByLabelText(/^task name/i), 'Pay rent');
    userEvent.type(screen.getByLabelText(/^task description/i), 'Transfer to the landlord');
    fireEvent.change(screen.getByLabelText(/^due date/i), { target: { value: '2020-01-01' } });
    userEvent.click(screen.getByRole('button', { name: /add task/i }));
    expect(screen.getByText(/^overdue/i)).toBeInTheDocument();
  });

  test('persists tasks in localStorage between sessions', () => {
    const { unmount } = render(<App />);
    addTask('Persistent task', 'Saved to localStorage');

    const stored = JSON.parse(window.localStorage.getItem(STORAGE_KEY));
    expect(stored).toHaveLength(1);
    expect(stored[0].name).toBe('Persistent task');

    unmount();
    render(<App />); // simulate a new session
    expect(screen.getByText('Persistent task')).toBeInTheDocument();
    expect(screen.getByLabelText(/^task name/i)).toHaveValue(''); // form starts clean
  });
});
