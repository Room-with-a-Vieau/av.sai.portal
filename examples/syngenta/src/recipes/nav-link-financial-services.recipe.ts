import type { ContentItemRecipe } from "@sitecoreai-labs/sitecoreai-cli/recipe/unstable";

/** Mega-menu column link for the shared primary nav (`nav-group-solutions@1`). */
export const navLinkFinancialServicesRecipe = {
  kind: "content-item",
  schemaVersion: "1",
  handle: "nav-link-financial-services@1",
  name: "nav-link-financial-services",
  displayName: "Financial Services",
  description: "Primary-nav dropdown link: Financial Services.",
  templateType: "link-list-item@1",
  fields: {
    Title: { shape: "text", value: "Financial Services" },
    Link: {
      shape: "link-external",
      href: "/solutions/financial-services",
      text: "Financial Services",
    },
  },
} satisfies ContentItemRecipe;

export default navLinkFinancialServicesRecipe;
