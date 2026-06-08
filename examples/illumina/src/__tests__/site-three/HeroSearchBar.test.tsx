import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';

jest.mock('lucide-react', () => ({
  MapPin: () => <span data-testid="icon-map-pin" />,
  ChevronDown: () => <span data-testid="icon-chevron-down" />,
}));

jest.mock('@/components/ui/select', () => ({
  Select: ({ children, value, onValueChange }: { children: React.ReactNode; value?: string; onValueChange?: (value: string) => void }) => (
    <div data-testid="select-container" data-value={value}>
      <select
        aria-label="Select a market"
        value={value}
        onChange={(event) => onValueChange?.(event.target.value)}
      >
        {children}
      </select>
    </div>
  ),
  SelectContent: ({ children }: { children: React.ReactNode }) => children,
  SelectItem: ({ children, value }: { children: React.ReactNode; value: string }) => (
    <option value={value}>{children}</option>
  ),
  SelectTrigger: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  SelectValue: ({ placeholder }: { placeholder?: string }) => <span>{placeholder}</span>,
}));

import { HeroSearchBar } from '@/components/site-three/HeroSearchBar';

describe('HeroSearchBar', () => {
  it('renders headline and search button', () => {
    render(<HeroSearchBar />);

    expect(screen.getByText(/Find Your New/i)).toBeInTheDocument();
    expect(screen.getByText('Dream Home')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Search' })).toBeInTheDocument();
  });

  it('calls onSearch with the selected market slug', () => {
    const onSearch = jest.fn();
    render(<HeroSearchBar onSearch={onSearch} />);

    fireEvent.click(screen.getByRole('button', { name: 'Search' }));

    expect(onSearch).toHaveBeenCalledWith('atlanta');
  });
});
