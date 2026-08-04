import type { ContentItemRecipe } from "@sitecoreai-labs/sitecoreai-cli/recipe/unstable";

/**
 * The canonical primary navigation datasource — the shared item every
 * stock header experience binds its `main-nav@1` placement to.
 * Conforms to `main-nav@1`'s auto-template (component-template handles
 * double as datasource templates when no explicit
 * `datasource.template`/`templates` is declared on the component).
 *
 * Items is a Treelist of `nav-item@1` content items — the seed set
 * ships 3 dropdown items (Products / Solutions / Resources, each with
 * a field-driven `Groups` mega-menu column that gives the dropdown
 * REAL content) plus one flat link (About). Authors reorder / add /
 * remove items per tenant. The dropdowns deliberately use Groups
 * rather than `HasPanel`: the panel placeholder mode needs composed
 * `nav-item-panel-{index}` content no stock experience ships, so a
 * HasPanel seed renders chevrons that open empty panels.
 */
export const primaryNavContentRecipe = {
  kind: "content-item",
  schemaVersion: "1",
  handle: "primary-nav-content@1",
  name: "primary-nav",
  displayName: "Primary Nav",
  description:
    "Canonical primary navigation — Treelist of nav items, shared by the stock header experiences.",
  templateType: "main-nav@1",
  fields: {
    Items: {
      shape: "reference",
      refs: [
        "nav-item-products@1",
        "nav-item-solutions@1",
        "nav-item-resources@1",
        "nav-item-about@1",
      ],
    },
  },
} satisfies ContentItemRecipe;

export default primaryNavContentRecipe;
