import React from 'react';
import { render, screen} from '@testing-library/react';
import App from '../App';

test('renders app with dashboard', () => {
  render(<App />);

  const dashboard = screen.getByText(/Task Management Dashboard/i);
  expect(dashboard).toBeInTheDocument();
});