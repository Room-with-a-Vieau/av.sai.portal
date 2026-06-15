import { render, screen } from '@testing-library/react';

import { Default as ProductCarouselDefault } from '@/components/product-carousel/ProductCarousel';

jest.mock('lucide-react', () => ({
  ChevronLeft: () => <span data-testid="chevron-left">←</span>,
  ChevronRight: () => <span data-testid="chevron-right">→</span>,
}));

jest.mock('embla-carousel-react', () => ({
  __esModule: true,
  default: () => [
    (node: HTMLElement) => node,
    {
      scrollNext: jest.fn(),
      scrollPrev: jest.fn(),
      scrollTo: jest.fn(),
      canScrollNext: () => true,
      canScrollPrev: () => false,
      selectedScrollSnap: () => 0,
      scrollSnapList: () => [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17],
      on: jest.fn(),
      off: jest.fn(),
    },
  ],
}));

jest.mock('next/image', () => ({
  __esModule: true,
  default: ({ src, alt }: { src: string; alt: string }) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt={alt} />
  ),
}));

describe('ProductCarousel', () => {
  it('renders default microbiology products from bundled JSON', () => {
    render(<ProductCarouselDefault params={{}} fields={{}} />);

    expect(screen.getByRole('heading', { name: /Microbiology Control Products/i })).toBeInTheDocument();
    expect(screen.getByText('KWIK-STIK™')).toBeInTheDocument();
    expect(screen.getByText('Microbiology Slides')).toBeInTheDocument();
  });

  it('renders carousel navigation controls', () => {
    render(<ProductCarouselDefault params={{}} fields={{}} />);

    expect(screen.getAllByLabelText('Previous products').length).toBeGreaterThan(0);
    expect(screen.getAllByLabelText('Next products').length).toBeGreaterThan(0);
    expect(screen.getAllByRole('button', { name: /Go to slide/i }).length).toBeGreaterThan(0);
  });

  it('uses jsonDatasource field when provided', () => {
    render(
      <ProductCarouselDefault
        params={{}}
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
