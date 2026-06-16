import { render, screen } from '@testing-library/react';

import { Default as ProductDetailDefault } from '@/components/product-detail/ProductDetail';

jest.mock('@/utils/NoDataFallback', () => ({
  NoDataFallback: ({ componentName }: { componentName: string }) => (
    <div data-testid="no-data">{componentName}</div>
  ),
}));

jest.mock('lucide-react', () => ({
  Check: () => <span data-testid="check">✓</span>,
  ChevronLeft: () => <span>←</span>,
  ChevronRight: () => <span>→</span>,
  Download: () => <span>↓</span>,
  Eye: () => <span>👁</span>,
  Lock: () => <span>🔒</span>,
}));

jest.mock('next/image', () => ({
  __esModule: true,
  default: ({ src, alt }: { src: string; alt: string }) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt={alt} />
  ),
}));

jest.mock('sonner', () => ({
  toast: { success: jest.fn() },
}));

const baseProps = {
  params: {},
  fields: {
    catalogNumber: { value: 'FP05' },
  },
  rendering: { componentName: 'ProductDetail', uid: 'test-pd' },
  page: { mode: { isEditing: false }, layout: { sitecore: { route: { name: 'Test' } } } },
} as const;

describe('ProductDetail', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it('renders FP05 parasite suspension from bundled NetSuite JSON', () => {
    render(<ProductDetailDefault {...baseProps} />);

    expect(
      screen.getByRole('heading', { name: /Ascaris lumbricoides Parasite Suspension/i }),
    ).toBeInTheDocument();
    expect(screen.getByText(/Catalog No\. FP05/i)).toBeInTheDocument();
    expect(screen.getByText(/Vial contains 1 ml/i)).toBeInTheDocument();
    expect(screen.getByText(/In Stock/i)).toBeInTheDocument();
    expect(screen.getByText(/log in/i)).toBeInTheDocument();
  });

  it('shows general information table rows', () => {
    render(<ProductDetailDefault {...baseProps} />);

    expect(screen.getByRole('rowheader', { name: /Product Format/i })).toBeInTheDocument();
    expect(screen.getByText(/Fecal suspension containing Ascaris lumbricoides/i)).toBeInTheDocument();
    expect(screen.getByText(/Parasite Detection/i)).toBeInTheDocument();
  });

  it('shows not found when catalog number is missing from JSON', () => {
    render(
      <ProductDetailDefault
        {...baseProps}
        fields={{ catalogNumber: { value: 'UNKNOWN-SKU' } }}
      />,
    );

    expect(screen.getByText(/No NetSuite catalog record found/i)).toBeInTheDocument();
    expect(screen.getByText(/UNKNOWN-SKU/i)).toBeInTheDocument();
  });

  it('resolves alternate catalog numbers from JSON', () => {
    render(
      <ProductDetailDefault
        {...baseProps}
        fields={{ catalogNumber: { value: '0681E7' } }}
      />,
    );

    expect(
      screen.getByRole('heading', { name: /Escherichia coli ATCC 8739/i }),
    ).toBeInTheDocument();
  });
});
