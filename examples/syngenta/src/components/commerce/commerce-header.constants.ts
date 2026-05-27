/** Bass Pro header assets and commerce URLs (sourced from basspro.com storefront). */

export const BASS_PRO_BASE = 'https://www.basspro.com';

export const BASS_PRO_LOGO_DESKTOP =
  'https://assetshare.basspro.com/content/dam/bps-general-assets/web/site-elements/images/Redesign/Header/bass-pro-logo-2x.png';

export const BASS_PRO_LOGO_MOBILE =
  'https://assets.basspro.com/image/upload/q_auto/v1667848441/DigitalCreative/Site-Elements/bps-logo-mobile.png';

export const BASS_PRO_CUSTOMER_SERVICE_ICON =
  'https://assets.basspro.com/raw/upload/BPS%20General%20Assets/Web/site-elements/images/Redesign/Header/customer-service-icon.svg';

export const BASS_PRO_HOME_URL = 'https://www.basspro.com/shop/en';

export const BASS_PRO_SEARCH_ACTION = `${BASS_PRO_BASE}/shop/SearchDisplay`;

export const BASS_PRO_CART_URL = `${BASS_PRO_BASE}/shop/AjaxOrderItemDisplayView?catalogId=3074457345616676768&langId=-1&storeId=715838534`;

export const BASS_PRO_SIGN_IN_URL = `${BASS_PRO_BASE}/shop/auth?storeId=715838534&catalogId=3074457345616676768&langId=-1`;

export const BASS_PRO_CREATE_ACCOUNT_URL = BASS_PRO_SIGN_IN_URL;

export const BASS_PRO_CUSTOMER_SERVICE_URL = `${BASS_PRO_BASE}/shop/en/bass-pro-shops-customer-service`;

export const BASS_PRO_FREE_SHIPPING_URL = `${BASS_PRO_BASE}/shop/en/free-shipping`;

export const BASS_PRO_STORES_URL = 'https://stores.basspro.com/';

export const BASS_PRO_PROMO = {
  label: 'MARINE SALE',
  cta: 'SHOP NOW',
  href: `${BASS_PRO_BASE}/c/marine-sale-and-event`,
};

export type BassProUtilityLink = {
  label: string;
  href: string;
  external?: boolean;
};

export const BASS_PRO_UTILITY_LINKS: BassProUtilityLink[] = [
  { label: 'Boat Sales', href: `${BASS_PRO_BASE}/shop/en/boat-center` },
  { label: 'Off Road Sales', href: `${BASS_PRO_BASE}/shop/en/off-road-center` },
  { label: 'Resorts & Restaurants', href: `${BASS_PRO_BASE}/shop/en/resorts-restaurants` },
  { label: 'Outdoor Tips', href: 'https://1source.basspro.com/', external: true },
  { label: 'CLUB', href: `${BASS_PRO_BASE}/shop/en/club` },
  { label: 'Gift Cards', href: `${BASS_PRO_BASE}/shop/en/gift-cards` },
  { label: 'Help', href: BASS_PRO_CUSTOMER_SERVICE_URL },
];

export const BASS_PRO_ACCOUNT_LINKS = [
  { label: 'My Account', href: `${BASS_PRO_BASE}/shop/AjaxLogonForm?myAcctMain=1&catalogId=3074457345616676768&langId=-1&storeId=715838534` },
  { label: 'Order History', href: `${BASS_PRO_BASE}/shop/TrackOrderStatus?catalogId=3074457345616676768&showOrderHeader=true&orderStatusStyle=strong&storeId=715838534&langId=-1` },
  { label: 'Wish List', href: `${BASS_PRO_BASE}/shop/WishListDisplayView?listId=.&catalogId=3074457345616676768&wishListStyle=strong&storeId=715838534&langId=-1` },
  { label: 'Outdoor Rewards', href: `${BASS_PRO_BASE}/shop/OutdoorRewards?catalogId=3074457345616676768&langId=-1&storeId=715838534` },
] as const;
