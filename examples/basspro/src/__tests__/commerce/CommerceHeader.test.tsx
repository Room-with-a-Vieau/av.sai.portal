import { render, screen, fireEvent } from '@testing-library/react';

jest.mock('lucide-react', () => ({
  ChevronDown: () => <span data-testid="icon-chevron" />,
  MapPin: () => <span data-testid="icon-map" />,
  Menu: () => <span data-testid="icon-menu" />,
  Search: () => <span data-testid="icon-search" />,
  ShoppingCart: () => <span data-testid="icon-cart" />,
  User: () => <span data-testid="icon-user" />,
  X: () => <span data-testid="icon-x" />,
}));

jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: { alt?: string; src: string }) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={props.src} alt={props.alt ?? ''} />
  ),
}));

import { Default as CommerceHeader } from '@/components/commerce/CommerceHeader';

const mockProps = {
  rendering: { componentName: 'CommerceHeader', uid: 'test-uid' },
  params: { styles: 'test-style' },
  page: {
    mode: { isEditing: false, isPreview: false, isNormal: true },
    layout: { sitecore: { route: { placeholders: {} } } },
  },
} as Parameters<typeof CommerceHeader>[0];

describe('CommerceHeader', () => {
  it('renders Bass Pro logo and primary nav categories', () => {
    render(<CommerceHeader {...mockProps} />);

    expect(screen.getByRole('banner')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Bass Pro Shops home/i })).toBeInTheDocument();
    expect(screen.getAllByText('Fishing').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Boating').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Bargain Cave').length).toBeGreaterThan(0);
  });

  it('renders promo bar with marine sale link', () => {
    render(<CommerceHeader {...mockProps} />);
    const promo = screen.getByRole('link', { name: /MARINE SALE/i });
    expect(promo).toHaveAttribute('href', 'https://www.basspro.com/c/marine-sale-and-event');
  });

  it('opens mobile menu when menu button is clicked', () => {
    render(<CommerceHeader {...mockProps} />);
    fireEvent.click(screen.getByRole('button', { name: /open menu/i }));
    expect(screen.getByRole('dialog', { name: /main menu/i })).toBeInTheDocument();
  });

  it('search form posts to Bass Pro search endpoint', () => {
    render(<CommerceHeader {...mockProps} />);
    const forms = document.querySelectorAll('form[action="https://www.basspro.com/shop/SearchDisplay"]');
    expect(forms.length).toBeGreaterThan(0);
  });

  it('opens fishing mega menu on hover', () => {
    render(<CommerceHeader {...mockProps} />);
    const fishingButtons = screen.getAllByRole('button', { name: /^Fishing$/i });
    fireEvent.mouseEnter(fishingButtons[0]);

    expect(screen.getByRole('region', { name: /fishing menu/i })).toBeInTheDocument();
    expect(screen.getByText('Rod & Reel Combos')).toBeInTheDocument();
  });

  it('centers desktop nav and keeps hamburger below xl', () => {
    render(<CommerceHeader {...mockProps} />);
    const navList = document.querySelector('.bps-header__nav-list');
    expect(navList).toHaveClass('justify-center');
    expect(screen.getByRole('button', { name: /open menu/i })).toHaveClass('xl:hidden');
    expect(document.querySelector('.bps-header__nav-bar')).toHaveClass('xl:block');
  });
});
