export type ProductDocumentType = 'COA' | 'SDS' | 'IFU';

export type ProductDocuments = {
  coa: boolean;
  sds: boolean;
  ifu: boolean;
};

export type NetSuiteProductPricing = {
  listPriceUsd: number | null;
  goldPriceUsd: number | null;
  distributorPriceEur: number | null;
};

export type NetSuiteGeneralInformation = {
  productFormat: string;
  strainCharacteristics: string;
  testMethod: string;
  taxonomy: string;
  industryTypes: string[];
};

/** Single product record as returned by a NetSuite / ERP catalog API. */
export type NetSuiteProductRecord = {
  catalogNumber: string;
  productName: string;
  category: string;
  stockStatus: string;
  shortDescription: string;
  prop65Warning?: string;
  images: string[];
  pricing: NetSuiteProductPricing;
  generalInformation: NetSuiteGeneralInformation;
  documents: ProductDocuments;
  breadcrumb?: string[];
};

export type NetSuiteProductCatalog = {
  products: NetSuiteProductRecord[];
};
