/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { render, screen } from '@testing-library/react';
import {
  Default as HeroSTDefault,
  Right as HeroSTRight,
  Centered as HeroSTCentered,
  SplitScreen as HeroSTSplitScreen,
  Stacked as HeroSTStacked,
  WithVideoSplit as HeroSTWithVideoSplit,
} from '@/components/site-three/HeroST';

// Mock useContainerOffsets hook
jest.mock('@/hooks/useContainerOffsets', () => ({
  useContainerOffsets: () => ({
    containerRef: { current: null },
    rightOffset: 0,
    leftOffset: 0,
  }),
}));

// Mock Sitecore SDK
jest.mock('@sitecore-content-sdk/nextjs', () => ({
  Text: ({ field, ...props }: any) => <span {...props}>{field?.value || ''}</span>,
  NextImage: ({ field, className }: any) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={field?.value?.src || ''} alt={field?.value?.alt || ''} className={className} />
  ),
  Link: ({ field, children, className }: any) => (
    <a href={field?.value?.href || '#'} className={className}>
      {children || field?.value?.text || ''}
    </a>
  ),
  useSitecore: () => ({
    page: {
      mode: {
        isEditing: false,
      },
    },
  }),
}));

describe('HeroST', () => {
  const mockProps = {
    params: {
      styles: 'test-styles',
    },
    fields: {
      Eyebrow: {
        value: 'New Collection',
      },
      Title: {
        value: 'We are Rare',
      },
      Callout: {
        value: 'A family-owned Certified B Corporation committed to rare diseases',
      },
      Image1: {
        value: {
          src: '/images/hero-bg.jpg',
          alt: 'Hero background',
        },
      },
      Image2: {
        value: {
          src: '/images/hero-product.jpg',
          alt: 'Hero product',
        },
      },
      Link1: {
        value: {
          href: '/shop',
          text: 'Shop Now',
        },
      },
      Link2: {
        value: {
          href: '/learn-more',
          text: 'Learn More',
        },
      },
    },
  };

  describe('Default variant', () => {
    it('renders stylized title with script accent on the last word', () => {
      const { container } = render(<HeroSTDefault {...mockProps} />);
      expect(screen.getByText('We are')).toBeInTheDocument();
      expect(screen.getByText('Rare')).toBeInTheDocument();
      expect(container.querySelector('.herost-title-accent')).toHaveTextContent('Rare');
    });

    it('renders callout text below the title', () => {
      render(<HeroSTDefault {...mockProps} />);
      expect(
        screen.getByText('A family-owned Certified B Corporation committed to rare diseases')
      ).toBeInTheDocument();
    });

    it('renders callout from lowercase field key', () => {
      const propsWithLowercaseCallout: any = {
        ...mockProps,
        fields: {
          ...mockProps.fields,
          Callout: undefined,
          callout: {
            value: 'Lowercase callout field value',
          },
        },
      };
      render(<HeroSTDefault {...propsWithLowercaseCallout} />);
      expect(screen.getByText('Lowercase callout field value')).toBeInTheDocument();
    });

    it('renders callout from GraphQL datasource jsonValue', () => {
      const propsWithDatasourceCallout: any = {
        ...mockProps,
        fields: {
          Title: mockProps.fields.Title,
          Image1: mockProps.fields.Image1,
          Link1: mockProps.fields.Link1,
          Link2: mockProps.fields.Link2,
          data: {
            datasource: {
              callout: {
                jsonValue: {
                  value: 'Callout from datasource jsonValue',
                },
              },
            },
          },
        },
      };
      render(<HeroSTDefault {...propsWithDatasourceCallout} />);
      expect(screen.getByText('Callout from datasource jsonValue')).toBeInTheDocument();
    });

    it('renders hero with title', () => {
      render(<HeroSTDefault {...mockProps} />);
      expect(screen.getByText('Rare')).toBeInTheDocument();
    });

    it('renders background image', () => {
      render(<HeroSTDefault {...mockProps} />);
      const images = screen.getAllByRole('img');
      expect(images.length).toBeGreaterThan(0);
    });

    it('renders call-to-action links', () => {
      render(<HeroSTDefault {...mockProps} />);
      expect(screen.getByText('Shop Now')).toBeInTheDocument();
      expect(screen.getByText('Learn More')).toBeInTheDocument();
    });

    it('applies light text on title when Dark Image param is enabled', () => {
      const { container } = render(
        <HeroSTDefault {...mockProps} params={{ ...mockProps.params, DarkImage: '1' }} />
      );
      const heading = container.querySelector('.herost-stylized-title');
      expect(heading).toHaveClass('text-primary-foreground');
    });

    it('recognizes Dark Image checkbox under alternate param key spellings', () => {
      const { container } = render(
        <HeroSTDefault {...mockProps} params={{ ...mockProps.params, 'Dark Image': 'true' }} />
      );
      const heading = container.querySelector('.herost-stylized-title');
      expect(heading).toHaveClass('text-primary-foreground');
    });

    it('does not force light text when Dark Image is off', () => {
      const { container } = render(
        <HeroSTDefault {...mockProps} params={{ ...mockProps.params, DarkImage: '0' }} />
      );
      const heading = container.querySelector('.herost-stylized-title');
      expect(heading).not.toHaveClass('text-primary-foreground');
      expect(heading).toHaveClass('text-primary');
    });
  });

  describe('Centered variant', () => {
    it('renders hero with title', () => {
      render(<HeroSTCentered {...mockProps} />);
      expect(screen.getByText('Rare')).toBeInTheDocument();
    });

    it('renders call-to-action links', () => {
      render(<HeroSTCentered {...mockProps} />);
      expect(screen.getByText('Shop Now')).toBeInTheDocument();
    });

    it('renders callout text in centered variant', () => {
      render(<HeroSTCentered {...mockProps} />);
      expect(
        screen.getByText('A family-owned Certified B Corporation committed to rare diseases')
      ).toBeInTheDocument();
    });

    it('applies custom styles in centered variant', () => {
      const { container } = render(<HeroSTCentered {...mockProps} />);
      const section = container.querySelector('section');
      expect(section).toHaveClass('test-styles');
    });
  });

  describe('Right variant', () => {
    it('renders hero with title in right variant', () => {
      render(<HeroSTRight {...mockProps} />);
      expect(screen.getByText('Rare')).toBeInTheDocument();
    });

    it('renders callout text in right variant', () => {
      render(<HeroSTRight {...mockProps} />);
      expect(
        screen.getByText('A family-owned Certified B Corporation committed to rare diseases')
      ).toBeInTheDocument();
    });

    it('renders call-to-action links in right variant', () => {
      render(<HeroSTRight {...mockProps} />);
      expect(screen.getByText('Shop Now')).toBeInTheDocument();
      expect(screen.getByText('Learn More')).toBeInTheDocument();
    });

    it('renders background images in right variant', () => {
      render(<HeroSTRight {...mockProps} />);
      const images = screen.getAllByRole('img');
      expect(images.length).toBeGreaterThan(0);
    });

    it('applies custom styles in right variant', () => {
      const { container } = render(<HeroSTRight {...mockProps} />);
      const section = container.querySelector('section');
      expect(section).toHaveClass('test-styles');
    });

    it('handles missing callout in right variant', () => {
      const propsWithoutCallout: any = {
        ...mockProps,
        fields: {
          ...mockProps.fields,
          Callout: undefined,
        },
      };
      render(<HeroSTRight {...propsWithoutCallout} />);
      expect(screen.getByText('Rare')).toBeInTheDocument();
    });
  });

  describe('SplitScreen variant', () => {
    it('renders hero with title in split screen variant', () => {
      render(<HeroSTSplitScreen {...mockProps} />);
      expect(screen.getByText('We are Rare')).toBeInTheDocument();
    });

    it('renders eyebrow text in split screen variant', () => {
      render(<HeroSTSplitScreen {...mockProps} />);
      expect(screen.getByText('New Collection')).toBeInTheDocument();
    });

    it('renders call-to-action links in split screen variant', () => {
      render(<HeroSTSplitScreen {...mockProps} />);
      expect(screen.getByText('Shop Now')).toBeInTheDocument();
      expect(screen.getByText('Learn More')).toBeInTheDocument();
    });

    it('applies primary background in split screen variant', () => {
      const { container } = render(<HeroSTSplitScreen {...mockProps} />);
      const section = container.querySelector('section');
      expect(section).toHaveClass('bg-primary');
    });

    it('renders images in split screen layout', () => {
      render(<HeroSTSplitScreen {...mockProps} />);
      const images = screen.getAllByRole('img');
      expect(images.length).toBeGreaterThan(0);
    });

    it('handles missing title in split screen variant', () => {
      const propsWithoutTitle: any = {
        ...mockProps,
        fields: {
          ...mockProps.fields,
          Title: undefined,
        },
      };
      render(<HeroSTSplitScreen {...propsWithoutTitle} />);
      expect(screen.getByText('New Collection')).toBeInTheDocument();
    });
  });

  describe('WithVideoSplit variant', () => {
    it('renders title from Title field', () => {
      render(<HeroSTWithVideoSplit {...mockProps} />);
      expect(screen.getByText('We are Rare')).toBeInTheDocument();
    });

    it('renders eyebrow from Eyebrow field', () => {
      render(<HeroSTWithVideoSplit {...mockProps} />);
      expect(screen.getByText('New Collection')).toBeInTheDocument();
    });

    it('renders looping hero video', () => {
      render(<HeroSTWithVideoSplit {...mockProps} />);
      const video = document.querySelector('video') as HTMLVideoElement;
      expect(video).toBeInTheDocument();
      expect(video.autoplay).toBe(true);
      expect(video.loop).toBe(true);
      expect(video.muted).toBe(true);
      expect(video).toHaveAttribute('playsinline');
    });

    it('renders hardcoded focus area cards', () => {
      render(<HeroSTWithVideoSplit {...mockProps} />);
      expect(screen.getByText('Microbiology')).toBeInTheDocument();
      expect(screen.getByText('Molecular Diagnostics')).toBeInTheDocument();
      expect(screen.getByText('Virology')).toBeInTheDocument();
    });

    it('applies primary background on content panel', () => {
      const { container } = render(<HeroSTWithVideoSplit {...mockProps} />);
      expect(container.querySelector('.bg-primary')).toBeInTheDocument();
    });

    it('applies custom styles', () => {
      const { container } = render(<HeroSTWithVideoSplit {...mockProps} />);
      const section = container.querySelector('section');
      expect(section).toHaveClass('test-styles');
    });
  });

  describe('Stacked variant', () => {
    it('renders hero with title in stacked variant', () => {
      render(<HeroSTStacked {...mockProps} />);
      expect(screen.getByText('We are Rare')).toBeInTheDocument();
    });

    it('renders eyebrow text in stacked variant', () => {
      render(<HeroSTStacked {...mockProps} />);
      expect(screen.getByText('New Collection')).toBeInTheDocument();
    });

    it('renders call-to-action links in stacked variant', () => {
      render(<HeroSTStacked {...mockProps} />);
      expect(screen.getByText('Shop Now')).toBeInTheDocument();
      expect(screen.getByText('Learn More')).toBeInTheDocument();
    });

    it('applies primary background in stacked variant', () => {
      const { container } = render(<HeroSTStacked {...mockProps} />);
      const section = container.querySelector('section');
      expect(section).toHaveClass('bg-primary');
    });

    it('renders both Image1 and Image2 in stacked layout', () => {
      render(<HeroSTStacked {...mockProps} />);
      const images = screen.getAllByRole('img');
      // Should render multiple images (Image1 and Image2 fields)
      expect(images.length).toBeGreaterThan(1);
    });

    it('handles missing Image2 in stacked variant', () => {
      const propsWithoutImage2: any = {
        ...mockProps,
        fields: {
          ...mockProps.fields,
          Image2: undefined,
        },
      };
      render(<HeroSTStacked {...propsWithoutImage2} />);
      expect(screen.getByText('We are Rare')).toBeInTheDocument();
    });

    it('applies custom styles in stacked variant', () => {
      const { container } = render(<HeroSTStacked {...mockProps} />);
      const section = container.querySelector('section');
      expect(section).toHaveClass('test-styles');
    });
  });

  describe('Edge cases and missing data', () => {
    it('handles completely missing fields in default variant', () => {
      const propsWithoutFields: any = {
        params: {},
        fields: {},
      };
      const { container } = render(<HeroSTDefault {...propsWithoutFields} />);
      // Component should still render without errors
      const section = container.querySelector('section');
      expect(section).toBeInTheDocument();
    });

    it('handles missing links in default variant', () => {
      const propsWithoutLinks: any = {
        ...mockProps,
        fields: {
          ...mockProps.fields,
          Link1: undefined,
          Link2: undefined,
        },
      };
      render(<HeroSTDefault {...propsWithoutLinks} />);
      expect(screen.getByText('Rare')).toBeInTheDocument();
    });

    it('handles missing images in default variant', () => {
      const propsWithoutImages: any = {
        ...mockProps,
        fields: {
          ...mockProps.fields,
          Image1: undefined,
        },
      };
      render(<HeroSTDefault {...propsWithoutImages} />);
      expect(screen.getByText('Rare')).toBeInTheDocument();
    });

    it('renders without params styles', () => {
      const propsWithoutStyles = {
        ...mockProps,
        params: {},
      };
      render(<HeroSTDefault {...propsWithoutStyles} />);
      expect(screen.getByText('Rare')).toBeInTheDocument();
    });

    it('renders Chiesi corner accents on photo heroes', () => {
      const { container } = render(<HeroSTDefault {...mockProps} />);
      expect(container.querySelector('.herost-corner-accent-tl')).toBeInTheDocument();
      expect(container.querySelector('.herost-corner-accent-br')).toBeInTheDocument();
    });
  });
});
