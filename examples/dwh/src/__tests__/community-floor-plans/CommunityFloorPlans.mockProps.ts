import type { Field, ImageField, LinkField, Page, ComponentRendering, PageMode } from '@sitecore-content-sdk/nextjs';
import type { FloorPlanItemReferenceField } from '../../components/community-floor-plans/community-floor-plans.props';

const mockPageBase: Page = {
  mode: {
    isEditing: false,
    isPreview: false,
    isNormal: true,
    name: 'normal' as PageMode['name'],
    designLibrary: { isVariantGeneration: false },
    isDesignLibrary: false,
  },
  layout: {
    sitecore: {
      context: {},
      route: null,
    },
  },
  locale: 'en',
};

const mockPageEditing: Page = {
  mode: {
    isEditing: true,
    isPreview: false,
    isNormal: false,
    name: 'edit' as PageMode['name'],
    designLibrary: { isVariantGeneration: false },
    isDesignLibrary: false,
  },
  layout: {
    sitecore: {
      context: {},
      route: null,
    },
  },
  locale: 'en',
};

export const mockPageData = {
  page: mockPageBase,
};

export const mockPageDataEditing = {
  page: mockPageEditing,
};

export const mockPlan1 = {
  url: '/floor-plans/the-walmsley',
  id: 'plan-1',
  name: 'The Walmsley',
  fields: {
    'Plan Name': {
      value: 'The Walmsley',
      editable: 'The Walmsley',
    } as Field<string>,
    Overview: {
      value: '<p>This beautiful two-story Walmsley home blends space and functionality.</p>',
      editable: '<p>This beautiful two-story Walmsley home blends space and functionality.</p>',
    } as Field<string>,
    image1: {
      value: {
        src: '/plan-1.jpg',
        alt: 'The Walmsley',
        width: 800,
        height: 600,
      },
    } as ImageField,
    Stores: { value: '2' } as Field<string>,
    Bedrooms: { value: '5' } as Field<string>,
    'Full Baths': { value: '4' } as Field<string>,
    'Car Garage': { value: '2' } as Field<string>,
    'sq footage': { value: '3209' } as Field<string>,
    price: { value: '527990' } as Field<string>,
  },
};

export const mockPlan2 = {
  url: '/floor-plans/the-forreston',
  id: 'plan-2',
  name: 'The Forreston',
  fields: {
    'Plan Name': {
      value: 'The Forreston',
      editable: 'The Forreston',
    } as Field<string>,
    Overview: {
      value: '<p>A spacious single-story plan with an open-concept living area.</p>',
      editable: '<p>A spacious single-story plan with an open-concept living area.</p>',
    } as Field<string>,
    image1: {
      value: {
        src: '/plan-2.jpg',
        alt: 'The Forreston',
        width: 800,
        height: 600,
      },
    } as ImageField,
  },
};

export const mockPlan3 = {
  url: '/floor-plans/the-raddington',
  id: 'plan-3',
  name: 'The Raddington',
  fields: {
    'Plan Name': {
      value: 'The Raddington',
      editable: 'The Raddington',
    } as Field<string>,
    Overview: {
      value: '<p>Elegant brick exterior with a flexible study and owner&rsquo;s retreat.</p>',
      editable: '<p>Elegant brick exterior with a flexible study and owner&rsquo;s retreat.</p>',
    } as Field<string>,
    image1: {
      value: {
        src: '/plan-3.jpg',
        alt: 'The Raddington',
        width: 800,
        height: 600,
      },
    } as ImageField,
  },
};

export const mockLinkField: LinkField = {
  value: {
    href: '/all-floor-plans',
    text: 'View All Plans',
    title: 'View All Plans',
    linktype: 'internal',
  },
};

export const mockFields = {
  titleOptional: {
    value: 'Home Plans',
    editable: 'Home Plans',
  } as Field<string>,
  descriptionOptional: {
    value: 'Explore available floor plans in this community',
    editable: 'Explore available floor plans in this community',
  } as Field<string>,
  linkOptional: mockLinkField,
  FloorPlans: [mockPlan1, mockPlan2, mockPlan3] as FloorPlanItemReferenceField[],
};

export const mockFieldsWithoutTitle = {
  linkOptional: mockLinkField,
  FloorPlans: [mockPlan1, mockPlan2] as FloorPlanItemReferenceField[],
};

export const mockFieldsWithoutDescription = {
  titleOptional: mockFields.titleOptional,
  linkOptional: mockLinkField,
  FloorPlans: [mockPlan1, mockPlan2] as FloorPlanItemReferenceField[],
};

export const mockFieldsWithoutLink = {
  titleOptional: mockFields.titleOptional,
  descriptionOptional: mockFields.descriptionOptional,
  FloorPlans: [mockPlan1, mockPlan2] as FloorPlanItemReferenceField[],
};

export const mockFieldsOnePlan = {
  titleOptional: mockFields.titleOptional,
  FloorPlans: [mockPlan1] as FloorPlanItemReferenceField[],
};

export const mockFieldsNoPlans = {
  titleOptional: mockFields.titleOptional,
  descriptionOptional: mockFields.descriptionOptional,
  linkOptional: mockLinkField,
  FloorPlans: [] as FloorPlanItemReferenceField[],
};

export const mockParams = {
  styles: 'custom-floor-plans-style',
};

export const mockRendering: ComponentRendering = {
  componentName: 'CommunityFloorPlans',
} as ComponentRendering;

export const defaultProps = {
  params: mockParams,
  fields: mockFields,
  isPageEditing: false,
  rendering: mockRendering,
  page: mockPageBase,
};

export const propsWithoutTitle = {
  params: mockParams,
  fields: mockFieldsWithoutTitle,
  isPageEditing: false,
  rendering: mockRendering,
  page: mockPageBase,
};

export const propsWithoutDescription = {
  params: mockParams,
  fields: mockFieldsWithoutDescription,
  isPageEditing: false,
  rendering: mockRendering,
  page: mockPageBase,
};

export const propsWithoutLink = {
  params: mockParams,
  fields: mockFieldsWithoutLink,
  isPageEditing: false,
  rendering: mockRendering,
  page: mockPageBase,
};

export const propsOnePlan = {
  params: mockParams,
  fields: mockFieldsOnePlan,
  isPageEditing: false,
  rendering: mockRendering,
  page: mockPageBase,
};

export const propsNoPlans = {
  params: mockParams,
  fields: mockFieldsNoPlans,
  isPageEditing: false,
  rendering: mockRendering,
  page: mockPageBase,
};

export const propsEditing = {
  params: mockParams,
  fields: mockFields,
  isPageEditing: true,
  rendering: mockRendering,
  page: mockPageEditing,
};
