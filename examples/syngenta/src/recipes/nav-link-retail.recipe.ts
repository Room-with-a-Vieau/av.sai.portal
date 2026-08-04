import type { ContentItemRecipe } from "@sitecoreai-labs/sitecoreai-cli/recipe/unstable";

/** Mega-menu column link for the shared primary nav (`nav-group-solutions@1`). */
export const navLinkRetailRecipe = {
  kind: "content-item",
  schemaVersion: "1",
  handle: "nav-link-retail@1",
  name: "nav-link-retail",
  displayName: "Retail",
  description: "Primary-nav dropdown link: Retail.",
  templateType: "link-list-item@1",
  fields: {
    Title: { shape: "text", value: "Retail" },
    Link: { shape: "link-external", href: "/solutions/retail", text: "Retail" },
  },
} satisfies ContentItemRecipe;

export default navLinkRetailRecipe;
