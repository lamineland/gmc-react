import { render, screen, fireEvent, within } from '@testing-library/react';
import App from './App';

beforeEach(() => {
  window.localStorage.clear();
});

test('renders the hero and the seeded movies', () => {
  render(<App />);
  expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(/movie library/i);
  expect(screen.getByRole('heading', { name: /inception/i })).toBeInTheDocument();
  expect(screen.getByRole('heading', { name: /the dark knight/i })).toBeInTheDocument();
  expect(screen.getByRole('heading', { name: /interstellar/i })).toBeInTheDocument();
});

test('filters the list when typing in the search box', () => {
  render(<App />);
  fireEvent.change(screen.getByRole('searchbox'), { target: { value: 'dark' } });

  expect(screen.getByRole('heading', { name: /the dark knight/i })).toBeInTheDocument();
  expect(screen.queryByRole('heading', { name: /inception/i })).not.toBeInTheDocument();
  expect(screen.queryByRole('heading', { name: /interstellar/i })).not.toBeInTheDocument();
});

test('sorts movies by rating when "Top rated" is selected', () => {
  render(<App />);
  fireEvent.click(screen.getByRole('button', { name: /top rated/i }));

  const titles = screen.getAllByRole('heading', { level: 3 });
  expect(titles[0]).toHaveTextContent(/the dark knight/i);
  expect(titles[1]).toHaveTextContent(/inception/i);
  expect(titles[titles.length - 1]).toHaveTextContent(/oppenheimer/i);
});

test('sorts movies alphabetically when "A → Z" is selected', () => {
  render(<App />);
  fireEvent.click(screen.getByRole('button', { name: 'A → Z' }));

  const titles = screen.getAllByRole('heading', { level: 3 });
  expect(titles[0]).toHaveTextContent(/dune/i);
  expect(titles[titles.length - 1]).toHaveTextContent(/the dark knight/i);
});

test('adds a movie through the form and persists it', () => {
  render(<App />);
  const form = screen.getByRole('form', { name: /add a movie/i });

  fireEvent.change(within(form).getByLabelText(/title/i), { target: { value: 'Amélie' } });
  fireEvent.change(within(form).getByLabelText(/description/i), {
    target: { value: 'A whimsical romance set in Paris.' },
  });
  fireEvent.change(within(form).getByLabelText(/rating/i), { target: { value: '8.3' } });
  fireEvent.submit(form);

  expect(screen.getByRole('heading', { name: /amélie/i })).toBeInTheDocument();
  expect(screen.getByRole('status')).toHaveTextContent(/amélie/i);

  const saved = JSON.parse(window.localStorage.getItem('cinescope:movies'));
  expect(saved).toHaveLength(7);
  expect(saved[6].title).toBe('Amélie');
  expect(saved[6].rating).toBe(8.3);
});

test('validates required fields before adding a movie', () => {
  render(<App />);
  const seededCount = screen.getAllByRole('heading', { level: 3 }).length;

  fireEvent.submit(screen.getByRole('form', { name: /add a movie/i }));

  expect(screen.getByRole('alert')).toHaveTextContent(/title and description are required/i);
  expect(screen.getAllByRole('heading', { level: 3 })).toHaveLength(seededCount);
});

test('shows an empty state and resets the library', () => {
  render(<App />);
  fireEvent.change(screen.getByRole('searchbox'), { target: { value: 'zzz-no-match' } });

  expect(screen.getByText(/no movies found/i)).toBeInTheDocument();

  fireEvent.click(screen.getByRole('button', { name: /reset library/i }));

  expect(screen.getByRole('heading', { name: /inception/i })).toBeInTheDocument();
  expect(screen.getByRole('searchbox')).toHaveValue('');
});
