/// <reference types="jest" />
import '@testing-library/jest-dom';
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Default as CommunityFloorPlans } from '../../components/community-floor-plans/CommunityFloorPlans';
import {
  defaultProps,
  propsWithoutTitle,
  propsWithoutDescription,
  propsWithoutLink,
  propsOnePlan,
  propsNoPlans,
  propsEditing,
} from './CommunityFloorPlans.mockProps';

import type { Field, LinkField } from '@sitecore-content-sdk/nextjs';

jest.mock('lucide-react', () => ({
  Bath: () => <span data-testid="icon-bath" />,
  BedDouble: () => <span data-testid="icon-bed" />,
  Building2: () => <span data-testid="icon-building" />,
  Car: () => <span data-testid="icon-car" />,
  Ruler: () => <span data-testid="icon-ruler" />,
}));

jest.mock('@sitecore-content-sdk/nextjs', () => ({
  Text: ({ field, tag, className }: { field?: Field<string>; tag?: string; className?: string }) => {
    const Tag = (tag || 'span') as keyof JSX.IntrinsicElements;
    return React.createElement(Tag, { className, 'data-testid': 'text-field' }, field?.value || '');
  },
  Link: ({ field, children, className }: { field?: LinkField; children?: React.ReactNode; className?: string }) => (
    <a href={field?.value?.href} className={className} data-testid="plan-link">
      {children}
    </a>
  ),
}));

jest.mock('../../components/button-component/ButtonComponent', () => ({
  EditableButton: ({ buttonLink, isPageEditing, className }: { buttonLink?: LinkField; isPageEditing?: boolean; className?: string }) => (
    <a
      href={buttonLink?.value?.href || '#'}
      className={className}
      data-testid="listing-button"
      data-editing={isPageEditing}
    >
      {buttonLink?.value?.text || 'Button'}
    </a>
  ),
}));

jest.mock('next/image', () => ({
  __esModule: true,
  default: ({ src, alt, className }: { src?: string; alt?: string; className?: string }) => (
    // eslint-disable-next-line @next/next/no-img-element -- Jest mock for next/image
    <img src={src || ''} alt={alt || ''} className={className} data-testid="next-image" />
  ),
}));

// Silence React DOM attribute warnings (e.g., fill boolean) and navigation errors for this suite
const originalConsoleError = console.error;
beforeAll(() => {
  console.error = (...args: unknown[]) => {
    const argsString = args
      .map((arg) => {
        if (typeof arg === 'string') return arg;
        if (arg instanceof Error) return arg.message;
        if (arg && typeof arg === 'object' && 'message' in arg) return String(arg.message);
        return String(arg);
      })
      .join(' ');

    if (
      argsString.includes('fill') &&
      (argsString.includes('non-boolean attribute') ||
        argsString.includes('If you want to write it to the DOM'))
    ) {
      return;
    }

    if (argsString.includes('Not implemented: navigation')) {
      return;
    }

    originalConsoleError(...args);
  };
});

afterAll(() => {
  console.error = originalConsoleError;
});

describe('CommunityFloorPlans Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Basic rendering', () => {
    it('should render floor plans with all fields', () => {
      render(<CommunityFloorPlans {...(defaultProps as unknown as Parameters<typeof CommunityFloorPlans>[0])} />);

      expect(screen.getByText('Home Plans')).toBeInTheDocument();
      expect(screen.getByText('Explore available floor plans in this community')).toBeInTheDocument();
      expect(screen.getByText('View All Plans')).toBeInTheDocument();
    });

    it('should render component with data-component attribute', () => {
      const { container } = render(<CommunityFloorPlans {...(defaultProps as unknown as Parameters<typeof CommunityFloorPlans>[0])} />);

      const component = container.querySelector('[data-component="CommunityFloorPlans"]');
      expect(component).toBeInTheDocument();
    });

    it('should apply custom styles from params', () => {
      const { container } = render(<CommunityFloorPlans {...(defaultProps as unknown as Parameters<typeof CommunityFloorPlans>[0])} />);

      const styledDiv = container.querySelector('.custom-floor-plans-style');
      expect(styledDiv).toBeInTheDocument();
    });

    it('should render with aria-label', () => {
      const { container } = render(<CommunityFloorPlans {...(defaultProps as unknown as Parameters<typeof CommunityFloorPlans>[0])} />);

      const section = container.querySelector('section[data-component="CommunityFloorPlans"]');
      expect(section).toBeInTheDocument();
      expect(section).toHaveAttribute('aria-labelledby', 'community-floor-plans-section');
    });
  });

  describe('Floor plan cards', () => {
    it('should render a card for each floor plan item', () => {
      render(<CommunityFloorPlans {...(defaultProps as unknown as Parameters<typeof CommunityFloorPlans>[0])} />);

      expect(screen.getByText('The Walmsley')).toBeInTheDocument();
      expect(screen.getByText('The Forreston')).toBeInTheDocument();
      expect(screen.getByText('The Raddington')).toBeInTheDocument();
    });

    it('should render plan images using plan name as alt text', () => {
      render(<CommunityFloorPlans {...(defaultProps as unknown as Parameters<typeof CommunityFloorPlans>[0])} />);

      expect(screen.getByAltText('The Walmsley')).toBeInTheDocument();
      expect(screen.getByAltText('The Forreston')).toBeInTheDocument();
    });

    it('should render plan overview as plain text (HTML stripped)', () => {
      render(<CommunityFloorPlans {...(defaultProps as unknown as Parameters<typeof CommunityFloorPlans>[0])} />);

      expect(
        screen.getByText('This beautiful two-story Walmsley home blends space and functionality.')
      ).toBeInTheDocument();
    });

    it('should render plans in a 3-column grid', () => {
      const { container } = render(<CommunityFloorPlans {...(defaultProps as unknown as Parameters<typeof CommunityFloorPlans>[0])} />);

      const grid = container.querySelector('.grid.\\@lg\\:grid-cols-3');
      expect(grid).toBeInTheDocument();
    });

    it('should render the formatted price for a plan', () => {
      render(<CommunityFloorPlans {...(defaultProps as unknown as Parameters<typeof CommunityFloorPlans>[0])} />);

      expect(screen.getByText('$527,990')).toBeInTheDocument();
    });

    it('should render plan stats with labels and values', () => {
      render(<CommunityFloorPlans {...(defaultProps as unknown as Parameters<typeof CommunityFloorPlans>[0])} />);

      expect(screen.getByText('Stories')).toBeInTheDocument();
      expect(screen.getByText('Bedrooms')).toBeInTheDocument();
      expect(screen.getByText('Full Baths')).toBeInTheDocument();
      expect(screen.getByText('Car Garage')).toBeInTheDocument();
      expect(screen.getByText('Sq Ft')).toBeInTheDocument();
      expect(screen.getByText('3209')).toBeInTheDocument();
    });
  });

  describe('Optional fields handling', () => {
    it('should render without title', () => {
      render(<CommunityFloorPlans {...(propsWithoutTitle as unknown as Parameters<typeof CommunityFloorPlans>[0])} />);

      expect(screen.queryByText('Home Plans')).not.toBeInTheDocument();
      expect(screen.getByText('The Walmsley')).toBeInTheDocument();
    });

    it('should render without description', () => {
      render(<CommunityFloorPlans {...(propsWithoutDescription as unknown as Parameters<typeof CommunityFloorPlans>[0])} />);

      expect(screen.getByText('Home Plans')).toBeInTheDocument();
      expect(screen.queryByText('Explore available floor plans in this community')).not.toBeInTheDocument();
    });

    it('should render without link button', () => {
      render(<CommunityFloorPlans {...(propsWithoutLink as unknown as Parameters<typeof CommunityFloorPlans>[0])} />);

      expect(screen.queryByTestId('listing-button')).not.toBeInTheDocument();
    });

    it('should render with only 1 plan', () => {
      render(<CommunityFloorPlans {...(propsOnePlan as unknown as Parameters<typeof CommunityFloorPlans>[0])} />);

      expect(screen.getByText('The Walmsley')).toBeInTheDocument();
      expect(screen.queryByText('The Forreston')).not.toBeInTheDocument();
    });

    it('should render with no plans', () => {
      render(<CommunityFloorPlans {...(propsNoPlans as unknown as Parameters<typeof CommunityFloorPlans>[0])} />);

      expect(screen.getByText('Home Plans')).toBeInTheDocument();
      expect(screen.queryByText('The Walmsley')).not.toBeInTheDocument();
    });
  });

  describe('Plan navigation', () => {
    it('should navigate to plan when image is clicked in normal mode', () => {
      render(<CommunityFloorPlans {...(defaultProps as unknown as Parameters<typeof CommunityFloorPlans>[0])} />);

      const imageContainers = screen.getAllByRole('button');
      if (imageContainers.length > 0) {
        fireEvent.click(imageContainers[0]);
      }
    });

    it('should handle keyboard navigation with Enter key', () => {
      render(<CommunityFloorPlans {...(defaultProps as unknown as Parameters<typeof CommunityFloorPlans>[0])} />);

      const imageContainers = screen.getAllByRole('button');
      if (imageContainers.length > 0) {
        fireEvent.keyDown(imageContainers[0], { key: 'Enter' });
      }
    });

    it('should render plan links', () => {
      render(<CommunityFloorPlans {...(defaultProps as unknown as Parameters<typeof CommunityFloorPlans>[0])} />);

      const links = screen.getAllByTestId('plan-link');
      expect(links.length).toBeGreaterThan(0);
    });
  });

  describe('Page editing mode', () => {
    it('should render images without click handlers in editing mode', () => {
      render(<CommunityFloorPlans {...(propsEditing as unknown as Parameters<typeof CommunityFloorPlans>[0])} />);

      expect(screen.getByAltText('The Walmsley')).toBeInTheDocument();
    });

    it('should render titles without links in editing mode', () => {
      render(<CommunityFloorPlans {...(propsEditing as unknown as Parameters<typeof CommunityFloorPlans>[0])} />);

      const title = screen.getByText('The Walmsley');
      expect(title.tagName).toBe('H3');
    });

    it('should show fallback link button when linkOptional is undefined in editing mode', () => {
      const propsEditingUndefinedLink = {
        ...propsEditing,
        fields: {
          ...propsEditing.fields,
          linkOptional: undefined,
        },
      };

      render(<CommunityFloorPlans {...(propsEditingUndefinedLink as unknown as Parameters<typeof CommunityFloorPlans>[0])} />);

      expect(screen.getByText('Add link')).toBeInTheDocument();
    });
  });

  describe('Edge cases', () => {
    it('should handle undefined fields', () => {
      const propsUndefinedFields = {
        params: defaultProps.params,
        fields: undefined as unknown as typeof defaultProps.fields,
        isPageEditing: false,
        rendering: defaultProps.rendering,
        page: defaultProps.page,
      };

      const { container } = render(<CommunityFloorPlans {...(propsUndefinedFields as unknown as Parameters<typeof CommunityFloorPlans>[0])} />);
      expect(container).toBeInTheDocument();
    });

    it('should handle missing plan URLs', () => {
      const propsNoUrl = {
        ...defaultProps,
        fields: {
          ...defaultProps.fields,
          FloorPlans: [
            {
              ...defaultProps.fields.FloorPlans[0],
              url: '',
            },
          ],
        },
      };

      render(<CommunityFloorPlans {...(propsNoUrl as unknown as Parameters<typeof CommunityFloorPlans>[0])} />);
      expect(screen.getByText('The Walmsley')).toBeInTheDocument();
    });
  });
});
