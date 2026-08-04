import type { ContentItemRecipe } from "@sitecoreai-labs/sitecoreai-cli/recipe/unstable";

/** Mega-menu column link for the shared primary nav (`nav-group-products@1`). */
export const navLinkIntegrationsRecipe = {
  kind: "content-item",
  schemaVersion: "1",
  handle: "nav-link-integrations@1",
  name: "nav-link-integrations",
  displayName: "Integrations",
  description: "Primary-nav dropdown link: Integrations.",
  templateType: "link-list-item@1",
  fields: {
    Title: { shape: "text", value: "Integrations" },
    Link: {
      shape: "link-external",
      href: "/integrations",
      text: "Integrations",
    },
  },
} satisfies ContentItemRecipe;

export default navLinkIntegrationsRecipe;
