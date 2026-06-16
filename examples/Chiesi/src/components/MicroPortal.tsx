'use client';

/**
 * MicroPortal — Authenticated B2B portal demo for SitecoreAI (Microbiologics).
 *
 * Simulates NetSuite-resolved account context: contract pricing, catalog visibility,
 * document access, and layout per authenticated persona. All data is embedded; no API calls.
 *
 * HeaderST integration:
 * - Consumes `profile-change` CustomEvent (detail.profileKey) dispatched by DemoUserSwitcher.
 * - Also listens to `demo-taxonomy-change` and maps taxonomy labels to profile keys.
 * - Optional: wrap the page with `MicroPortalProfileProvider` and set profile via context.
 *
 * Supported personas (profile keys from HeaderST):
 * - laboratory-procurement-manager
 * - distributor-rep
 * - regulatory-professional
 * - scientist
 *
 * Set DEV_MODE to false when HeaderST wiring is verified in production demos.
 */

import type React from 'react';
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import {
  ChevronDown,
  Download,
  Eye,
  FileText,
  Minus,
  Plus,
  Search,
  ShoppingCart,
  X,
} from 'lucide-react';
import { toast } from 'sonner';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import type { ComponentProps } from '@/lib/component-props';
import {
  DEMO_TAXONOMY_CHANGE_EVENT,
  DEMO_TAXONOMY_STORAGE_KEY,
  MICRO_PORTAL_PROFILE_KEYS,
  PROFILE_CHANGE_EVENT,
  PROFILE_KEY_TO_TAXONOMY,
  type MicroPortalProfileKey,
  dispatchProfileChange,
  isMicroPortalProfileKey,
  taxonomyToProfileKey,
} from '@/lib/demo-taxonomy';
import { cn } from '@/lib/utils';

/** Set to false when HeaderST profile wiring is confirmed — hides dev-only persona switcher. */
const DEV_MODE = true;

const TEAL = '#00788A';
const CHARCOAL = '#1a1a1a';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type ProfileKey = MicroPortalProfileKey;

export interface UserProfile {
  key: ProfileKey;
  name: string;
  title: string;
  company: string;
  accountType: string;
  region: string;
  certifications: string[];
  contractTier: string;
  currency: 'USD' | 'EUR' | null;
  documentAccessLabel?: string;
  contextBanner: string;
  mode: 'commerce' | 'documents' | 'search-commerce';
}

export interface Product {
  id: string;
  name: string;
  catalogNumber: string;
  category: string;
  format: string;
  organism: string | null;
  atcc: string | null;
  strain: string | null;
  applications: string[];
  listPrice: number | null;
  goldPrice: number | null;
  distributorPrice: number | null;
  listPriceLabel?: string;
  restricted: false | 'oem' | 'emea-distributor-hidden';
  coa: boolean;
  sds: boolean;
  ifu: boolean;
  inStock: boolean;
  description: string;
  relatedCatalogNumbers?: string[];
}

export interface CartItem {
  productId: string;
  quantity: number;
}

export interface ShipToAddress {
  id: string;
  label: string;
}

export interface ActivityLogEntry {
  id: string;
  time: string;
  eventType: string;
  detail: string;
}

type DocumentType = 'COA' | 'SDS' | 'IFU';

// ---------------------------------------------------------------------------
// Mock data
// ---------------------------------------------------------------------------

const SHIP_TO_ADDRESSES: ShipToAddress[] = [
  { id: 'munich', label: 'BioSupply HQ — Munich, DE' },
  { id: 'hamburg', label: 'BioSupply Warehouse — Hamburg, DE' },
  { id: 'rotterdam', label: 'BioSupply Logistics — Rotterdam, NL' },
];

const USER_PROFILES: Record<ProfileKey, UserProfile> = {
  'healthcare-professional': {
    key: 'healthcare-professional',
    name: 'Dr. Elena Marchetti',
    title: 'Pulmonologist & Rare Disease Specialist',
    company: 'EB Center of Excellence — Milan',
    accountType: 'Verified Healthcare Professional',
    region: 'EMEA — Italy',
    certifications: ['EB Specialist Network', 'HCP Portal Verified'],
    contractTier: 'Clinical Access',
    currency: null,
    documentAccessLabel: 'Document Access: Full HCP Library',
    contextBanner:
      'HCP profile active — prescribing information, SmPC, and clinical briefs prioritized',
    mode: 'documents',
  },
  'patient-advocate': {
    key: 'patient-advocate',
    name: 'Jordan Ellis',
    title: 'Executive Director',
    company: 'Rare Voices Coalition',
    accountType: 'Patient Advocacy Organization',
    region: 'North America — US',
    certifications: ['NORD Member Organization'],
    contractTier: 'Advocacy Partner',
    currency: null,
    documentAccessLabel: 'Document Access: Policy & Coalition Resources',
    contextBanner:
      'Advocate profile active — policy resources and community programs prioritized',
    mode: 'documents',
  },
  caregiver: {
    key: 'caregiver',
    name: 'Maria Santos',
    title: 'Family Caregiver',
    company: 'Caregiver — EB patient household',
    accountType: 'Authenticated Caregiver',
    region: 'North America — US West',
    certifications: ['Chiesi Care Rare enrolled'],
    contractTier: 'Support Access',
    currency: null,
    contextBanner:
      'Caregiver profile active — practical care guides and support program resources prioritized',
    mode: 'commerce',
  },
  'rare-disease-patient': {
    key: 'rare-disease-patient',
    name: 'Alex Chen',
    title: 'Patient Member',
    company: 'Chiesi Care Rare Patient Portal',
    accountType: 'Authenticated Patient',
    region: 'North America — US East',
    certifications: ['Patient support program enrolled'],
    contractTier: 'Patient Access',
    currency: null,
    contextBanner:
      'Patient profile active — personalized disease information and support resources prioritized',
    mode: 'search-commerce',
  },
};

const PRODUCTS: Product[] = [
  {
    id: 'p1',
    name: 'Epower™ E. coli ATCC 8739',
    catalogNumber: '0681E7',
    category: 'QC Microorganisms',
    format: 'EZ-CFU™ One Step',
    organism: 'Escherichia coli',
    atcc: 'ATCC 8739',
    strain: 'E. coli — Gram-negative rod',
    applications: ['USP <61>', 'Pharmaceutical QC', 'Water Testing'],
    listPrice: 125,
    goldPrice: 106.25,
    distributorPrice: 88.5,
    restricted: false,
    coa: true,
    sds: true,
    ifu: true,
    inStock: true,
    description:
      'Quantitated E. coli reference strain for growth promotion and compendial QC workflows. Ready-to-use EZ-CFU format with verified CFU range.',
    relatedCatalogNumbers: ['0659E7', '0733E7'],
  },
  {
    id: 'p2',
    name: 'Epower™ Staphylococcus aureus ATCC 6538',
    catalogNumber: '0659E7',
    category: 'QC Microorganisms',
    format: 'EZ-CFU™ One Step',
    organism: 'Staphylococcus aureus',
    atcc: 'ATCC 6538',
    strain: 'S. aureus — Gram-positive coccus',
    applications: ['USP <51>', 'Antimicrobial Effectiveness'],
    listPrice: 125,
    goldPrice: 106.25,
    distributorPrice: 88.5,
    restricted: false,
    coa: true,
    sds: true,
    ifu: false,
    inStock: true,
    description:
      'Reference strain for antimicrobial effectiveness and preservative efficacy studies with documented passage history.',
    relatedCatalogNumbers: ['0681E7', '0443E7'],
  },
  {
    id: 'p3',
    name: 'Epower™ Pseudomonas aeruginosa ATCC 9027',
    catalogNumber: '0733E7',
    category: 'QC Microorganisms',
    format: 'EZ-CFU™ One Step',
    organism: 'Pseudomonas aeruginosa',
    atcc: 'ATCC 9027',
    strain: 'P. aeruginosa — Gram-negative rod',
    applications: ['USP <62>', 'Pharmaceutical QC'],
    listPrice: 130,
    goldPrice: 110.5,
    distributorPrice: 92,
    restricted: false,
    coa: true,
    sds: true,
    ifu: true,
    inStock: true,
    description:
      'Compendial QC strain for pharmaceutical and environmental monitoring applications.',
    relatedCatalogNumbers: ['0681E7', '0371E7'],
  },
  {
    id: 'p4',
    name: 'Molecular Diagnostics Control — SARS-CoV-2',
    catalogNumber: 'HM-10WR',
    category: 'Molecular QC',
    format: 'Heliyon™ Wrapped',
    organism: 'SARS-CoV-2 (inactivated)',
    atcc: null,
    strain: 'Betacoronavirus — inactivated',
    applications: ['RT-PCR Verification', 'Molecular Diagnostics QC'],
    listPrice: 245,
    goldPrice: 208.25,
    distributorPrice: 174,
    restricted: 'emea-distributor-hidden',
    coa: true,
    sds: true,
    ifu: true,
    inStock: true,
    description:
      'Third-party molecular control material for RT-PCR assay verification and IVD QC programs.',
    relatedCatalogNumbers: [],
  },
  {
    id: 'p5',
    name: 'EZ-Accu Shot™ Select Pack — USP <61> Panel',
    catalogNumber: 'SK-0ASP61',
    category: 'Panels & Kits',
    format: 'Select Pack',
    organism: 'Multi-organism panel',
    atcc: 'Multiple',
    strain: 'Panel — E. coli, S. aureus, P. aeruginosa, Salmonella, C. albicans',
    applications: ['USP <61> Full Panel', 'Compendial Testing'],
    listPrice: 475,
    goldPrice: 403.75,
    distributorPrice: 338,
    restricted: false,
    coa: true,
    sds: true,
    ifu: true,
    inStock: true,
    description:
      'Multi-strain compendial panel for streamlined USP <61> growth promotion testing.',
    relatedCatalogNumbers: ['0681E7', '0659E7', '0443E7'],
  },
  {
    id: 'p6',
    name: 'OEM Custom Formulation — Private Label QC Set',
    catalogNumber: 'OEM-CUSTOM-001',
    category: 'OEM Solutions',
    format: 'Custom',
    organism: null,
    atcc: null,
    strain: null,
    applications: ['OEM Manufacturing QC'],
    listPrice: null,
    goldPrice: null,
    distributorPrice: null,
    listPriceLabel: 'Contact Sales',
    restricted: 'oem',
    coa: false,
    sds: false,
    ifu: false,
    inStock: false,
    description: 'Private label OEM QC formulations — sales engagement required.',
    relatedCatalogNumbers: [],
  },
  {
    id: 'p7',
    name: 'Epower™ Candida albicans ATCC 10231',
    catalogNumber: '0443E7',
    category: 'QC Microorganisms',
    format: 'EZ-CFU™ One Step',
    organism: 'Candida albicans',
    atcc: 'ATCC 10231',
    strain: 'C. albicans — Yeast',
    applications: ['USP <61>', 'Fungal QC', 'Environmental Monitoring'],
    listPrice: 135,
    goldPrice: 114.75,
    distributorPrice: 95.5,
    restricted: false,
    coa: true,
    sds: true,
    ifu: true,
    inStock: true,
    description: 'Yeast reference strain for fungal QC and environmental monitoring programs.',
    relatedCatalogNumbers: ['0681E7', '0659E7'],
  },
  {
    id: 'p8',
    name: 'Epower™ Salmonella enterica ATCC 14028',
    catalogNumber: '0371E7',
    category: 'QC Microorganisms',
    format: 'EZ-CFU™ One Step',
    organism: 'Salmonella enterica subsp. enterica',
    atcc: 'ATCC 14028',
    strain: 'S. enterica — Gram-negative rod',
    applications: ['USP <62>', 'Food Safety', 'Pharmaceutical QC'],
    listPrice: 125,
    goldPrice: 106.25,
    distributorPrice: 88.5,
    restricted: false,
    coa: true,
    sds: true,
    ifu: true,
    inStock: true,
    description:
      'Salmonella reference material for food safety and pharmaceutical compendial testing.',
    relatedCatalogNumbers: ['0681E7', '0733E7'],
  },
];

const LAB_QTY_OPTIONS = [1, 2, 5, 10];
const DISTRIBUTOR_QTY_OPTIONS = [10, 25, 50, 100];

// ---------------------------------------------------------------------------
// HeaderST integration — React Context (optional provider)
// ---------------------------------------------------------------------------

export const MicroPortalProfileContext = createContext<{
  profileKey: ProfileKey | null;
  setProfileKey: (key: ProfileKey) => void;
} | null>(null);

export function MicroPortalProfileProvider({
  children,
  initialProfileKey = 'healthcare-professional',
}: {
  children: React.ReactNode;
  initialProfileKey?: ProfileKey;
}) {
  const [profileKey, setProfileKey] = useState<ProfileKey>(initialProfileKey);
  const value = useMemo(() => ({ profileKey, setProfileKey }), [profileKey]);
  return (
    <MicroPortalProfileContext.Provider value={value}>{children}</MicroPortalProfileContext.Provider>
  );
}

function useActiveProfileKey(): ProfileKey | null {
  const ctx = useContext(MicroPortalProfileContext);
  const [profileKey, setProfileKey] = useState<ProfileKey | null>(() => {
    if (typeof window === 'undefined') return null;
    return taxonomyToProfileKey(localStorage.getItem(DEMO_TAXONOMY_STORAGE_KEY));
  });

  useEffect(() => {
    if (ctx?.profileKey) {
      setProfileKey(ctx.profileKey);
    }
  }, [ctx?.profileKey]);

  useEffect(() => {
    const onProfileChange = (event: Event) => {
      const detail = (event as CustomEvent<{ profileKey?: string | null }>).detail;
      if (detail?.profileKey === null) {
        setProfileKey(null);
        return;
      }
      if (detail?.profileKey && isMicroPortalProfileKey(detail.profileKey)) {
        setProfileKey(detail.profileKey);
      }
    };

    const onTaxonomyChange = (event: Event) => {
      const taxonomy = (event as CustomEvent<{ taxonomy?: string }>).detail?.taxonomy;
      if (!taxonomy?.trim()) {
        setProfileKey(null);
        return;
      }
      const key = taxonomyToProfileKey(taxonomy);
      if (key) setProfileKey(key);
    };

    window.addEventListener(PROFILE_CHANGE_EVENT, onProfileChange);
    window.addEventListener(DEMO_TAXONOMY_CHANGE_EVENT, onTaxonomyChange);

    const stored = taxonomyToProfileKey(localStorage.getItem(DEMO_TAXONOMY_STORAGE_KEY));
    setProfileKey(stored);

    return () => {
      window.removeEventListener(PROFILE_CHANGE_EVENT, onProfileChange);
      window.removeEventListener(DEMO_TAXONOMY_CHANGE_EVENT, onTaxonomyChange);
    };
  }, []);

  return ctx?.profileKey ?? profileKey;
}

// ---------------------------------------------------------------------------
// Utilities
// ---------------------------------------------------------------------------

function nowTimeLabel(): string {
  return new Date().toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true,
  });
}

function formatMoney(amount: number, currency: 'USD' | 'EUR'): string {
  return new Intl.NumberFormat(currency === 'EUR' ? 'de-DE' : 'en-US', {
    style: 'currency',
    currency,
  }).format(amount);
}

function filterProductsForProfile(profileKey: ProfileKey, products: Product[]): Product[] {
  return products.filter((p) => {
    if (p.restricted === 'oem') return false;
    if (p.restricted === 'emea-distributor-hidden' && profileKey === 'caregiver') {
      return false;
    }
    return true;
  });
}

function getUnitPrice(product: Product, profile: UserProfile): number | null {
  if (profile.key === 'caregiver') return product.distributorPrice;
  if (profile.contractTier === 'Gold') return product.goldPrice;
  return product.listPrice;
}

function highlightText(text: string, query: string): React.ReactNode {
  if (!query.trim()) return text;
  const idx = text.toLowerCase().indexOf(query.toLowerCase());
  if (idx < 0) return text;
  return (
    <>
      {text.slice(0, idx)}
      <mark className="rounded bg-teal-100 px-0.5 text-[#00788A]">{text.slice(idx, idx + query.length)}</mark>
      {text.slice(idx + query.length)}
    </>
  );
}

function mockNetSuiteOrderNumber(profileKey: ProfileKey): string {
  const prefix = profileKey === 'caregiver' ? 'SO-EMEA' : 'SO-US';
  return `${prefix}-2026-${String(Math.floor(100000 + Math.random() * 900000))}`;
}

function documentPreviewContent(product: Product, docType: DocumentType) {
  return {
    title: `${docType} — ${product.name}`,
    catalogNumber: product.catalogNumber,
    lotNumber: `LOT-${product.catalogNumber}-A${Math.floor(Math.random() * 900 + 100)}`,
    summary:
      docType === 'COA'
        ? 'Identity confirmed. Viability within specification. No contamination detected.'
        : docType === 'SDS'
          ? 'Hazard classification: Biosafety Level 1 organism. Standard PPE required.'
          : 'Storage: 2–8°C. Rehydration and inoculation per package insert.',
    approvedBy: 'Microbiologics Quality Systems — Released',
  };
}

// ---------------------------------------------------------------------------
// MicroPortal
// ---------------------------------------------------------------------------

function MicroPortalSignInPrompt({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        'micro-portal flex min-h-[320px] flex-col items-center justify-center rounded-lg border border-dashed border-[#00788A]/40 bg-slate-50 px-6 py-16 text-center',
        className
      )}
      data-component="micro-portal"
    >
      <p className="text-lg font-semibold text-[#1a1a1a]">B2B Portal</p>
      <p className="mt-2 max-w-md text-sm text-slate-600">
        Sign in using the header login menu and select a demo persona to load your NetSuite account
        context — pricing, catalog, and document access.
      </p>
    </div>
  );
}

function MicroPortalInner({ className }: { className?: string }) {
  const profileKey = useActiveProfileKey();
  if (!profileKey) {
    return <MicroPortalSignInPrompt className={className} />;
  }
  return <MicroPortalAuthenticated profileKey={profileKey} className={className} />;
}

function MicroPortalAuthenticated({
  profileKey,
  className,
}: {
  profileKey: ProfileKey;
  className?: string;
}) {
  const profile = USER_PROFILES[profileKey];

  const [contextBannerVisible, setContextBannerVisible] = useState(false);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [shipToId, setShipToId] = useState(SHIP_TO_ADDRESSES[0]?.id ?? '');
  const [distributorPoRef, setDistributorPoRef] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [selectedDocProductIds, setSelectedDocProductIds] = useState<string[]>([]);
  const [previewDoc, setPreviewDoc] = useState<{ product: Product; type: DocumentType } | null>(
    null
  );
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [orderConfirmation, setOrderConfirmation] = useState<{
    orderNumber: string;
    poRef?: string;
    lines: Array<CartItem & { product: Product; unitPrice: number | null }>;
  } | null>(null);
  const [activityLog, setActivityLog] = useState<ActivityLogEntry[]>([]);
  const [logOpen, setLogOpen] = useState(true);

  const appendLog = useCallback((eventType: string, detail: string) => {
    setActivityLog((prev) => [
      {
        id: `${Date.now()}-${Math.random()}`,
        time: nowTimeLabel(),
        eventType,
        detail,
      },
      ...prev,
    ]);
  }, []);

  useEffect(() => {
    appendLog('LOGIN', `${profile.name} — ${profile.company}`);
    setContextBannerVisible(true);
    setCart([]);
    setSelectedProductId(null);
    setSearchQuery('');
    setCategoryFilter('all');
    setSelectedDocProductIds([]);
    const t = window.setTimeout(() => setContextBannerVisible(false), 6000);
    return () => window.clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- intentional on profile switch
  }, [profileKey]);

  const visibleProducts = useMemo(
    () => filterProductsForProfile(profileKey, PRODUCTS),
    [profileKey]
  );

  const filteredProducts = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return visibleProducts.filter((p) => {
      if (categoryFilter !== 'all' && p.category !== categoryFilter) return false;
      if (!q) return true;
      const hay = [
        p.name,
        p.catalogNumber,
        p.organism ?? '',
        p.atcc ?? '',
        p.strain ?? '',
        p.category,
        p.format,
        ...p.applications,
      ]
        .join(' ')
        .toLowerCase();
      return hay.includes(q);
    });
  }, [visibleProducts, searchQuery, categoryFilter]);

  const cartLines = useMemo(() => {
    return cart
      .map((line) => {
        const product = PRODUCTS.find((p) => p.id === line.productId);
        if (!product) return null;
        const unit = getUnitPrice(product, profile);
        return { ...line, product, unitPrice: unit };
      })
      .filter(Boolean) as Array<CartItem & { product: Product; unitPrice: number | null }>;
  }, [cart, profile]);

  const cartTotal = useMemo(() => {
    if (!profile.currency) return 0;
    return cartLines.reduce((sum, line) => sum + (line.unitPrice ?? 0) * line.quantity, 0);
  }, [cartLines, profile.currency]);

  const qtyOptions =
    profileKey === 'caregiver' ? DISTRIBUTOR_QTY_OPTIONS : LAB_QTY_OPTIONS;

  const addToCart = (product: Product, qty = qtyOptions[0] ?? 1) => {
    setCart((prev) => {
      const existing = prev.find((c) => c.productId === product.id);
      if (existing) {
        return prev.map((c) =>
          c.productId === product.id ? { ...c, quantity: c.quantity + qty } : c
        );
      }
      return [...prev, { productId: product.id, quantity: qty }];
    });
    appendLog('ADD_TO_CART', `Catalog #${product.catalogNumber} — ${product.name} (qty ${qty})`);
    toast.success('Added to cart', { description: product.catalogNumber });
  };

  const updateCartQty = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      setCart((prev) => prev.filter((c) => c.productId !== productId));
      return;
    }
    setCart((prev) => prev.map((c) => (c.productId === productId ? { ...c, quantity } : c)));
    const product = PRODUCTS.find((p) => p.id === productId);
    appendLog('QUANTITY_CHANGE', `Catalog #${product?.catalogNumber ?? productId} → qty ${quantity}`);
  };

  const downloadDocument = (product: Product, type: DocumentType, batch = false) => {
    appendLog(
      batch ? 'BATCH_COA_DOWNLOAD' : `${type}_DOWNLOAD`,
      `Catalog #${product.catalogNumber} — ${product.name}`
    );
    toast.success(`${type} download started`, {
      description: `${product.catalogNumber} — simulated file delivery`,
    });
  };

  const submitOrder = () => {
    appendLog('CHECKOUT_INITIATED', `Cart total ${formatMoney(cartTotal, profile.currency ?? 'USD')}`);
    const orderNumber = mockNetSuiteOrderNumber(profileKey);
    const submittedLines = [...cartLines];
    setOrderConfirmation({
      orderNumber,
      poRef: profileKey === 'caregiver' ? distributorPoRef || undefined : undefined,
      lines: submittedLines,
    });
    appendLog('ORDER_SUBMITTED', `NetSuite ${orderNumber}`);
    setCheckoutOpen(false);
    setCart([]);
    toast.success('Order submitted to NetSuite', { description: orderNumber });
  };

  const selectedProduct = selectedProductId
    ? visibleProducts.find((p) => p.id === selectedProductId) ?? null
    : null;

  const categories = useMemo(
    () => ['all', ...Array.from(new Set(visibleProducts.map((p) => p.category)))],
    [visibleProducts]
  );

  return (
    <div
      className={cn('micro-portal min-h-[480px] bg-white text-[#1a1a1a] transition-opacity duration-300', className)}
      data-component="micro-portal"
    >
      {DEV_MODE && (
        <div className="border-b border-dashed border-[#00788A]/40 bg-slate-50 px-4 py-3">
          <p className="mb-2 text-xs font-medium uppercase tracking-wide text-slate-500">
            Dev-only persona switcher (hidden when DEV_MODE is false)
          </p>
          <Select
            value={profileKey}
            onValueChange={(value) => {
              if (!isMicroPortalProfileKey(value)) return;
              dispatchProfileChange(value, PROFILE_KEY_TO_TAXONOMY[value]);
              localStorage.setItem(DEMO_TAXONOMY_STORAGE_KEY, PROFILE_KEY_TO_TAXONOMY[value]);
              window.dispatchEvent(
                new CustomEvent(DEMO_TAXONOMY_CHANGE_EVENT, {
                  detail: { taxonomy: PROFILE_KEY_TO_TAXONOMY[value] },
                })
              );
            }}
          >
            <SelectTrigger className="max-w-md">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {MICRO_PORTAL_PROFILE_KEYS.map((key) => (
                <SelectItem key={key} value={key}>
                  {USER_PROFILES[key].name} — {USER_PROFILES[key].company}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      <div
        className={cn(
          'overflow-hidden border-b border-[#00788A]/20 bg-[#00788A]/10 px-4 py-2 text-sm text-[#00788A] transition-all duration-500',
          contextBannerVisible ? 'max-h-20 opacity-100' : 'max-h-0 opacity-0 py-0'
        )}
      >
        {profile.contextBanner}
      </div>

      <div className="border-b border-slate-200 bg-slate-50 px-4 py-4 md:px-6">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-lg font-semibold" style={{ color: CHARCOAL }}>
              {profile.name}
            </p>
            <p className="text-sm text-slate-600">
              {profile.title} · {profile.company}
            </p>
          </div>
          <div className="flex flex-wrap gap-2 text-xs">
            <Badge variant="outline">{profile.accountType}</Badge>
            <Badge variant="outline">{profile.region}</Badge>
            {profile.certifications.map((c) => (
              <Badge key={c} className="border-[#00788A]/30 bg-[#00788A]/10 text-[#00788A]">
                {c}
              </Badge>
            ))}
            <Badge style={{ backgroundColor: TEAL }} className="text-white">
              {profile.contractTier}
            </Badge>
            {profile.currency && <Badge variant="secondary">{profile.currency}</Badge>}
            {profile.documentAccessLabel && (
              <Badge variant="secondary">{profile.documentAccessLabel}</Badge>
            )}
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-6 md:px-6">
        {profile.mode === 'documents' && (
          <RegulatoryView
            products={visibleProducts}
            searchQuery={searchQuery}
            onSearchChange={(q) => {
              setSearchQuery(q);
              if (q.trim()) appendLog('SEARCH', q);
            }}
            selectedIds={selectedDocProductIds}
            onToggleSelect={(id, checked) => {
              setSelectedDocProductIds((prev) =>
                checked ? [...prev, id] : prev.filter((x) => x !== id)
              );
            }}
            onPreview={(product, type) => {
              setPreviewDoc({ product, type });
              appendLog('DOCUMENT_PREVIEW', `${type} — ${product.catalogNumber}`);
            }}
            onDownload={downloadDocument}
            onBatchCoa={() => {
              selectedDocProductIds.forEach((id) => {
                const p = PRODUCTS.find((x) => x.id === id);
                if (p?.coa) downloadDocument(p, 'COA', true);
              });
              toast.success('Batch COA download queued');
            }}
          />
        )}

        {profile.mode === 'search-commerce' && (
          <ScientistView
            products={filteredProducts}
            searchQuery={searchQuery}
            categoryFilter={categoryFilter}
            categories={categories}
            onSearchChange={(q) => {
              setSearchQuery(q);
              if (q.trim()) appendLog('SEARCH', q);
            }}
            onCategoryChange={(c) => {
              setCategoryFilter(c);
              appendLog('FILTER_CHANGE', `Category: ${c}`);
            }}
            selectedProduct={selectedProduct}
            onSelectProduct={(id) => {
              setSelectedProductId(id);
              const p = PRODUCTS.find((x) => x.id === id);
              if (p) appendLog('PRODUCT_VIEW', p.catalogNumber);
            }}
            onCloseDetail={() => setSelectedProductId(null)}
            profile={profile}
            qtyOptions={qtyOptions}
            onAddToCart={addToCart}
            onDownload={downloadDocument}
            highlightText={highlightText}
            cartPanel={
              <CartPanel
                profile={profile}
                lines={cartLines}
                total={cartTotal}
                onUpdateQty={updateCartQty}
                onCheckout={() => {
                  setCheckoutOpen(true);
                  appendLog('CHECKOUT_INITIATED', 'Scientist cart checkout');
                }}
                compact
              />
            }
          />
        )}

        {profile.mode === 'commerce' && (
          <CommerceView
            profile={profile}
            profileKey={profileKey}
            products={filteredProducts}
            onProductView={(p) => appendLog('PRODUCT_VIEW', p.catalogNumber)}
            onAddToCart={addToCart}
            onDownload={downloadDocument}
            qtyOptions={qtyOptions}
            shipToId={shipToId}
            onShipToChange={(id) => {
              setShipToId(id);
              appendLog('SHIP_TO_SELECTED', SHIP_TO_ADDRESSES.find((s) => s.id === id)?.label ?? id);
            }}
            cartLines={cartLines}
            cartTotal={cartTotal}
            onUpdateQty={updateCartQty}
            onCheckout={() => setCheckoutOpen(true)}
            onBatchCoa={() => {
              cartLines.forEach((l) => downloadDocument(l.product, 'COA', true));
            }}
          />
        )}
      </div>

      <Collapsible open={logOpen} onOpenChange={setLogOpen} className="border-t border-slate-200 bg-slate-50">
        <CollapsibleTrigger asChild>
          <button
            type="button"
            className="flex w-full items-center justify-between px-4 py-3 text-left text-sm font-medium md:px-6"
          >
            Platform Activity Log
            <ChevronDown className={cn('h-4 w-4 transition-transform', logOpen && 'rotate-180')} />
          </button>
        </CollapsibleTrigger>
        <CollapsibleContent className="px-4 pb-4 md:px-6">
          <p className="mb-3 text-xs text-slate-600">
            In production, all events are captured at the platform level for compliance audit,
            analytics attribution, and downstream system integration.
          </p>
          <div className="max-h-48 overflow-y-auto rounded-md border border-slate-200 bg-white font-mono text-xs">
            {activityLog.length === 0 ? (
              <p className="p-3 text-slate-500">No activity yet.</p>
            ) : (
              activityLog.map((entry) => (
                <div
                  key={entry.id}
                  className="border-b border-slate-100 px-3 py-2 last:border-0"
                >
                  [{entry.time}] | {entry.eventType} | {entry.detail}
                </div>
              ))
            )}
          </div>
        </CollapsibleContent>
      </Collapsible>

      <Dialog open={checkoutOpen} onOpenChange={setCheckoutOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Submit order to NetSuite</DialogTitle>
            <DialogDescription>
              Review your order. Pricing and availability were resolved from your account record.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-2 text-sm">
            {cartLines.map((line) => (
              <div key={line.productId} className="flex justify-between gap-4">
                <span>
                  {line.product.catalogNumber} × {line.quantity}
                </span>
                <span>
                  {line.unitPrice != null && profile.currency
                    ? formatMoney(line.unitPrice * line.quantity, profile.currency)
                    : '—'}
                </span>
              </div>
            ))}
            <Separator />
            <div className="flex justify-between font-semibold">
              <span>Total</span>
              <span>
                {profile.currency ? formatMoney(cartTotal, profile.currency) : '—'}
              </span>
            </div>
            {profileKey === 'caregiver' && (
              <div className="space-y-1 pt-2">
                <Label htmlFor="po-ref">Distributor PO Reference</Label>
                <Input
                  id="po-ref"
                  value={distributorPoRef}
                  onChange={(e) => setDistributorPoRef(e.target.value)}
                  placeholder="Your internal PO number"
                />
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCheckoutOpen(false)}>
              Cancel
            </Button>
            <Button style={{ backgroundColor: TEAL }} className="text-white" onClick={submitOrder}>
              Submit to NetSuite
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={Boolean(orderConfirmation)} onOpenChange={() => setOrderConfirmation(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Order confirmed</DialogTitle>
            <DialogDescription>
              NetSuite Sales Order {orderConfirmation?.orderNumber}
              {orderConfirmation?.poRef ? ` · PO Ref: ${orderConfirmation.poRef}` : ''}
            </DialogDescription>
          </DialogHeader>
          {profileKey === 'caregiver' && (orderConfirmation?.lines.length ?? 0) > 0 && (
            <Button
              variant="outline"
              className="w-full"
              onClick={() => {
                orderConfirmation?.lines.forEach((line) => downloadDocument(line.product, 'COA', true));
              }}
            >
              <Download className="mr-2 h-4 w-4" />
              Batch Download COAs
            </Button>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={Boolean(previewDoc)} onOpenChange={() => setPreviewDoc(null)}>
        <DialogContent className="max-w-2xl">
          {previewDoc && (
            <>
              <DialogHeader>
                <DialogTitle>{previewDoc.type} Preview</DialogTitle>
                <DialogDescription>{previewDoc.product.name}</DialogDescription>
              </DialogHeader>
              {(() => {
                const content = documentPreviewContent(previewDoc.product, previewDoc.type);
                return (
                  <div className="space-y-3 rounded-md border border-slate-200 bg-slate-50 p-4 text-sm">
                    <p className="font-semibold">{content.title}</p>
                    <p>Catalog #: {content.catalogNumber}</p>
                    <p>Lot #: {content.lotNumber}</p>
                    <Separator />
                    <p>{content.summary}</p>
                    <p className="text-slate-600">{content.approvedBy}</p>
                  </div>
                );
              })()}
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Sub-views
// ---------------------------------------------------------------------------

function PriceBlock({
  product,
  profile,
}: {
  product: Product;
  profile: UserProfile;
}) {
  if (profile.key === 'patient-advocate') return null;
  const unit = getUnitPrice(product, profile);
  if (product.listPriceLabel) {
    return <p className="text-sm font-medium text-slate-600">{product.listPriceLabel}</p>;
  }
  if (unit == null || !profile.currency) return null;
  return (
    <div className="text-sm">
      {profile.contractTier === 'Gold' && product.listPrice != null && (
        <span className="mr-2 text-slate-400 line-through">
          {formatMoney(product.listPrice, profile.currency === 'EUR' ? 'EUR' : 'USD')}
        </span>
      )}
      <span className="font-semibold" style={{ color: TEAL }}>
        {formatMoney(unit, profile.currency)}
      </span>
    </div>
  );
}

function DocumentButtons({
  product,
  onDownload,
  onPreview,
}: {
  product: Product;
  onDownload: (p: Product, t: DocumentType) => void;
  onPreview?: (p: Product, t: DocumentType) => void;
}) {
  const items: DocumentType[] = [];
  if (product.coa) items.push('COA');
  if (product.sds) items.push('SDS');
  if (product.ifu) items.push('IFU');
  return (
    <div className="flex flex-wrap gap-1">
      {items.map((type) => (
        <Button
          key={type}
          type="button"
          size="sm"
          variant="outline"
          className="h-8 text-xs"
          onClick={() => onDownload(product, type)}
        >
          <Download className="mr-1 h-3 w-3" />
          {type}
        </Button>
      ))}
      {onPreview &&
        items.map((type) => (
          <Button
            key={`prev-${type}`}
            type="button"
            size="sm"
            variant="ghost"
            className="h-8 text-xs"
            onClick={() => onPreview(product, type)}
          >
            <Eye className="mr-1 h-3 w-3" />
            Preview {type}
          </Button>
        ))}
    </div>
  );
}

function CommerceView({
  profile,
  profileKey,
  products,
  onAddToCart,
  onDownload,
  onProductView,
  qtyOptions,
  shipToId,
  onShipToChange,
  cartLines,
  cartTotal,
  onUpdateQty,
  onCheckout,
  onBatchCoa,
}: {
  profile: UserProfile;
  profileKey: ProfileKey;
  products: Product[];
  onAddToCart: (p: Product, qty?: number) => void;
  onDownload: (p: Product, t: DocumentType) => void;
  onProductView: (p: Product) => void;
  qtyOptions: number[];
  shipToId: string;
  onShipToChange: (id: string) => void;
  cartLines: Array<CartItem & { product: Product; unitPrice: number | null }>;
  cartTotal: number;
  onUpdateQty: (id: string, qty: number) => void;
  onCheckout: () => void;
  onBatchCoa: () => void;
}) {
  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
      <div>
        {profileKey === 'caregiver' && (
          <div className="mb-4 max-w-md">
            <Label className="mb-1 block text-sm">Ship-to Address</Label>
            <Select value={shipToId} onValueChange={onShipToChange}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {SHIP_TO_ADDRESSES.map((a) => (
                  <SelectItem key={a.id} value={a.id}>
                    {a.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {products.map((product) => (
            <Card
              key={product.id}
              className="border-slate-200 shadow-sm transition-shadow hover:shadow-md"
              onMouseEnter={() => onProductView(product)}
            >
              <CardHeader className="pb-2">
                <CardTitle className="text-base leading-snug">{product.name}</CardTitle>
                <p className="text-xs text-slate-500">Catalog #{product.catalogNumber}</p>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <p className="text-slate-600">{product.organism}</p>
                <PriceBlock product={product} profile={profile} />
                <DocumentButtons product={product} onDownload={onDownload} />
              </CardContent>
              <CardFooter className="flex flex-wrap gap-2">
                {qtyOptions.slice(0, 3).map((qty) => (
                  <Button
                    key={qty}
                    size="sm"
                    variant="outline"
                    onClick={() => onAddToCart(product, qty)}
                  >
                    Add {qty}
                  </Button>
                ))}
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
      <CartPanel
        profile={profile}
        lines={cartLines}
        total={cartTotal}
        onUpdateQty={onUpdateQty}
        onCheckout={onCheckout}
        onBatchCoa={profileKey === 'caregiver' ? onBatchCoa : undefined}
      />
    </div>
  );
}

function CartPanel({
  profile,
  lines,
  total,
  onUpdateQty,
  onCheckout,
  onBatchCoa,
  compact,
}: {
  profile: UserProfile;
  lines: Array<CartItem & { product: Product; unitPrice: number | null }>;
  total: number;
  onUpdateQty: (id: string, qty: number) => void;
  onCheckout: () => void;
  onBatchCoa?: () => void;
  compact?: boolean;
}) {
  return (
    <Card className={cn('border-slate-200', compact ? 'mt-4' : 'sticky top-4 h-fit')}>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-base">
          <ShoppingCart className="h-4 w-4" />
          Cart ({lines.length})
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 text-sm">
        {lines.length === 0 ? (
          <p className="text-slate-500">No items in cart.</p>
        ) : (
          lines.map((line) => (
            <div key={line.productId} className="flex items-start justify-between gap-2 border-b border-slate-100 pb-2">
              <div className="min-w-0 flex-1">
                <p className="truncate font-medium">{line.product.catalogNumber}</p>
                <div className="mt-1 flex items-center gap-1">
                  <Button
                    type="button"
                    size="icon"
                    variant="outline"
                    className="h-7 w-7"
                    onClick={() => onUpdateQty(line.productId, line.quantity - 1)}
                  >
                    <Minus className="h-3 w-3" />
                  </Button>
                  <span className="w-8 text-center">{line.quantity}</span>
                  <Button
                    type="button"
                    size="icon"
                    variant="outline"
                    className="h-7 w-7"
                    onClick={() => onUpdateQty(line.productId, line.quantity + 1)}
                  >
                    <Plus className="h-3 w-3" />
                  </Button>
                </div>
              </div>
              <span className="shrink-0 text-xs">
                {line.unitPrice != null && profile.currency
                  ? formatMoney(line.unitPrice * line.quantity, profile.currency)
                  : '—'}
              </span>
            </div>
          ))
        )}
        {lines.length > 0 && profile.currency && (
          <>
            <div className="flex justify-between font-semibold">
              <span>Total</span>
              <span>{formatMoney(total, profile.currency)}</span>
            </div>
            <Button
              className="w-full text-white"
              style={{ backgroundColor: TEAL }}
              onClick={onCheckout}
            >
              Checkout
            </Button>
            {onBatchCoa && (
              <Button type="button" variant="outline" className="w-full" onClick={onBatchCoa}>
                <Download className="mr-2 h-4 w-4" />
                Batch Download COAs
              </Button>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}

function RegulatoryView({
  products,
  searchQuery,
  onSearchChange,
  selectedIds,
  onToggleSelect,
  onPreview,
  onDownload,
  onBatchCoa,
}: {
  products: Product[];
  searchQuery: string;
  onSearchChange: (q: string) => void;
  selectedIds: string[];
  onToggleSelect: (id: string, checked: boolean) => void;
  onPreview: (p: Product, t: DocumentType) => void;
  onDownload: (p: Product, t: DocumentType) => void;
  onBatchCoa: () => void;
}) {
  const filtered = products.filter((p) => {
    const q = searchQuery.toLowerCase();
    if (!q) return true;
    return [p.catalogNumber, p.name, p.organism ?? '', p.category]
      .join(' ')
      .toLowerCase()
      .includes(q);
  });

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <Input
            className="pl-9"
            placeholder="Search by catalog number, organism, or document type"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>
        <Button
          variant="outline"
          disabled={selectedIds.length === 0}
          onClick={onBatchCoa}
        >
          <Download className="mr-2 h-4 w-4" />
          Batch Download COAs ({selectedIds.length})
        </Button>
      </div>
      <div className="overflow-x-auto rounded-md border border-slate-200">
        <Table>
          <TableHeader>
            <TableRow className="bg-slate-50">
              <TableHead className="w-10" />
              <TableHead>Catalog #</TableHead>
              <TableHead>Product Name</TableHead>
              <TableHead>Organism</TableHead>
              <TableHead>COA</TableHead>
              <TableHead>SDS</TableHead>
              <TableHead>IFU</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((product, i) => (
              <TableRow key={product.id} className={i % 2 === 1 ? 'bg-slate-50/80' : undefined}>
                <TableCell>
                  <Checkbox
                    checked={selectedIds.includes(product.id)}
                    onCheckedChange={(c) => onToggleSelect(product.id, Boolean(c))}
                  />
                </TableCell>
                <TableCell className="font-mono text-xs">{product.catalogNumber}</TableCell>
                <TableCell>{product.name}</TableCell>
                <TableCell className="text-slate-600">{product.organism ?? '—'}</TableCell>
                <TableCell>
                  {product.coa && (
                    <DocCell product={product} type="COA" onDownload={onDownload} onPreview={onPreview} />
                  )}
                </TableCell>
                <TableCell>
                  {product.sds && (
                    <DocCell product={product} type="SDS" onDownload={onDownload} onPreview={onPreview} />
                  )}
                </TableCell>
                <TableCell>
                  {product.ifu && (
                    <DocCell product={product} type="IFU" onDownload={onDownload} onPreview={onPreview} />
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

function DocCell({
  product,
  type,
  onDownload,
  onPreview,
}: {
  product: Product;
  type: DocumentType;
  onDownload: (p: Product, t: DocumentType) => void;
  onPreview: (p: Product, t: DocumentType) => void;
}) {
  return (
    <div className="flex gap-1">
      <Button size="sm" variant="outline" className="h-7 px-2 text-xs" onClick={() => onDownload(product, type)}>
        <Download className="h-3 w-3" />
      </Button>
      <Button size="sm" variant="ghost" className="h-7 px-2 text-xs" onClick={() => onPreview(product, type)}>
        <Eye className="h-3 w-3" />
      </Button>
    </div>
  );
}

function ScientistView({
  products,
  searchQuery,
  categoryFilter,
  categories,
  onSearchChange,
  onCategoryChange,
  selectedProduct,
  onSelectProduct,
  onCloseDetail,
  profile,
  qtyOptions,
  onAddToCart,
  onDownload,
  highlightText,
  cartPanel,
}: {
  products: Product[];
  searchQuery: string;
  categoryFilter: string;
  categories: string[];
  onSearchChange: (q: string) => void;
  onCategoryChange: (c: string) => void;
  selectedProduct: Product | null;
  onSelectProduct: (id: string) => void;
  onCloseDetail: () => void;
  profile: UserProfile;
  qtyOptions: number[];
  onAddToCart: (p: Product, qty?: number) => void;
  onDownload: (p: Product, t: DocumentType) => void;
  highlightText: (text: string, query: string) => React.ReactNode;
  cartPanel: React.ReactNode;
}) {
  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_300px]">
      <div>
        <div className="mb-4 space-y-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <Input
              className="pl-9"
              placeholder="Search by organism, ATCC number, catalog number, application, or strain designation"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
            />
          </div>
          <Select value={categoryFilter} onValueChange={onCategoryChange}>
            <SelectTrigger className="max-w-xs">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((c) => (
                <SelectItem key={c} value={c}>
                  {c === 'all' ? 'All categories' : c}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="grid gap-4">
          {products.map((product) => (
            <Card
              key={product.id}
              className={cn(
                'cursor-pointer border-slate-200 transition-shadow hover:shadow-md',
                selectedProduct?.id === product.id && 'ring-2 ring-[#00788A]/40'
              )}
              onClick={() => onSelectProduct(product.id)}
            >
              <CardContent className="flex flex-col gap-3 p-4 sm:flex-row">
                <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-md bg-slate-100">
                  <FileText className="h-8 w-8 text-slate-400" />
                </div>
                <div className="min-w-0 flex-1 space-y-1 text-sm">
                  <p className="font-semibold">
                    {highlightText(product.name, searchQuery)}
                  </p>
                  <p className="text-slate-600">
                    {highlightText(product.organism ?? '', searchQuery)} · {product.atcc ?? 'N/A'}
                  </p>
                  <p className="text-xs text-slate-500">{product.strain}</p>
                  <div className="flex flex-wrap gap-1 pt-1">
                    {product.applications.map((app) => (
                      <Badge key={app} variant="secondary" className="text-xs">
                        {highlightText(app, searchQuery)}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {selectedProduct && (
          <Card className="mt-6 border-[#00788A]/30">
            <CardHeader className="flex flex-row items-start justify-between">
              <div>
                <CardTitle>{selectedProduct.name}</CardTitle>
                <p className="text-sm text-slate-500">Catalog #{selectedProduct.catalogNumber}</p>
              </div>
              <Button type="button" size="icon" variant="ghost" onClick={onCloseDetail}>
                <X className="h-4 w-4" />
              </Button>
            </CardHeader>
            <CardContent className="space-y-4 text-sm">
              <p>{selectedProduct.description}</p>
              <div>
                <p className="mb-1 font-medium">Applications</p>
                <div className="flex flex-wrap gap-1">
                  {selectedProduct.applications.map((a) => (
                    <Badge key={a} variant="outline">
                      {a}
                    </Badge>
                  ))}
                </div>
              </div>
              {selectedProduct.relatedCatalogNumbers &&
                selectedProduct.relatedCatalogNumbers.length > 0 && (
                  <div>
                    <p className="mb-1 font-medium">Other formats of this organism</p>
                    <p className="text-slate-600">
                      {selectedProduct.relatedCatalogNumbers.join(', ')}
                    </p>
                  </div>
                )}
              <DocumentButtons
                product={selectedProduct}
                onDownload={onDownload}
              />
              <PriceBlock product={selectedProduct} profile={profile} />
              <div className="flex flex-wrap gap-2">
                {qtyOptions.slice(0, 3).map((qty) => (
                  <Button
                    key={qty}
                    size="sm"
                    style={{ backgroundColor: TEAL }}
                    className="text-white"
                    onClick={() => onAddToCart(selectedProduct, qty)}
                  >
                    Add {qty} to Cart
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
      <div>{cartPanel}</div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// SitecoreAI export
// ---------------------------------------------------------------------------

export function MicroPortal({ className }: { className?: string }) {
  return <MicroPortalInner className={className} />;
}

export const Default: React.FC<ComponentProps> = (props) => {
  return <MicroPortal className={props.params?.styles} />;
};

export default MicroPortal;
