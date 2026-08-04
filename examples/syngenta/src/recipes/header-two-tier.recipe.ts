import type { PartialDesignRecipe } from "@sitecoreai-labs/sitecoreai-cli/recipe/unstable";

/**
 * Stock header experience: the enterprise two-tier header — a thin
 * utility strip (language switcher + quiet utility links) above the
 * main bar (logo / nav / primary CTA), composed INSIDE the header
 * shell's placeholders. Mirrors the field-driven `TwoTier` shell
 * variant as COMPOSITION on the Default shell (the Default shell's
 * desktop-only utility row IS the thin top strip).
 *
 * Composition:
 *
 *   headless-header
 *     └─ header@1 (Default pure-placeholder shell)
 *          header-utility-end → language-switcher@1 Default +
 *                               link-list@1 UtilityBar (utility links)
 *          header-start       → image@1 Logo (site logo)
 *          header-nav         → main-nav@1 Default (primary nav strip)
 *          header-end         → cta-button@1 Default (primary CTA)
 *          header-mobile      → mobile-menu@1 Drawer
 *                                 mobile-menu → main-nav@1 Default
 *
 * **Content reuse.** Logo + nav are the shared items every stock
 * header experience uses (`site-logo-content@1`,
 * `primary-nav-content@1`, from `header-shared-content/`). The
 * utility links get their own shared item (`header-utility-content@1`,
 * shipped in this folder — the footer-social-content precedent) so
 * tenants edit the strip once for every placement. The CTA is inline
 * (`kind:"scoped"`) so the partial is self-contained.
 */
export const headerTwoTierRecipe = {
  kind: "partial-design",
  schemaVersion: "1",
  handle: "header-two-tier@1",
  name: "HeaderTwoTier",
  displayName: "Header — Two Tier",
  description:
    "Stock header: thin utility strip (language switcher + utility links) over the main logo/nav/CTA bar, composed in the header shell's slots. Page designs include this via the `partials` field.",
  layout: {
    placeholders: {
      "headless-header": [
        {
          componentHandle: "header@1",
          variant: "Default",
          datasourceRef: { kind: "none" },
          placeholders: {
            "header-utility-end": [
              {
                componentHandle: "language-switcher@1",
                variant: "Default",
                datasourceRef: { kind: "none" },
              },
              {
                componentHandle: "link-list@1",
                variant: "UtilityBar",
                datasourceRef: {
                  kind: "shared",
                  handle: "header-utility-content@1",
                },
              },
            ],
            "header-start": [
              {
                componentHandle: "image@1",
                variant: "Logo",
                datasourceRef: {
                  kind: "shared",
                  handle: "site-logo-content@1",
                },
              },
            ],
            "header-nav": [
              {
                componentHandle: "main-nav@1",
                variant: "Default",
                datasourceRef: {
                  kind: "shared",
                  handle: "primary-nav-content@1",
                },
              },
            ],
            "header-end": [
              {
                componentHandle: "cta-button@1",
                variant: "Default",
                params: { Variant: "default", Size: "sm" },
                datasourceRef: {
                  kind: "scoped",
                  slot: "HeaderCta",
                  fields: {
                    Link: {
                      shape: "link-external",
                      href: "/contact",
                      text: "Get started",
                    },
                  },
                },
              },
            ],
            "header-mobile": [
              {
                componentHandle: "mobile-menu@1",
                variant: "Drawer",
                datasourceRef: { kind: "none" },
                placeholders: {
                  "mobile-menu": [
                    {
                      componentHandle: "main-nav@1",
                      variant: "Default",
                      datasourceRef: {
                        kind: "shared",
                        handle: "primary-nav-content@1",
                      },
                    },
                  ],
                },
              },
            ],
          },
        },
      ],
    },
  },
} satisfies PartialDesignRecipe;

export default headerTwoTierRecipe;
