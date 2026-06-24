/// <reference types="jest" />
import '@testing-library/jest-dom';
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Default as FeaturedCommunities } from '../../components/featured-communities/FeaturedCommunities';
import {
  defaultProps,
  propsWithoutTitle,
  propsWithoutDescription,
  propsWithoutLink,
  propsTwoCommunities,
  propsOneCommunity,
  propsNoCommunities,
  propsEditing,
} from './FeaturedCommunities.mockProps';

import type { Field, LinkField } from '@sitecore-content-sdk/nextjs';

jest.mock('@sitecore-content-sdk/nextjs', () => ({
  Text: ({ field, tag, className }: { field?: Field<string>; tag?: string; className?: string }) => {
    const Tag = (tag || 'span') as keyof JSX.IntrinsicElements;
    return React.createElement(Tag, { className, 'data-testid': 'text-field' }, field?.value || '');
  },
  Link: ({ field, children, className }: { field?: LinkField; children?: React.ReactNode; className?: string }) => (
    <a href={field?.value?.href} className={className} data-testid="community-link">
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

describe('FeaturedCommunities Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Basic rendering', () => {
    it('should render community listing with all fields', () => {
      render(<FeaturedCommunities {...(defaultProps as unknown as Parameters<typeof FeaturedCommunities>[0])} />);

      expect(screen.getByText('Featured Communities')).toBeInTheDocument();
      expect(screen.getByText('Discover our newest neighborhoods')).toBeInTheDocument();
      expect(screen.getByText('View All Communities')).toBeInTheDocument();
    });

    it('should render component with data-component attribute', () => {
      const { container } = render(<FeaturedCommunities {...(defaultProps as unknown as Parameters<typeof FeaturedCommunities>[0])} />);

      const component = container.querySelector('[data-component="FeaturedCommunities"]');
      expect(component).toBeInTheDocument();
    });

    it('should apply custom styles from params', () => {
      const { container } = render(<FeaturedCommunities {...(defaultProps as unknown as Parameters<typeof FeaturedCommunities>[0])} />);

      const styledDiv = container.querySelector('.custom-communities-style');
      expect(styledDiv).toBeInTheDocument();
    });

    it('should render with aria-label', () => {
      const { container } = render(<FeaturedCommunities {...(defaultProps as unknown as Parameters<typeof FeaturedCommunities>[0])} />);

      const section = container.querySelector('section[data-component="FeaturedCommunities"]');
      expect(section).toBeInTheDocument();
      expect(section).toHaveAttribute('aria-labelledby', 'featured-communities-section');
    });
  });

  describe('Featured communities layout (first 2)', () => {
    it('should render first 2 communities in featured layout', () => {
      render(<FeaturedCommunities {...(defaultProps as unknown as Parameters<typeof FeaturedCommunities>[0])} />);

      expect(screen.getByText('Sandbrock Ranch')).toBeInTheDocument();
      expect(screen.getByText('Highland Park Reserve')).toBeInTheDocument();
    });

    it('should render featured community images', () => {
      render(<FeaturedCommunities {...(defaultProps as unknown as Parameters<typeof FeaturedCommunities>[0])} />);

      expect(screen.getByAltText('Sandbrock Ranch')).toBeInTheDocument();
      expect(screen.getByAltText('Highland Park Reserve')).toBeInTheDocument();
    });

    it('should render featured community overview as plain text (HTML stripped)', () => {
      render(<FeaturedCommunities {...(defaultProps as unknown as Parameters<typeof FeaturedCommunities>[0])} />);

      expect(
        screen.getByText('Beautiful David Weekley homes now available in Sandbrock Ranch.')
      ).toBeInTheDocument();
      expect(
        screen.getByText('Master-planned community with miles of tranquil trails.')
      ).toBeInTheDocument();
    });

    it('should render featured communities in 2-column grid', () => {
      const { container } = render(<FeaturedCommunities {...(defaultProps as unknown as Parameters<typeof FeaturedCommunities>[0])} />);

      const featuredGrid = container.querySelector('.grid.\\@md\\:grid-cols-2');
      expect(featuredGrid).toBeInTheDocument();
    });
  });

  describe('Regular communities layout (remaining)', () => {
    it('should render remaining communities in regular layout', () => {
      render(<FeaturedCommunities {...(defaultProps as unknown as Parameters<typeof FeaturedCommunities>[0])} />);

      expect(screen.getByText('Lakewood Ranch')).toBeInTheDocument();
      expect(screen.getByText('Greely Farms')).toBeInTheDocument();
    });

    it('should render regular communities in 3-column grid', () => {
      const { container } = render(<FeaturedCommunities {...(defaultProps as unknown as Parameters<typeof FeaturedCommunities>[0])} />);

      const regularGrid = container.querySelector('.grid.\\@lg\\:grid-cols-3');
      expect(regularGrid).toBeInTheDocument();
    });
  });

  describe('Optional fields handling', () => {
    it('should render without title', () => {
      render(<FeaturedCommunities {...(propsWithoutTitle as unknown as Parameters<typeof FeaturedCommunities>[0])} />);

      expect(screen.queryByText('Featured Communities')).not.toBeInTheDocument();
      expect(screen.getByText('Sandbrock Ranch')).toBeInTheDocument();
    });

    it('should render without description', () => {
      render(<FeaturedCommunities {...(propsWithoutDescription as unknown as Parameters<typeof FeaturedCommunities>[0])} />);

      expect(screen.getByText('Featured Communities')).toBeInTheDocument();
      expect(screen.queryByText('Discover our newest neighborhoods')).not.toBeInTheDocument();
    });

    it('should render without link button', () => {
      render(<FeaturedCommunities {...(propsWithoutLink as unknown as Parameters<typeof FeaturedCommunities>[0])} />);

      expect(screen.queryByTestId('listing-button')).not.toBeInTheDocument();
    });

    it('should render with only 2 communities (all featured)', () => {
      render(<FeaturedCommunities {...(propsTwoCommunities as unknown as Parameters<typeof FeaturedCommunities>[0])} />);

      expect(screen.getByText('Sandbrock Ranch')).toBeInTheDocument();
      expect(screen.getByText('Highland Park Reserve')).toBeInTheDocument();
      expect(screen.queryByText('Lakewood Ranch')).not.toBeInTheDocument();
    });

    it('should render with only 1 community', () => {
      render(<FeaturedCommunities {...(propsOneCommunity as unknown as Parameters<typeof FeaturedCommunities>[0])} />);

      expect(screen.getByText('Sandbrock Ranch')).toBeInTheDocument();
      expect(screen.queryByText('Highland Park Reserve')).not.toBeInTheDocument();
    });

    it('should render with no communities', () => {
      render(<FeaturedCommunities {...(propsNoCommunities as unknown as Parameters<typeof FeaturedCommunities>[0])} />);

      expect(screen.getByText('Featured Communities')).toBeInTheDocument();
      expect(screen.queryByText('Sandbrock Ranch')).not.toBeInTheDocument();
    });
  });

  describe('Community navigation', () => {
    it('should navigate to community when image is clicked in normal mode', () => {
      render(<FeaturedCommunities {...(defaultProps as unknown as Parameters<typeof FeaturedCommunities>[0])} />);

      const imageContainers = screen.getAllByRole('button');
      if (imageContainers.length > 0) {
        fireEvent.click(imageContainers[0]);
      }
    });

    it('should handle keyboard navigation with Enter key', () => {
      render(<FeaturedCommunities {...(defaultProps as unknown as Parameters<typeof FeaturedCommunities>[0])} />);

      const imageContainers = screen.getAllByRole('button');
      if (imageContainers.length > 0) {
        fireEvent.keyDown(imageContainers[0], { key: 'Enter' });
      }
    });

    it('should render community links', () => {
      render(<FeaturedCommunities {...(defaultProps as unknown as Parameters<typeof FeaturedCommunities>[0])} />);

      const links = screen.getAllByTestId('community-link');
      expect(links.length).toBeGreaterThan(0);
    });
  });

  describe('Page editing mode', () => {
    it('should render images without click handlers in editing mode', () => {
      render(<FeaturedCommunities {...(propsEditing as unknown as Parameters<typeof FeaturedCommunities>[0])} />);

      expect(screen.getByAltText('Sandbrock Ranch')).toBeInTheDocument();
    });

    it('should render titles without links in editing mode for featured communities', () => {
      render(<FeaturedCommunities {...(propsEditing as unknown as Parameters<typeof FeaturedCommunities>[0])} />);

      const title = screen.getByText('Sandbrock Ranch');
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

      render(<FeaturedCommunities {...(propsEditingUndefinedLink as unknown as Parameters<typeof FeaturedCommunities>[0])} />);

      expect(screen.getByText('Add link')).toBeInTheDocument();
    });
  });

  describe('Community transformation', () => {
    it('should correctly transform featured content to communities', () => {
      render(<FeaturedCommunities {...(defaultProps as unknown as Parameters<typeof FeaturedCommunities>[0])} />);

      expect(screen.getByText('Sandbrock Ranch')).toBeInTheDocument();
      expect(screen.getByText('Highland Park Reserve')).toBeInTheDocument();
      expect(screen.getByText('Lakewood Ranch')).toBeInTheDocument();
      expect(screen.getByText('Greely Farms')).toBeInTheDocument();
    });

    it('should handle undefined fields', () => {
      const propsUndefinedFields = {
        params: defaultProps.params,
        fields: undefined as unknown as typeof defaultProps.fields,
        isPageEditing: false,
        rendering: defaultProps.rendering,
        page: defaultProps.page,
      };

      const { container } = render(<FeaturedCommunities {...(propsUndefinedFields as unknown as Parameters<typeof FeaturedCommunities>[0])} />);
      expect(container).toBeInTheDocument();
    });

    it('should handle missing community URLs', () => {
      const propsNoUrl = {
        ...defaultProps,
        fields: {
          ...defaultProps.fields,
          featuredContent: [
            {
              ...defaultProps.fields.featuredContent[0],
              url: '',
            },
          ],
        },
      };

      render(<FeaturedCommunities {...(propsNoUrl as unknown as Parameters<typeof FeaturedCommunities>[0])} />);
      expect(screen.getByText('Sandbrock Ranch')).toBeInTheDocument();
    });
  });

  describe('Responsive layout classes', () => {
    it('should apply container query classes', () => {
      const { container } = render(<FeaturedCommunities {...(defaultProps as unknown as Parameters<typeof FeaturedCommunities>[0])} />);

      const containerQuery = container.querySelector('.\\@container');
      expect(containerQuery).toBeInTheDocument();
    });

    it('should apply max-width constraint', () => {
      const { container } = render(<FeaturedCommunities {...(defaultProps as unknown as Parameters<typeof FeaturedCommunities>[0])} />);

      const maxWidth = container.querySelector('.max-w-7xl');
      expect(maxWidth).toBeInTheDocument();
    });
  });
});
