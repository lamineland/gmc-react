import { render, screen, fireEvent, act } from '@testing-library/react';
import App from './App';

afterEach(() => {
  jest.useRealTimers();
});

test('starts with the profile hidden behind a show button', () => {
  render(<App />);
  expect(screen.getByRole('button', { name: /show profile/i })).toBeInTheDocument();
  expect(screen.queryByRole('heading', { name: /john doe/i })).not.toBeInTheDocument();
});

test('reveals the profile when the button is clicked', () => {
  render(<App />);
  fireEvent.click(screen.getByRole('button', { name: /show profile/i }));

  expect(screen.getByRole('heading', { name: /john doe/i })).toBeInTheDocument();
  expect(screen.getByText(/a software developer/i)).toBeInTheDocument();
  expect(screen.getByText('Developer')).toBeInTheDocument();
  expect(screen.getByRole('button', { name: /hide profile/i })).toBeInTheDocument();
});

test('hides the profile again when the button is clicked', () => {
  render(<App />);
  fireEvent.click(screen.getByRole('button', { name: /show profile/i }));
  fireEvent.click(screen.getByRole('button', { name: /hide profile/i }));

  expect(screen.queryByRole('heading', { name: /john doe/i })).not.toBeInTheDocument();
  expect(screen.getByRole('button', { name: /show profile/i })).toBeInTheDocument();
});

test('shows the time interval elapsed since the component mounted', () => {
  jest.useFakeTimers();
  render(<App />);

  expect(screen.getByText('Time since mounted')).toBeInTheDocument();
  expect(screen.getByText('00:00')).toBeInTheDocument();

  act(() => {
    jest.advanceTimersByTime(3000);
  });

  expect(screen.getByText('00:03')).toBeInTheDocument();
});

test('clears the interval when the component unmounts', () => {
  jest.useFakeTimers();
  const clearIntervalSpy = jest.spyOn(global, 'clearInterval');
  const { unmount } = render(<App />);

  unmount();

  expect(clearIntervalSpy).toHaveBeenCalled();
  clearIntervalSpy.mockRestore();
});
