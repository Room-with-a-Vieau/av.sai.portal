import type { ContentItemRecipe } from "@sitecoreai-labs/sitecoreai-cli/recipe/unstable";

/** Mega-menu column link for the shared primary nav (`nav-group-solutions@1`). */
export const navLinkHealthcareRecipe = {
  kind: "content-item",
  schemaVersion: "1",
  handle: "nav-link-healthcare@1",
  name: "nav-link-healthcare",
  displayName: "Healthcare",
  description: "Primary-nav dropdown link: Healthcare.",
  templateType: "link-list-item@1",
  fields: {
    Title: { shape: "text", value: "Healthcare" },
    Link: {
      shape: "link-external",
      href: "/solutions/healthcare",
      text: "Healthcare",
    },
  },
} satisfies ContentItemRecipe;

export default navLinkHealthcareRecipe;
