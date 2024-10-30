import React from 'react';
import { render, screen} from '@testing-library/react';
import Dashboard from '../Dashboard';

test('renders dashboard with task and team lists', () => {
    render(<Dashboard />);

    const heading = screen.getByText(/Task Management Dashboard/i);
    expect(heading).toBeInTheDocument();
});