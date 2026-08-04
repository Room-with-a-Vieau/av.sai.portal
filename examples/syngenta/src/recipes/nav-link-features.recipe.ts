import type { ContentItemRecipe } from "@sitecoreai-labs/sitecoreai-cli/recipe/unstable";

/** Mega-menu column link for the shared primary nav (`nav-group-products@1`). */
export const navLinkFeaturesRecipe = {
  kind: "content-item",
  schemaVersion: "1",
  handle: "nav-link-features@1",
  name: "nav-link-features",
  displayName: "Features",
  description: "Primary-nav dropdown link: Features.",
  templateType: "link-list-item@1",
  fields: {
    Title: { shape: "text", value: "Features" },
    Link: { shape: "link-external", href: "/features", text: "Features" },
  },
} satisfies ContentItemRecipe;

export default navLinkFeaturesRecipe;
