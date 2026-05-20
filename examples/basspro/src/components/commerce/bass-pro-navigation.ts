/**
 * Bass Pro primary navigation (structure from basspro.com/home).
 * Links point to the live commerce site so nav behaves like the production header.
 */

export type BassProNavLink = {
  label: string;
  href: string;
};

export type BassProNavColumn = {
  title: string;
  href?: string;
  links: BassProNavLink[];
};

export type BassProNavCategory = {
  id: string;
  label: string;
  shopAllHref: string;
  promo?: { headline: string; ctaLabel: string; ctaHref: string };
  quickLinks?: BassProNavLink[];
  columns: BassProNavColumn[];
};

const L = (path: string) => `https://www.basspro.com${path.startsWith('/') ? path : `/${path}`}`;

export const BASS_PRO_MAIN_NAV: BassProNavCategory[] = [
  {
    id: 'fishing',
    label: 'Fishing',
    shopAllHref: L('/c/fishing'),
    promo: {
      headline: 'New Fishing',
      ctaLabel: 'Shop Now',
      ctaHref: L('/l/fishing-gear-new-arrivals'),
    },
    quickLinks: [
      { label: 'Shop The Rig', href: L('/shop/en/shop-the-rig') },
      { label: 'Bargain Cave', href: L('/l/bargain-cave-fishing-sale-and-clearance') },
      { label: 'Outdoor Tips', href: 'https://1source.basspro.com/' },
      { label: 'Customer Favorites', href: L('/shop/en/top-selling-fishing-gear') },
    ],
    columns: [
      {
        title: 'Rod & Reel Combos',
        href: L('/l/rod-reel-combos'),
        links: [
          { label: 'Baitcast Combos', href: L('/l/baitcast-combos') },
          { label: 'Spinning Combos', href: L('/l/spinning-combos') },
          { label: 'Saltwater Combos', href: L('/l/saltwater-rod-reel-combos') },
          { label: "Kids' Fishing Rod & Reel Combos", href: L('/l/kids-fishing-rod-and-reel-combos') },
          { label: 'View All', href: L('/l/rod-reel-combos') },
        ],
      },
      {
        title: 'Fishing Rods',
        href: L('/l/fishing-rods'),
        links: [
          { label: 'Casting Rods', href: L('/l/casting-rods') },
          { label: 'Spinning Rods', href: L('/l/spinning-rods') },
          { label: 'Saltwater Rods', href: L('/l/saltwater-rods') },
          { label: 'Fly Rods', href: L('/l/fly-fishing-rods') },
          { label: 'View All', href: L('/l/fishing-rods') },
        ],
      },
      {
        title: 'Fishing Reels',
        href: L('/c/fishing-reels'),
        links: [
          { label: 'Baitcast Reels', href: L('/l/baitcast-reels') },
          { label: 'Spinning Reels', href: L('/l/spinning-reels') },
          { label: 'Saltwater Reels', href: L('/l/saltwater-reels') },
          { label: 'Fly Reels', href: L('/l/fly-fishing-reels') },
          { label: 'View All', href: L('/c/fishing-reels') },
        ],
      },
      {
        title: 'Lures',
        href: L('/l/lures'),
        links: [
          { label: 'Hard Bait Lures', href: L('/l/hardbaits') },
          { label: 'Soft Bait Lures', href: L('/l/softbaits') },
          { label: 'Spinnerbaits & Buzzbaits', href: L('/l/spinnerbaits-buzzbaits') },
          { label: 'Jigs', href: L('/shop/en/jigs') },
          { label: 'View All', href: L('/l/lures') },
        ],
      },
    ],
  },
  {
    id: 'boating',
    label: 'Boating',
    shopAllHref: L('/c/boating'),
    promo: {
      headline: 'New Boating',
      ctaLabel: 'Shop Now',
      ctaHref: L('/l/boating-new'),
    },
    quickLinks: [
      { label: 'Shop the Live Sonar', href: L('/shop/en/shop-the-live-sonar') },
      { label: 'Boating Center', href: L('/shop/en/boat-center') },
      { label: 'Bargain Cave', href: L('/l/bargain-cave-boating-sale-and-clearance') },
      { label: 'Outdoor Tips', href: 'https://1source.basspro.com/' },
    ],
    columns: [
      {
        title: 'Marine Electronics',
        href: L('/c/marine-electronics'),
        links: [
          { label: 'Fish Finders & Navigation', href: L('/l/fish-finders-navigation') },
          { label: 'Marine Radios & Audio', href: L('/l/marine-radios-audio') },
          { label: 'GPS & PLBs', href: L('/l/marine-gps-personal-locator-beacons') },
          { label: 'View All', href: L('/c/marine-electronics') },
        ],
      },
      {
        title: 'Trolling Motors',
        href: L('/l/trolling-motors'),
        links: [
          { label: 'Freshwater Trolling Motors', href: L('/l/freshwater-trolling-motors') },
          { label: 'Saltwater Trolling Motors', href: L('/l/saltwater-trolling-motors') },
          { label: 'Trolling Motor Accessories', href: L('/l/trolling-motor-accessories') },
          { label: 'View All', href: L('/l/trolling-motors') },
        ],
      },
      {
        title: 'Boat Accessories',
        href: L('/l/boat-accessories'),
        links: [
          { label: 'Anchors, Ropes, & Docking', href: L('/l/anchoring-rope-docking') },
          { label: 'Batteries & Chargers', href: L('/l/chargers-portable-power') },
          { label: 'Kayaks & Canoes', href: L('/l/kayaks-canoes') },
          { label: 'View All', href: L('/l/boat-accessories') },
        ],
      },
      {
        title: 'Boat Center',
        href: L('/shop/en/boat-center'),
        links: [
          { label: 'Fishing Boats', href: L('/l/fishing-boats') },
          { label: 'Pontoon Boats', href: L('/l/pontoon-boats') },
          { label: 'Outboard Motors', href: L('/shop/en/outboard-motors') },
          { label: 'View All', href: L('/shop/en/boat-center') },
        ],
      },
    ],
  },
  {
    id: 'shooting',
    label: 'Shooting',
    shopAllHref: L('/c/shooting'),
    promo: {
      headline: 'Used Guns. Buy. Sell. Trade.',
      ctaLabel: 'Shop Now',
      ctaHref: L('/l/used-guns'),
    },
    quickLinks: [
      { label: 'Bargain Cave', href: L('/l/bargain-cave-shooting-sale-and-clearance') },
      { label: 'Outdoor Tips', href: 'https://1source.basspro.com/' },
    ],
    columns: [
      {
        title: 'Guns',
        href: L('/c/guns'),
        links: [
          { label: 'Centerfire Pistol', href: L('/l/centerfire-pistol') },
          { label: 'Centerfire Rifles', href: L('/l/centerfire-rifles') },
          { label: 'Shotguns', href: L('/l/shotgun') },
          { label: 'View All', href: L('/c/guns') },
        ],
      },
      {
        title: 'Ammunition',
        href: L('/l/ammunition'),
        links: [
          { label: 'Handgun Ammo', href: L('/l/handgun-ammo') },
          { label: 'Rimfire Ammo', href: L('/l/rimfire-ammo') },
          { label: 'Shotshell Ammo', href: L('/l/shotshell-ammo') },
        ],
      },
      {
        title: 'Optics and Scopes',
        href: L('/c/optics-scopes'),
        links: [
          { label: 'Binoculars', href: L('/l/binoculars') },
          { label: 'Scopes', href: L('/l/scopes') },
          { label: 'Rangefinders', href: L('/l/rangefinders') },
          { label: 'View All', href: L('/c/optics-scopes') },
        ],
      },
      {
        title: 'Gun Storage',
        href: L('/l/gun-storage'),
        links: [
          { label: 'Gun Safes & Vaults', href: L('/l/guns-safes-vaults') },
          { label: 'Hard Gun Cases', href: L('/l/hard-gun-cases') },
          { label: 'Soft Gun Cases', href: L('/l/soft-gun-cases') },
        ],
      },
    ],
  },
  {
    id: 'hunting',
    label: 'Hunting',
    shopAllHref: L('/c/hunting'),
    promo: {
      headline: 'Turkey Essentials',
      ctaLabel: 'Shop Now',
      ctaHref: L('/l/spring-turkey-hunting-event-and-sale'),
    },
    quickLinks: [
      { label: 'Bargain Cave', href: L('/l/bargain-cave-hunting-sale-and-clearance') },
      { label: 'Elk Hunting', href: L('/shop/en/elk-hunting') },
      { label: 'Deer Hunting', href: L('/shop/en/deer-hunting') },
      { label: 'Waterfowl Hunting', href: L('/shop/en/waterfowl-migration-hunting-tips-gear') },
    ],
    columns: [
      {
        title: 'Archery',
        href: L('/c/archery'),
        links: [
          { label: 'Bows', href: L('/l/bows') },
          { label: 'Crossbows', href: L('/shop/en/crossbow-headquarters') },
          { label: 'Archery Targets', href: L('/l/archery-targets') },
          { label: 'View All', href: L('/c/archery') },
        ],
      },
      {
        title: 'Game Calls',
        href: L('/l/game-calls'),
        links: [
          { label: 'Turkey Calls', href: L('/l/turkey-calls') },
          { label: 'Waterfowl Calls', href: L('/l/waterfowl-calls') },
          { label: 'Predator Calls', href: L('/l/predator-calls') },
          { label: 'View All', href: L('/l/game-calls') },
        ],
      },
      {
        title: 'Decoys',
        href: L('/l/decoys'),
        links: [
          { label: 'Turkey Decoys', href: L('/l/turkey-decoys') },
          { label: 'Waterfowl Decoys', href: L('/l/waterfowl-decoys') },
          { label: 'Big Game Decoys', href: L('/l/big-game-decoys') },
        ],
      },
      {
        title: 'Hunting Clothing',
        href: L('/l/hunting-clothing'),
        links: [
          { label: 'Jackets & Vests', href: L('/l/hunting-jackets-vests') },
          { label: 'Bibs & Coveralls', href: L('/l/hunting-bibs-coveralls') },
          { label: 'Base Layers', href: L('/l/hunting-base-layers') },
        ],
      },
    ],
  },
  {
    id: 'camping',
    label: 'Camping',
    shopAllHref: L('/c/camping'),
    promo: {
      headline: 'New Camping',
      ctaLabel: 'Shop Now',
      ctaHref: L('/l/camping-new-arrivals'),
    },
    quickLinks: [
      { label: 'Bargain Cave', href: L('/l/bargain-cave-camping-sale-and-clearance') },
      { label: 'Outdoor Tips', href: 'https://1source.basspro.com/' },
    ],
    columns: [
      {
        title: 'Tents & Shelters',
        href: L('/l/tents-shelters'),
        links: [
          { label: 'Tents', href: L('/l/tents') },
          { label: 'Shelters & Canopies', href: L('/l/shelters-canopies') },
          { label: 'View All', href: L('/l/tents-shelters') },
        ],
      },
      {
        title: 'Sleeping Gear',
        href: L('/l/sleeping-gear'),
        links: [
          { label: 'Sleeping Bags', href: L('/l/sleeping-bags') },
          { label: 'Air Beds & Cots', href: L('/l/air-beds-cots') },
          { label: 'View All', href: L('/l/sleeping-gear') },
        ],
      },
      {
        title: 'Camp Cooking',
        href: L('/l/camp-cooking'),
        links: [
          { label: 'Camp Stoves', href: L('/l/camp-stoves') },
          { label: 'Coolers', href: L('/l/coolers') },
          { label: 'View All', href: L('/l/camp-cooking') },
        ],
      },
      {
        title: 'Camp Furniture',
        href: L('/l/camp-furniture'),
        links: [
          { label: 'Chairs', href: L('/l/camp-chairs') },
          { label: 'Tables', href: L('/l/camp-tables') },
          { label: 'View All', href: L('/l/camp-furniture') },
        ],
      },
    ],
  },
  {
    id: 'men',
    label: 'Men',
    shopAllHref: L('/c/men'),
    promo: {
      headline: "New Men's Clothing & Footwear",
      ctaLabel: 'Shop Now',
      ctaHref: L('/l/new-mens-clothing-footwear'),
    },
    quickLinks: [
      { label: 'Bargain Cave', href: L('/shop/en/bargain-cave-sale-and-clearance') },
    ],
    columns: [
      {
        title: 'Clothing',
        href: L('/l/mens-clothing'),
        links: [
          { label: 'Jackets & Coats', href: L('/l/mens-jackets-coats') },
          { label: 'Shirts', href: L('/l/mens-shirts') },
          { label: 'Pants & Shorts', href: L('/l/mens-pants-shorts') },
          { label: 'View All', href: L('/l/mens-clothing') },
        ],
      },
      {
        title: 'Footwear',
        href: L('/l/mens-footwear'),
        links: [
          { label: 'Boots', href: L('/l/mens-boots') },
          { label: 'Shoes', href: L('/l/mens-shoes') },
          { label: 'View All', href: L('/l/mens-footwear') },
        ],
      },
      {
        title: 'Accessories',
        href: L('/l/mens-accessories'),
        links: [
          { label: 'Hats & Caps', href: L('/l/mens-hats-caps') },
          { label: 'Gloves', href: L('/l/mens-gloves') },
          { label: 'View All', href: L('/l/mens-accessories') },
        ],
      },
    ],
  },
  {
    id: 'women',
    label: 'Women',
    shopAllHref: L('/c/womens-clothing'),
    promo: {
      headline: 'New Styles',
      ctaLabel: 'Shop Now',
      ctaHref: L('/l/new-womens-clothing-footwear'),
    },
    quickLinks: [{ label: 'Bargain Cave', href: L('/shop/en/bargain-cave-sale-and-clearance') }],
    columns: [
      {
        title: 'Clothing',
        href: L('/l/womens-clothing'),
        links: [
          { label: 'Jackets & Coats', href: L('/l/womens-jackets-coats') },
          { label: 'Tops', href: L('/l/womens-tops') },
          { label: 'View All', href: L('/l/womens-clothing') },
        ],
      },
      {
        title: 'Footwear',
        href: L('/l/womens-footwear'),
        links: [
          { label: 'Boots', href: L('/l/womens-boots') },
          { label: 'Shoes', href: L('/l/womens-shoes') },
          { label: 'View All', href: L('/l/womens-footwear') },
        ],
      },
    ],
  },
  {
    id: 'kids',
    label: 'Kids',
    shopAllHref: L('/c/kids-clothing'),
    promo: {
      headline: 'New Styles',
      ctaLabel: 'Shop Now',
      ctaHref: L('/l/new-kids-clothing-footwear'),
    },
    quickLinks: [{ label: 'Bargain Cave', href: L('/shop/en/bargain-cave-sale-and-clearance') }],
    columns: [
      {
        title: 'Clothing',
        href: L('/l/kids-clothing'),
        links: [
          { label: 'Boys', href: L('/l/boys-clothing') },
          { label: 'Girls', href: L('/l/girls-clothing') },
          { label: 'View All', href: L('/l/kids-clothing') },
        ],
      },
      {
        title: 'Footwear',
        href: L('/l/kids-footwear'),
        links: [
          { label: 'Boys', href: L('/l/boys-footwear') },
          { label: 'Girls', href: L('/l/girls-footwear') },
        ],
      },
    ],
  },
  {
    id: 'outdoor-rec',
    label: 'Outdoor Rec',
    shopAllHref: L('/c/outdoor-recreation'),
    promo: {
      headline: 'Outdoor Recreation New',
      ctaLabel: 'Shop Now',
      ctaHref: L('/l/outdoor-recreation-new-arrivals'),
    },
    quickLinks: [
      { label: 'Bargain Cave', href: L('/shop/en/bargain-cave-sale-and-clearance') },
      { label: 'Outdoor Tips', href: 'https://1source.basspro.com/' },
    ],
    columns: [
      {
        title: 'Kayaks & Canoes',
        href: L('/l/kayaks-canoes'),
        links: [
          { label: 'Kayaks & Fishing Kayaks', href: L('/l/kayaks-and-fishing-kayaks') },
          { label: 'Paddles & Oars', href: L('/l/paddles-oars') },
          { label: 'View All', href: L('/l/kayaks-canoes') },
        ],
      },
      {
        title: 'Bikes & Accessories',
        href: L('/l/bikes-accessories'),
        links: [
          { label: 'Mountain Bikes', href: L('/l/mountain-bikes') },
          { label: 'Electric Bikes', href: L('/l/electric-bikes') },
          { label: 'View All', href: L('/l/bikes-accessories') },
        ],
      },
      {
        title: 'Coolers',
        href: L('/l/coolers'),
        links: [
          { label: 'Hard-Sided Coolers', href: L('/l/hard-sided-coolers') },
          { label: 'Soft-Sided Coolers', href: L('/l/soft-sided-coolers') },
        ],
      },
      {
        title: 'Off Road Center',
        href: L('/shop/en/off-road-center'),
        links: [
          { label: 'ATVs', href: L('/l/atvs') },
          { label: 'Side-By-Sides', href: L('/l/side-by-sides') },
        ],
      },
    ],
  },
  {
    id: 'home-gifts',
    label: 'Home & Gifts',
    shopAllHref: L('/c/home-and-gifts'),
    promo: {
      headline: 'New Home & Gifts',
      ctaLabel: 'Shop Now',
      ctaHref: L('/l/home-gifts-new-arrivals'),
    },
    quickLinks: [{ label: 'Bargain Cave', href: L('/l/bargain-cave-home-gifts-sale-and-clearance') }],
    columns: [
      {
        title: 'Home Decor',
        href: L('/l/home-decor'),
        links: [
          { label: 'Bedding', href: L('/l/bedding') },
          { label: 'Wall Decor', href: L('/l/wall-decor') },
          { label: 'View All', href: L('/l/home-decor') },
        ],
      },
      {
        title: 'Furniture',
        href: L('/l/furniture'),
        links: [
          { label: 'Recliners', href: L('/l/recliners') },
          { label: 'Sofas & Loveseats', href: L('/l/sofas-loveseats') },
          { label: 'View All', href: L('/l/furniture') },
        ],
      },
      {
        title: 'Toys and Games',
        href: L('/l/toys-and-games'),
        links: [
          { label: 'Kids Toys', href: L('/l/kids-toys') },
          { label: 'Outdoor Activities & Games', href: L('/l/outdoor-activities') },
        ],
      },
      {
        title: 'Gift Cards',
        href: L('/shop/en/home-gift-cards'),
        links: [{ label: 'Shop Gift Cards', href: L('/shop/en/home-gift-cards') }],
      },
    ],
  },
];

/** Simple top-level links (no mega panel). */
export const BASS_PRO_SIMPLE_NAV: BassProNavLink[] = [
  { label: 'Bargain Cave', href: L('/c/bargain-cave-sale-and-clearance') },
  { label: 'Stores', href: 'https://stores.basspro.com/' },
];
