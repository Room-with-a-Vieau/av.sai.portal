import type { Field, ImageField, LinkField, Page, ComponentRendering, PageMode } from '@sitecore-content-sdk/nextjs';
import type { CommunityItemReferenceField } from '../../components/featured-communities/featured-communities.props';

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

export const mockCommunity1 = {
  url: '/communities/sandbrock-ranch',
  id: 'community-1',
  name: 'Sandbrock Ranch',
  fields: {
    Name: {
      value: 'Sandbrock Ranch',
      editable: 'Sandbrock Ranch',
    } as Field<string>,
    Overview: {
      value: '<p>Beautiful David Weekley homes now available in Sandbrock Ranch.</p>',
      editable: '<p>Beautiful David Weekley homes now available in Sandbrock Ranch.</p>',
    } as Field<string>,
    Image1: {
      value: {
        src: '/community-1.jpg',
        alt: 'Sandbrock Ranch',
        width: 800,
        height: 600,
      },
    } as ImageField,
  },
};

export const mockCommunity2 = {
  url: '/communities/highland-park',
  id: 'community-2',
  name: 'Highland Park Reserve',
  fields: {
    Name: {
      value: 'Highland Park Reserve',
      editable: 'Highland Park Reserve',
    } as Field<string>,
    Overview: {
      value: '<p>Master-planned community with miles of tranquil trails.</p>',
      editable: '<p>Master-planned community with miles of tranquil trails.</p>',
    } as Field<string>,
    Image1: {
      value: {
        src: '/community-2.jpg',
        alt: 'Highland Park Reserve',
        width: 800,
        height: 600,
      },
    } as ImageField,
  },
};

export const mockCommunity3 = {
  url: '/communities/lakewood-ranch',
  id: 'community-3',
  name: 'Lakewood Ranch',
  fields: {
    Name: {
      value: 'Lakewood Ranch',
      editable: 'Lakewood Ranch',
    } as Field<string>,
    Overview: {
      value: '<p>Award-winning floor plans on spacious homesites.</p>',
      editable: '<p>Award-winning floor plans on spacious homesites.</p>',
    } as Field<string>,
    Image1: {
      value: {
        src: '/community-3.jpg',
        alt: 'Lakewood Ranch',
        width: 800,
        height: 600,
      },
    } as ImageField,
  },
};

export const mockCommunity4 = {
  url: '/communities/greely-farms',
  id: 'community-4',
  name: 'Greely Farms',
  fields: {
    Name: {
      value: 'Greely Farms',
      editable: 'Greely Farms',
    } as Field<string>,
    Overview: {
      value: '<p>Convenient access to dining, shopping, and major highways.</p>',
      editable: '<p>Convenient access to dining, shopping, and major highways.</p>',
    } as Field<string>,
    Image1: {
      value: {
        src: '/community-4.jpg',
        alt: 'Greely Farms',
        width: 800,
        height: 600,
      },
    } as ImageField,
  },
};

export const mockLinkField: LinkField = {
  value: {
    href: '/all-communities',
    text: 'View All Communities',
    title: 'View All Communities',
    linktype: 'internal',
  },
};

export const mockFields = {
  titleOptional: {
    value: 'Featured Communities',
    editable: 'Featured Communities',
  } as Field<string>,
  descriptionOptional: {
    value: 'Discover our newest neighborhoods',
    editable: 'Discover our newest neighborhoods',
  } as Field<string>,
  linkOptional: mockLinkField,
  featuredContent: [
    mockCommunity1,
    mockCommunity2,
    mockCommunity3,
    mockCommunity4,
  ] as CommunityItemReferenceField[],
};

export const mockFieldsWithoutTitle = {
  linkOptional: mockLinkField,
  featuredContent: [mockCommunity1, mockCommunity2] as CommunityItemReferenceField[],
};

export const mockFieldsWithoutDescription = {
  titleOptional: mockFields.titleOptional,
  linkOptional: mockLinkField,
  featuredContent: [mockCommunity1, mockCommunity2] as CommunityItemReferenceField[],
};

export const mockFieldsWithoutLink = {
  titleOptional: mockFields.titleOptional,
  descriptionOptional: mockFields.descriptionOptional,
  featuredContent: [mockCommunity1, mockCommunity2] as CommunityItemReferenceField[],
};

export const mockFieldsTwoCommunities = {
  titleOptional: mockFields.titleOptional,
  descriptionOptional: mockFields.descriptionOptional,
  linkOptional: mockLinkField,
  featuredContent: [mockCommunity1, mockCommunity2] as CommunityItemReferenceField[],
};

export const mockFieldsOneCommunity = {
  titleOptional: mockFields.titleOptional,
  featuredContent: [mockCommunity1] as CommunityItemReferenceField[],
};

export const mockFieldsNoCommunities = {
  titleOptional: mockFields.titleOptional,
  descriptionOptional: mockFields.descriptionOptional,
  linkOptional: mockLinkField,
  featuredContent: [] as CommunityItemReferenceField[],
};

export const mockParams = {
  styles: 'custom-communities-style',
};

export const mockRendering: ComponentRendering = {
  componentName: 'FeaturedCommunities',
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

export const propsTwoCommunities = {
  params: mockParams,
  fields: mockFieldsTwoCommunities,
  isPageEditing: false,
  rendering: mockRendering,
  page: mockPageBase,
};

export const propsOneCommunity = {
  params: mockParams,
  fields: mockFieldsOneCommunity,
  isPageEditing: false,
  rendering: mockRendering,
  page: mockPageBase,
};

export const propsNoCommunities = {
  params: mockParams,
  fields: mockFieldsNoCommunities,
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
