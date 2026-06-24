/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { render, screen } from '@testing-library/react';
import { Default as HomeDetailDefault } from '@/components/site-three/HomeDetail';

jest.mock('lucide-react', () => ({
  Home: () => <span data-testid="icon-home" />,
  Waves: () => <span data-testid="icon-waves" />,
  Dumbbell: () => <span data-testid="icon-dumbbell" />,
  Play: () => <span data-testid="icon-play" />,
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
  Text: ({ field, ...props }: any) => <span {...props}>{field?.value || ''}</span>,
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

describe('HomeDetail', () => {
  const mockProps = {
    params: {
      styles: 'test-styles',
    },
    fields: {
      Name: { value: 'Sandbrock Ranch' },
      Address: { value: '2005 Calumet Drive, Aubrey, TX 76227' },
      'Community Type': { value: 'North' },
      'price range': { value: '$412s' },
      'square footage': { value: '1875-3586' },
      Overview: {
        value: '<p>Welcome to Sandbrock Ranch.</p><ul><li>Carriage House amenity center</li></ul>',
      },
      Image1: {
        value: {
          src: '/images/community-1.jpg',
          alt: 'Community fire pit',
        },
      },
      Image2: {
        value: {
          src: '/images/community-2.jpg',
          alt: 'Community exterior',
        },
      },
      ammenities: [
        { id: 'amenity-1', name: 'Clubhouse', displayName: 'Clubhouse', fields: {} },
        { id: 'amenity-2', name: 'Pool', displayName: 'Pool', fields: {} },
        { id: 'amenity-3', name: 'Fitness', displayName: 'Fitness Center', fields: {} },
      ],
    },
  };

  it('renders community name', () => {
    render(<HomeDetailDefault {...mockProps} />);
    expect(screen.getByRole('heading', { level: 1, name: 'Sandbrock Ranch' })).toBeInTheDocument();
  });

  it('renders community stats', () => {
    render(<HomeDetailDefault {...mockProps} />);
    expect(screen.getByText('$412s')).toBeInTheDocument();
    expect(screen.getByText('1875-3586')).toBeInTheDocument();
  });

  it('renders overview content', () => {
    render(<HomeDetailDefault {...mockProps} />);
    expect(screen.getByText('Welcome to Sandbrock Ranch.')).toBeInTheDocument();
  });

  it('renders address and directions link', () => {
    render(<HomeDetailDefault {...mockProps} />);
    expect(screen.getByText('2005 Calumet Drive, Aubrey, TX 76227')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Get Directions' })).toHaveAttribute(
      'href',
      expect.stringContaining('google.com/maps'),
    );
  });

  it('renders carousel and section navigation', () => {
    render(<HomeDetailDefault {...mockProps} />);
    expect(screen.getByTestId('carousel')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Overview' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Schedule a Tour' })).toBeInTheDocument();
  });
});
