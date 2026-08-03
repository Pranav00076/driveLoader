import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { DriveDocument } from '../components/DriveDocument';

describe('DriveDocument Component', () => {
  it('should render document preview container', () => {
    render(<DriveDocument src="https://drive.google.com/file/d/1A2b3C4d5E6f7G8h9I0j/view" />);
    expect(screen.getByText(/Loading Document Preview...|Document Preview/i)).toBeInTheDocument();
  });
});
