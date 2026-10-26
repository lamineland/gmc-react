import { render, screen } from '@testing-library/react';
import App from './App';

test('renders the users directory heading', () => {
  render(<App />);
  const heading = screen.getByText(/users directory/i);
  expect(heading).toBeInTheDocument();
});

test('renders the list of users fetched from the API', async () => {
  render(<App />);
  const firstUser = await screen.findByText(/leanne graham/i);
  expect(firstUser).toBeInTheDocument();
});
