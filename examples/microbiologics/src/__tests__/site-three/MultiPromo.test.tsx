/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import {
  Default as MultiPromoDefault,
  Stacked as MultiPromoStacked,
  SingleColumn as MultiPromoSingleColumn,
  SideBySide as MultiPromoSideBySide,
  CardCarousel as MultiPromoCardCarousel,
  Card as MultiPromoCard,
} from '@/components/site-three/MultiPromo';

// Mock Sitecore SDK
jest.mock('@sitecore-content-sdk/nextjs', () => ({
  Text: ({ field, ...props }: any) => <span {...props}>{field?.value || ''}</span>,
  NextImage: ({ field, className }: any) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={field?.value?.src || ''} alt={field?.value?.alt || ''} className={className} />
  ),
  Link: ({ field, children, className, onClick }: any) => (
    <a href={field?.value?.href || '#'} className={className} onClick={onClick}>
      {children || field?.value?.text || ''}
    </a>
  ),
}));

// Mock NoDataFallback
jest.mock('@/utils/NoDataFallback', () => ({
  NoDataFallback: () => <div data-testid="no-data-fallback">No data available</div>,
}));

jest.mock('lucide-react', () => ({
  ChevronRight: (props: Record<string, unknown>) => <svg data-testid="chevron-right" {...props} />,
  ArrowLeft: (props: Record<string, unknown>) => <svg data-testid="arrow-left" {...props} />,
  ArrowRight: (props: Record<string, unknown>) => <svg data-testid="arrow-right" {...props} />,
}));

jest.mock('@/components/ui/carousel', () => ({
  Carousel: ({ children, className }: any) => (
    <div className={className} data-testid="multipromo-card-carousel">
      {children}
    </div>
  ),
  CarouselContent: ({ children, className }: any) => (
    <div className={className} data-testid="carousel-content">
      {children}
    </div>
  ),
  CarouselItem: ({ children, className }: any) => (
    <div className={className} data-testid="carousel-item">
      {children}
    </div>
  ),
  CarouselPrevious: ({ className, ...props }: any) => (
    <button type="button" className={className} data-testid="carousel-previous" {...props} />
  ),
  CarouselNext: ({ className, ...props }: any) => (
    <button type="button" className={className} data-testid="carousel-next" {...props} />
  ),
}));

describe('MultiPromo', () => {
  const mockProps = {
    params: {
      styles: 'test-styles',
    },
    fields: {
      data: {
        datasource: {
          title: {
            jsonValue: {
              value: 'Featured Products',
            },
          },
          description: {
            jsonValue: {
              value: 'Explore our selection',
            },
          },
          children: {
            results: [
              {
                id: 'promo-1',
                heading: {
                  jsonValue: {
                    value: 'Product 1',
                  },
                },
                description: {
                  jsonValue: {
                    value: 'Description 1',
                  },
                },
                image: {
                  jsonValue: {
                    value: {
                      src: '/images/product1.jpg',
                      alt: 'Product 1',
                    },
                  },
                },
                link: {
                  jsonValue: {
                    value: {
                      href: '/product1',
                      text: 'View Product 1',
                    },
                  },
                },
              },
              {
                id: 'promo-2',
                heading: {
                  jsonValue: {
                    value: 'Product 2',
                  },
                },
                description: {
                  jsonValue: {
                    value: 'Description 2',
                  },
                },
                image: {
                  jsonValue: {
                    value: {
                      src: '/images/product2.jpg',
                      alt: 'Product 2',
                    },
                  },
                },
                link: {
                  jsonValue: {
                    value: {
                      href: '/product2',
                      text: 'View Product 2',
                    },
                  },
                },
              },
            ],
          },
        },
      },
    },
  };

  describe('Default variant', () => {
    it('renders multi promo with title', () => {
      render(<MultiPromoDefault {...mockProps} />);
      expect(screen.getByText('Featured Products')).toBeInTheDocument();
    });

    it('renders description', () => {
      render(<MultiPromoDefault {...mockProps} />);
      expect(screen.getByText('Explore our selection')).toBeInTheDocument();
    });

    it('renders all promo items', () => {
      render(<MultiPromoDefault {...mockProps} />);
      expect(screen.getByText('Product 1')).toBeInTheDocument();
      expect(screen.getByText('Product 2')).toBeInTheDocument();
      expect(screen.getByText('Description 1')).toBeInTheDocument();
      expect(screen.getByText('Description 2')).toBeInTheDocument();
    });

    it('renders promo images', () => {
      render(<MultiPromoDefault {...mockProps} />);
      const images = screen.getAllByRole('img');
      expect(images).toHaveLength(2);
    });

    it('renders promo links', () => {
      render(<MultiPromoDefault {...mockProps} />);
      const links = screen.getAllByRole('link');
      expect(links).toHaveLength(2);
      expect(links[0]).toHaveAttribute('href', '/product1');
      expect(links[1]).toHaveAttribute('href', '/product2');
    });

    it('applies custom styles from params', () => {
      const { container } = render(<MultiPromoDefault {...mockProps} />);
      const section = container.querySelector('section');
      expect(section).toHaveClass('test-styles');
    });

    it('renders without items when children array is empty', () => {
      const emptyProps = {
        params: {},
        fields: {
          data: {
            datasource: {
              children: {
                results: [],
              },
            },
          },
        },
      };
      const { container } = render(<MultiPromoDefault {...emptyProps} />);
      expect(container.firstChild).toBeInTheDocument();
    });

    it('renders NoDataFallback when fields are missing', () => {
      const emptyProps = { params: {}, fields: undefined } as any;
      render(<MultiPromoDefault {...emptyProps} />);
      expect(screen.getByTestId('no-data-fallback')).toBeInTheDocument();
    });
  });

  describe('Stacked variant', () => {
    it('renders stacked layout with title and description', () => {
      render(<MultiPromoStacked {...mockProps} />);
      expect(screen.getByText('Featured Products')).toBeInTheDocument();
      expect(screen.getByText('Explore our selection')).toBeInTheDocument();
    });

    it('renders all promo items in stacked format', () => {
      render(<MultiPromoStacked {...mockProps} />);
      expect(screen.getByText('Product 1')).toBeInTheDocument();
      expect(screen.getByText('Product 2')).toBeInTheDocument();
      expect(screen.getByText('Description 1')).toBeInTheDocument();
      expect(screen.getByText('Description 2')).toBeInTheDocument();
    });

    it('applies stacked-specific styling classes', () => {
      const { container } = render(<MultiPromoStacked {...mockProps} />);
      const section = container.querySelector('section');
      expect(section).toHaveClass('overflow-hidden');
      const blurElement = container.querySelector('.blur-\\[400px\\]');
      expect(blurElement).toBeInTheDocument();
    });

    it('renders promo images and links', () => {
      render(<MultiPromoStacked {...mockProps} />);
      const images = screen.getAllByRole('img');
      const links = screen.getAllByRole('link');
      expect(images).toHaveLength(2);
      expect(links).toHaveLength(2);
    });

    it('handles missing fields gracefully', () => {
      const minimalProps = {
        params: { styles: 'stacked-styles' },
        fields: {
          data: {
            datasource: {
              children: {
                results: [
                  {
                    id: 'minimal-promo',
                    heading: { jsonValue: { value: 'Minimal Product' } },
                    description: { jsonValue: { value: 'Minimal Description' } },
                    image: { jsonValue: { value: { src: '/minimal.jpg', alt: 'Minimal' } } },
                    link: { jsonValue: { value: { href: '/minimal', text: 'View Minimal' } } },
                  },
                ],
              },
            },
          },
        },
      };
      render(<MultiPromoStacked {...minimalProps} />);
      expect(screen.getByText('Minimal Product')).toBeInTheDocument();
    });

    it('renders NoDataFallback when fields are missing', () => {
      const emptyProps = { params: {}, fields: undefined } as any;
      render(<MultiPromoStacked {...emptyProps} />);
      expect(screen.getByTestId('no-data-fallback')).toBeInTheDocument();
    });
  });

  describe('SingleColumn variant', () => {
    it('renders single column layout with title and description', () => {
      render(<MultiPromoSingleColumn {...mockProps} />);
      expect(screen.getByText('Featured Products')).toBeInTheDocument();
      expect(screen.getByText('Explore our selection')).toBeInTheDocument();
    });

    it('renders all promo items in single column format', () => {
      render(<MultiPromoSingleColumn {...mockProps} />);
      expect(screen.getByText('Product 1')).toBeInTheDocument();
      expect(screen.getByText('Product 2')).toBeInTheDocument();
      expect(screen.getByText('Description 1')).toBeInTheDocument();
      expect(screen.getByText('Description 2')).toBeInTheDocument();
    });

    it('renders promo images and links in horizontal layout', () => {
      render(<MultiPromoSingleColumn {...mockProps} />);
      const images = screen.getAllByRole('img');
      const links = screen.getAllByRole('link');
      expect(images).toHaveLength(2);
      expect(links).toHaveLength(2);
    });

    it('applies single column specific styling', () => {
      const { container } = render(<MultiPromoSingleColumn {...mockProps} />);
      const section = container.querySelector('section');
      expect(section).toBeInTheDocument();
      // Check for grid layout classes that indicate single column layout
      const gridContainer = container.querySelector('.grid.gap-14');
      expect(gridContainer).toBeInTheDocument();
    });

    it('handles empty children array', () => {
      const emptyChildrenProps = {
        params: { styles: 'single-column-styles' },
        fields: {
          data: {
            datasource: {
              title: { jsonValue: { value: 'Empty Title' } },
              description: { jsonValue: { value: 'Empty Description' } },
              children: {
                results: [],
              },
            },
          },
        },
      };
      render(<MultiPromoSingleColumn {...emptyChildrenProps} />);
      expect(screen.getByText('Empty Title')).toBeInTheDocument();
      expect(screen.getByText('Empty Description')).toBeInTheDocument();
    });

    it('renders NoDataFallback when fields are missing', () => {
      const emptyProps = { params: {}, fields: undefined } as any;
      render(<MultiPromoSingleColumn {...emptyProps} />);
      expect(screen.getByTestId('no-data-fallback')).toBeInTheDocument();
    });
  });

  describe('SideBySide variant', () => {
    it('renders promo headings and one image per column', () => {
      render(<MultiPromoSideBySide {...mockProps} />);
      expect(screen.getByText('Product 1')).toBeInTheDocument();
      expect(screen.getByText('Product 2')).toBeInTheDocument();
      expect(screen.getAllByRole('img')).toHaveLength(2);
    });

    it('renders shade overlay elements for hover styling', () => {
      const { container } = render(<MultiPromoSideBySide {...mockProps} />);
      const overlays = container.querySelectorAll('.multipromo-sidebyside-overlay');
      expect(overlays).toHaveLength(2);
    });

    it('renders one article panel per promo child', () => {
      render(<MultiPromoSideBySide {...mockProps} />);
      expect(screen.getAllByRole('article')).toHaveLength(2);
    });

    it('sets data-multipromo-variant on the section', () => {
      const { container } = render(<MultiPromoSideBySide {...mockProps} />);
      expect(container.querySelector('[data-multipromo-variant="sidebyside"]')).toBeInTheDocument();
    });

    it('renders NoDataFallback when fields are missing', () => {
      const emptyProps = { params: {}, fields: undefined } as any;
      render(<MultiPromoSideBySide {...emptyProps} />);
      expect(screen.getByTestId('no-data-fallback')).toBeInTheDocument();
    });
  });

  describe('CardCarousel variant', () => {
    it('renders centered title and description', () => {
      render(<MultiPromoCardCarousel {...mockProps} />);
      expect(screen.getByText('Featured Products')).toBeInTheDocument();
      expect(screen.getByText('Explore our selection')).toBeInTheDocument();
    });

    it('renders all promo cards in a carousel', () => {
      render(<MultiPromoCardCarousel {...mockProps} />);
      expect(screen.getByText('Product 1')).toBeInTheDocument();
      expect(screen.getByText('Product 2')).toBeInTheDocument();
      expect(screen.getByText('Description 1')).toBeInTheDocument();
      expect(screen.getByText('Description 2')).toBeInTheDocument();
    });

    it('sets data-multipromo-variant on the section', () => {
      const { container } = render(<MultiPromoCardCarousel {...mockProps} />);
      expect(container.querySelector('[data-multipromo-variant="cardcarousel"]')).toBeInTheDocument();
    });

    it('marks the first card as active by default', () => {
      render(<MultiPromoCardCarousel {...mockProps} />);
      const articles = screen.getAllByRole('article');
      expect(articles[0]).toHaveAttribute('aria-current', 'true');
      expect(articles[1]).not.toHaveAttribute('aria-current');
    });

    it('activates a card on click', () => {
      render(<MultiPromoCardCarousel {...mockProps} />);
      const articles = screen.getAllByRole('article');
      fireEvent.click(articles[1]);
      expect(articles[1]).toHaveAttribute('aria-current', 'true');
      expect(articles[0]).not.toHaveAttribute('aria-current');
    });

    it('renders carousel navigation buttons', () => {
      render(<MultiPromoCardCarousel {...mockProps} />);
      expect(screen.getByRole('button', { name: /previous promos/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /next promos/i })).toBeInTheDocument();
    });

    it('renders NoDataFallback when fields are missing', () => {
      const emptyProps = { params: {}, fields: undefined } as any;
      render(<MultiPromoCardCarousel {...emptyProps} />);
      expect(screen.getByTestId('no-data-fallback')).toBeInTheDocument();
    });
  });

  describe('Card variant', () => {
    it('renders promo heading and description in white text panel', () => {
      render(<MultiPromoCard {...mockProps} />);
      expect(screen.getByText('Product 1')).toBeInTheDocument();
      expect(screen.getByText('Description 1')).toBeInTheDocument();
    });

    it('renders datasource title as eyebrow', () => {
      render(<MultiPromoCard {...mockProps} />);
      expect(screen.getAllByText('Featured Products').length).toBeGreaterThan(0);
    });

    it('renders full-bleed promo image', () => {
      render(<MultiPromoCard {...mockProps} />);
      expect(screen.getAllByRole('img').length).toBeGreaterThan(0);
    });

    it('sets data-multipromo-variant on the section', () => {
      const { container } = render(<MultiPromoCard {...mockProps} />);
      expect(container.querySelector('[data-multipromo-variant="card"]')).toBeInTheDocument();
    });

    it('renders carousel navigation when multiple promos exist', () => {
      render(<MultiPromoCard {...mockProps} />);
      expect(screen.getByRole('button', { name: /previous promo/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /next promo/i })).toBeInTheDocument();
      expect(screen.getAllByRole('tab')).toHaveLength(2);
      expect(screen.getByRole('tab', { name: /go to promo 1/i })).toHaveClass('bg-white');
      expect(screen.getByRole('tab', { name: /go to promo 2/i })).toHaveClass('bg-transparent');
    });

    it('renders NoDataFallback when fields are missing', () => {
      const emptyProps = { params: {}, fields: undefined } as any;
      render(<MultiPromoCard {...emptyProps} />);
      expect(screen.getByTestId('no-data-fallback')).toBeInTheDocument();
    });
  });
});
