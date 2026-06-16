import { render, screen } from '@testing-library/react';

import { Default as ProductCarouselDefault } from '@/components/product-carousel/ProductCarousel';

jest.mock('lucide-react', () => ({
  ChevronLeft: () => <span data-testid="chevron-left">←</span>,
  ChevronRight: () => <span data-testid="chevron-right">→</span>,
}));

/** Stable API reference — a new object each render caused useEffect loops and OOM. */
jest.mock('embla-carousel-react', () => {
  const api = {
    scrollNext: jest.fn(),
    scrollPrev: jest.fn(),
    scrollTo: jest.fn(),
    canScrollNext: () => true,
    canScrollPrev: () => false,
    selectedScrollSnap: () => 0,
    scrollSnapList: () => [0, 1, 2],
    on: jest.fn(),
    off: jest.fn(),
  };
  return {
    __esModule: true,
    default: jest.fn(() => [(node: HTMLElement | null) => node, api]),
  };
});

jest.mock('next/image', () => ({
  __esModule: true,
  default: ({ src, alt }: { src: string; alt: string }) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt={alt} />
  ),
}));

const baseProps = {
  params: {},
  fields: {},
  rendering: { componentName: 'ProductCarousel', uid: 'test' },
  page: { layout: { sitecore: { route: { name: 'Test' } } } },
} as const;

describe('ProductCarousel', () => {
  it('renders default microbiology products from bundled JSON', () => {
    render(<ProductCarouselDefault {...baseProps} />);

    expect(screen.getByRole('heading', { name: /Microbiology Control Products/i })).toBeInTheDocument();
    expect(screen.getByText('KWIK-STIK™')).toBeInTheDocument();
    expect(screen.getByText('Microbiology Slides')).toBeInTheDocument();
  });

  it('renders carousel navigation controls', () => {
    render(<ProductCarouselDefault {...baseProps} />);

    expect(screen.getAllByLabelText('Previous products').length).toBeGreaterThan(0);
    expect(screen.getAllByLabelText('Next products').length).toBeGreaterThan(0);
    expect(screen.getAllByRole('button', { name: /Go to slide/i }).length).toBeGreaterThan(0);
  });

  it('uses jsonDatasource field when provided', () => {
    render(
      <ProductCarouselDefault
        {...baseProps}
        fields={{
          jsonDatasource: {
            value: JSON.stringify({
              title: 'Custom Products',
              products: [
                {
                  id: 'custom-1',
                  title: 'Custom Product',
                  description: 'Custom description',
                },
              ],
            }),
          },
        }}
      />
    );

    expect(screen.getByRole('heading', { name: 'Custom Products' })).toBeInTheDocument();
    expect(screen.getByText('Custom Product')).toBeInTheDocument();
    expect(screen.queryByText('KWIK-STIK™')).not.toBeInTheDocument();
  });
});
