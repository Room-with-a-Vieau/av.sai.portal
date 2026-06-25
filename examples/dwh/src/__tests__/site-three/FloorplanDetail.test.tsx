/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Default as FloorplanDetailDefault } from '@/components/site-three/FloorplanDetail';

jest.mock('lucide-react', () => ({
  Bath: () => <span data-testid="icon-bath" />,
  BedDouble: () => <span data-testid="icon-bed" />,
  Building2: () => <span data-testid="icon-building" />,
  Car: () => <span data-testid="icon-car" />,
  FileText: () => <span data-testid="icon-file" />,
  Heart: () => <span data-testid="icon-heart" />,
  Printer: () => <span data-testid="icon-printer" />,
  ShieldCheck: () => <span data-testid="icon-shield" />,
  Share2: () => <span data-testid="icon-share" />,
  Wallet: () => <span data-testid="icon-wallet" />,
}));

jest.mock('shadcn/components/ui/carousel', () => ({
  Carousel: ({ children, setApi, ...props }: any) => {
    React.useEffect(() => {
      setApi?.({
        selectedScrollSnap: () => 0,
        on: jest.fn(),
        off: jest.fn(),
      });
    }, [setApi]);

    return (
      <div data-testid="carousel" {...props}>
        {children}
      </div>
    );
  },
  CarouselContent: ({ children, ...props }: any) => (
    <div data-testid="carousel-content" {...props}>
      {children}
    </div>
  ),
  CarouselItem: ({ children, ...props }: any) => (
    <div data-testid="carousel-item" {...props}>
      {children}
    </div>
  ),
  CarouselNext: ({ ...props }: any) => (
    <button data-testid="carousel-next" type="button" {...props}>
      Next
    </button>
  ),
  CarouselPrevious: ({ ...props }: any) => (
    <button data-testid="carousel-previous" type="button" {...props}>
      Previous
    </button>
  ),
}));

jest.mock('@sitecore-content-sdk/nextjs', () => ({
  Text: ({ field, ...props }: any) => <span {...props}>{field?.value ?? ''}</span>,
  RichText: ({ field, ...props }: any) => (
    <div {...props} dangerouslySetInnerHTML={{ __html: field?.value || '' }} />
  ),
  Image: ({ field, className }: any) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={field?.value?.src || ''} alt={field?.value?.alt || ''} className={className} />
  ),
  useSitecore: () => ({
    page: {
      mode: { isEditing: false },
      layout: { sitecore: { route: { fields: {} } } },
    },
  }),
}));

describe('FloorplanDetail', () => {
  const mockProps = {
    params: {
      styles: 'test-styles',
    },
    fields: {
      'Plan Name': { value: 'The Walmsley' },
      PlanID: { value: '#65459' },
      'Plan Address': { value: '4324 Palomino Road, Aubrey, TX 78227' },
      Stores: { value: '2' },
      Bedrooms: { value: '5' },
      'Full Baths': { value: '4' },
      'Car Garage': { value: '2' },
      'sq footage': { value: '3209' },
      price: { value: '527990' },
      status: { value: 'Ready Now' },
      Overview: {
        value: '<p>This beautiful two-story Walmsley home in Sandbrock Ranch blends space and functionality.</p>',
      },
      Image1: { value: { src: '/images/plan-1.jpg', alt: 'Plan exterior' } },
      Image2: { value: { src: '/images/plan-2.jpg', alt: 'Plan side' } },
      'First Floor': { value: { src: '/images/first-floor.jpg', alt: '1st Floor' } },
      'Second Floor': { value: { src: '/images/second-floor.jpg', alt: '2nd Floor' } },
      Basement: { value: { src: '/images/basement.jpg', alt: 'Basement' } },
    },
  };

  it('renders plan name and id', () => {
    render(<FloorplanDetailDefault {...mockProps} />);
    expect(screen.getByRole('heading', { level: 1, name: 'The Walmsley' })).toBeInTheDocument();
    expect(screen.getByText('Plan #65459')).toBeInTheDocument();
  });

  it('formats the price and shows sq footage', () => {
    render(<FloorplanDetailDefault {...mockProps} />);
    expect(screen.getByText('$527,990')).toBeInTheDocument();
    expect(screen.getByText('3209')).toBeInTheDocument();
  });

  it('renders stat values with labels', () => {
    render(<FloorplanDetailDefault {...mockProps} />);
    expect(screen.getByText('Stories')).toBeInTheDocument();
    expect(screen.getByText('Bedrooms')).toBeInTheDocument();
    expect(screen.getByText('Full Baths')).toBeInTheDocument();
    expect(screen.getByText('Car Garage')).toBeInTheDocument();
  });

  it('renders overview content', () => {
    render(<FloorplanDetailDefault {...mockProps} />);
    expect(screen.getByText(/This beautiful two-story Walmsley home/)).toBeInTheDocument();
  });

  it('renders plan address and ready status button', () => {
    render(<FloorplanDetailDefault {...mockProps} />);
    expect(screen.getByText('4324 Palomino Road, Aubrey, TX 78227')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Ready Now' })).toBeInTheDocument();
  });

  it('renders floor plan tabs and switches floors', () => {
    render(<FloorplanDetailDefault {...mockProps} />);
    const firstFloorTab = screen.getByRole('tab', { name: '1st Floor' });
    const secondFloorTab = screen.getByRole('tab', { name: '2nd Floor' });
    const basementTab = screen.getByRole('tab', { name: 'Basement' });

    expect(firstFloorTab).toBeInTheDocument();
    expect(secondFloorTab).toBeInTheDocument();
    expect(basementTab).toBeInTheDocument();

    // First floor active by default
    expect(firstFloorTab).toHaveAttribute('aria-selected', 'true');

    fireEvent.click(secondFloorTab);
    expect(secondFloorTab).toHaveAttribute('aria-selected', 'true');
    expect(firstFloorTab).toHaveAttribute('aria-selected', 'false');
  });

  it('renders the carousel and plan action links', () => {
    render(<FloorplanDetailDefault {...mockProps} />);
    expect(screen.getByTestId('carousel')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Share Plan/ })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Request a Brochure/ })).toBeInTheDocument();
  });
});
