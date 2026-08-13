import React from 'react';
import { render, screen } from '@testing-library/react';
import { Default as HeroCarousel } from '../../components/uiim/banners/HeroCarousel';
import type { HeroCarouselProps } from '../../components/uiim/banners/HeroCarousel';

jest.mock('@sitecore-content-sdk/nextjs', () => ({
  useSitecore: () => ({ page: { mode: { isEditing: false } } }),
  Text: ({ field }: { field?: { value?: string } }) => (
    <span data-testid="hero-carousel-text">{field?.value}</span>
  ),
  NextImage: ({ field }: { field?: { value?: { src?: string; alt?: string } } }) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      data-testid="hero-carousel-image"
      src={field?.value?.src || ''}
      alt={field?.value?.alt || ''}
    />
  ),
  Link: ({
    field,
    className,
    children,
  }: {
    field?: { value?: { href?: string; text?: string } };
    className?: string;
    children?: React.ReactNode;
  }) => (
    <a data-testid="hero-carousel-link" href={field?.value?.href || '#'} className={className}>
      {children || field?.value?.text}
    </a>
  ),
}));

jest.mock('../../utils/NoDataFallback', () => ({
  NoDataFallback: ({ componentName }: { componentName: string }) => (
    <div data-testid="no-data-fallback">{componentName} requires a datasource</div>
  ),
}));

jest.mock('../../hooks/use-media-query', () => ({
  useMediaQuery: () => false,
}));

const baseParams = {
  styles: '',
  RenderingIdentifier: 'hero-carousel-test',
};

const mockPage = {} as HeroCarouselProps['page'];
const mockRendering = { componentName: 'HeroCarousel' } as HeroCarouselProps['rendering'];

describe('HeroCarousel', () => {
  it('renders NoDataFallback when datasource is missing', () => {
    render(
      <HeroCarousel
        fields={{ data: {} }}
        params={baseParams}
        page={mockPage}
        rendering={mockRendering}
      />
    );

    expect(screen.getByTestId('no-data-fallback')).toHaveTextContent(
      'HeroCarousel requires a datasource'
    );
  });

  it('renders NoDataFallback when fields are undefined', () => {
    render(<HeroCarousel params={baseParams} page={mockPage} rendering={mockRendering} />);
    expect(screen.getByTestId('no-data-fallback')).toBeInTheDocument();
  });

  it('renders intro slide content and contact rail', () => {
    render(
      <HeroCarousel
        params={baseParams}
        page={mockPage}
        rendering={mockRendering}
        fields={{
          data: {
            datasource: {
              contactLink: {
                jsonValue: { value: { href: '/contact-us', text: 'CONTACT US' } },
              },
              children: {
                results: [
                  {
                    id: 'slide-1',
                    slideName: { jsonValue: { value: 'Quanex®' } },
                    description: { jsonValue: { value: 'A Part of Something Bigger®' } },
                    summary: {
                      jsonValue: {
                        value: 'EXTRUDED SOLUTIONS | HARDWARE SOLUTIONS | CUSTOM SOLUTIONS',
                      },
                    },
                    isIntroSlide: { jsonValue: { value: '1' } },
                  },
                  {
                    id: 'slide-2',
                    slideName: { jsonValue: { value: 'QUANEX EXTRUDED SOLUTIONS' } },
                    description: {
                      jsonValue: {
                        value: 'Innovative extruded solutions.',
                      },
                    },
                    link: {
                      jsonValue: {
                        value: { href: '/products/extruded', text: 'EXPLORE EXTRUDED SOLUTIONS' },
                      },
                    },
                    image: {
                      jsonValue: {
                        value: {
                          src: 'https://example.com/extruded.jpg',
                          alt: 'Extruded',
                        },
                      },
                    },
                    isIntroSlide: { jsonValue: { value: '' } },
                  },
                ],
              },
            },
          },
        }}
      />
    );

    expect(screen.getByLabelText('Hero carousel')).toBeInTheDocument();
    expect(screen.getByText('Quanex®')).toBeInTheDocument();
    expect(screen.getByText('CONTACT US')).toBeInTheDocument();
    expect(screen.getByLabelText('Go to slide 1')).toHaveAttribute('aria-selected', 'true');
    expect(screen.getByLabelText('Go to slide 2')).toHaveAttribute('aria-selected', 'false');
  });
});
