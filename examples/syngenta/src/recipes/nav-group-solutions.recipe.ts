import type { ContentItemRecipe } from "@sitecoreai-labs/sitecoreai-cli/recipe/unstable";

/**
 * One mega-menu column for the shared primary nav — conforms to
 * `link-list-content@1` (Title heading + Items links) and is referenced
 * from `nav-item-solutions@1`'s `Groups` Treelist. Field-driven Groups are what
 * make the stock nav dropdowns actually OPEN WITH CONTENT: the old
 * `HasPanel: true` seed pointed each item at a `nav-item-panel-{index}`
 * placeholder that no stock experience composes anything into, so every
 * chevron toggled an empty panel ("the dropdowns don't work").
 */
export const navGroupSolutionsRecipe = {
  kind: "content-item",
  schemaVersion: "1",
  handle: "nav-group-solutions@1",
  name: "nav-group-solutions",
  displayName: "Nav Group — Solutions",
  description: "Solutions mega-menu column of the shared primary nav.",
  templateType: "link-list-content@1",
  fields: {
    Title: { shape: "text", value: "By industry" },
    Items: {
      shape: "reference",
      refs: [
        "nav-link-retail@1",
        "nav-link-financial-services@1",
        "nav-link-healthcare@1",
      ],
    },
  },
} satisfies ContentItemRecipe;

export default navGroupSolutionsRecipe;
