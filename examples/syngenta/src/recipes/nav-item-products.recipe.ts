import type { ContentItemRecipe } from "@sitecoreai-labs/sitecoreai-cli/recipe/unstable";

/**
 * Seed content for the first item in the canonical primary navigation
 * (`primary-nav-content@1`). Referenced from the stock header
 * experience partials via that Treelist.
 *
 * Authors edit the Title / Link / HasPanel per tenant; the canonical
 * recipe just ships a reasonable default.
 */
export const navItemProductsRecipe = {
  kind: "content-item",
  schemaVersion: "1",
  handle: "nav-item-products@1",
  name: "nav-item-products",
  displayName: "Products",
  description: "Top-level nav item: Products.",
  templateType: "nav-item@1",
  fields: {
    Title: { shape: "text", value: "Products" },
    Link: { shape: "link-external", href: "/products", text: "Products" },
    // Field-driven Groups (below) carry the dropdown content. HasPanel
    // stays OFF: it points the item at a `nav-item-panel-{index}`
    // placeholder no stock experience composes anything into, and it
    // WINS over Groups when both are set — the old `true` seed is why
    // every stock nav chevron opened an empty panel.
    HasPanel: { shape: "boolean", value: false },
    Groups: { shape: "reference", refs: ["nav-group-products@1"] },
  },
} satisfies ContentItemRecipe;

export default navItemProductsRecipe;
