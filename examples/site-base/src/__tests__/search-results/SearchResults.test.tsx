import React from 'react';
import { render, screen } from '@testing-library/react';

import { SearchResults } from '@/components/search-results/SearchResults';

jest.mock('lucide-react', () => {
  const Icon = () => null;
  return new Proxy(
    {},
    {
      get: () => Icon,
    }
  );
});

jest.mock('next/navigation', () => ({
  useRouter: () => ({ replace: jest.fn() }),
  usePathname: () => '/acme/en/Search-Results',
  useSearchParams: () => new URLSearchParams(),
  useParams: () => ({ site: 'acme', locale: 'en' }),
}));

jest.mock('next/link', () => ({
  __esModule: true,
  default: ({
    href,
    children,
    ...rest
  }: {
    href: string;
    children: React.ReactNode;
    className?: string;
  }) => (
    <a href={href} {...rest}>
      {children}
    </a>
  ),
}));

jest.mock('@sitecore-content-sdk/nextjs', () => ({
  useSitecore: () => ({
    page: {
      siteName: 'acme',
      mode: { isEditing: false, isDesignLibrary: false },
    },
  }),
}));

describe('SearchResults site packs', () => {
  it('renders the generic empty catalog, not leftover client content', () => {
    render(<SearchResults siteName="acme" disableUrlSync initialQuery="super spacer" />);

    expect(screen.getByText('Site search')).toBeInTheDocument();
    expect(screen.queryByText('Quanex search')).not.toBeInTheDocument();
    expect(screen.queryByText('Pillsbury search')).not.toBeInTheDocument();
    expect(screen.queryByRole('heading', { name: 'Super Spacer' })).not.toBeInTheDocument();
    expect(screen.queryByRole('heading', { name: /Mark Abate/i })).not.toBeInTheDocument();
  });
});
