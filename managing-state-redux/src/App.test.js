/**
 * App.test.js
 * -------------------------------------------------------------
 * Integration tests for the whole To-Do application (Redux):
 * adding tasks, marking them as done, editing them and filtering
 * the list by done / not done. Every test starts from a brand-new
 * Redux store (see makeStore in src/redux/store.js).
 * -------------------------------------------------------------
 */

import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import App from './App';
import { makeStore } from './redux/store';

/** Render the application with a fresh Redux store. */
function renderApp() {
  const store = makeStore();
  render(
    <Provider store={store}>
      <App />
    </Provider>
  );
  return store;
}

/** Type a description and click "Add task". */
function addTask(description) {
  userEvent.type(screen.getByLabelText(/task description/i), description);
  userEvent.click(screen.getByRole('button', { name: /add task/i }));
}

/** Return the <li> element that renders the given description. */
function getTaskItem(description) {
  return screen.getByText(description).closest('li');
}

describe('To-Do application (Redux)', () => {
  test('renders the heading and an empty state when there are no tasks', () => {
    renderApp();
    expect(screen.getByRole('heading', { name: /my to-do list/i })).toBeInTheDocument();
    expect(screen.getByText(/add your first task/i)).toBeInTheDocument();
  });

  test('adds a new task to the list and to the Redux store', () => {
    const store = renderApp();
    addTask('Learn Redux');

    expect(screen.getByText('Learn Redux')).toBeInTheDocument();

    // The store holds the task with the checkpoint shape: id, description, isDone.
    const [task] = store.getState().tasks;
    expect(task).toEqual({ id: task.id, description: 'Learn Redux', isDone: false });
    expect(typeof task.id).toBe('string');
  });

  test('does not add an empty or blank task', () => {
    renderApp();
    const button = screen.getByRole('button', { name: /add task/i });

    expect(button).toBeDisabled(); // nothing typed yet

    userEvent.type(screen.getByLabelText(/task description/i), '   '); // blanks only
    userEvent.click(button);

    expect(screen.getByText(/add your first task/i)).toBeInTheDocument(); // still empty
  });

  test('marks a task as done and back to not done', () => {
    renderApp();
    addTask('Walk the dog');

    const item = getTaskItem('Walk the dog');
    const checkbox = within(item).getByRole('checkbox');

    expect(item).not.toHaveClass('task--done');
    userEvent.click(checkbox);
    expect(item).toHaveClass('task--done'); // visually distinguished
    expect(checkbox).toBeChecked();

    userEvent.click(checkbox); // toggle back to not done
    expect(item).not.toHaveClass('task--done');
    expect(checkbox).not.toBeChecked();
  });

  test('edits a task and saves the new description', () => {
    renderApp();
    addTask('Old description');

    userEvent.click(screen.getByRole('button', { name: /^edit$/i }));
    const input = screen.getByLabelText(/edit task description/i);
    expect(input).toHaveValue('Old description'); // pre-filled

    userEvent.clear(input);
    userEvent.type(input, 'New description');
    userEvent.click(screen.getByRole('button', { name: /^save$/i }));

    expect(screen.getByText('New description')).toBeInTheDocument();
    expect(screen.queryByText('Old description')).not.toBeInTheDocument();
  });

  test('cancels an edit without saving', () => {
    renderApp();
    addTask('Keep me');

    userEvent.click(screen.getByRole('button', { name: /^edit$/i }));
    const input = screen.getByLabelText(/edit task description/i);
    userEvent.clear(input);
    userEvent.type(input, 'Never saved');
    userEvent.click(screen.getByRole('button', { name: /^cancel$/i }));

    expect(screen.getByText('Keep me')).toBeInTheDocument();
    expect(screen.queryByText('Never saved')).not.toBeInTheDocument();
  });

  test('filters the tasks by done / not done', () => {
    renderApp();
    addTask('Active task');
    addTask('Done task');
    userEvent.click(within(getTaskItem('Done task')).getByRole('checkbox')); // mark as done

    const filters = screen.getByRole('group', { name: /filter tasks by status/i });

    userEvent.click(within(filters).getByRole('button', { name: 'Done' }));
    expect(screen.getByText('Done task')).toBeInTheDocument();
    expect(screen.queryByText('Active task')).not.toBeInTheDocument();

    userEvent.click(within(filters).getByRole('button', { name: 'Not done' }));
    expect(screen.getByText('Active task')).toBeInTheDocument();
    expect(screen.queryByText('Done task')).not.toBeInTheDocument();

    userEvent.click(within(filters).getByRole('button', { name: 'All' }));
    expect(screen.getByText('Active task')).toBeInTheDocument();
    expect(screen.getByText('Done task')).toBeInTheDocument();
  });

  test('shows a filter-specific empty state', () => {
    renderApp();
    addTask('Only active task');

    const filters = screen.getByRole('group', { name: /filter tasks by status/i });
    userEvent.click(within(filters).getByRole('button', { name: 'Done' }));

    expect(screen.getByText(/no completed tasks yet/i)).toBeInTheDocument();
  });
});
