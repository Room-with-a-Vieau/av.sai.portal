# Guidestone Financial — Build Plan

> Source: https://www.guidestone.org  
> Analyzed: 2026-08-21  
> Sections: 12 template matches, 0 custom components

English source copy is preserved. The desktop full-page capture retained some
scroll-animation transparency, so the hero, mobile capture, and live page text
were used to fill the gaps.

## Page sections

| # | Page section | Registry component | Variant | Fit | Delivery |
|---|---|---|---|---|---|
| 1 | Kingdom Impact Report announcement | Announcement Bar | Default | Exact | API |
| 2 | White logo/navigation header | Navigation Header | Default | Exact | API |
| 3 | Rounded sunrise image hero | Hero Banner | BackgroundImage | Partial | API |
| 4 | News & Highlights cards | Feature Cards Grid | Default | Partial | API |
| 5 | Pale-blue mission statement | Rich Text Block | Centered | Partial | API |
| 6 | Three-image transition strip | Image Gallery | Gallery | Exact | API |
| 7 | “How can we help you today?” intro | Rich Text Block | Centered | Exact | API |
| 8 | Individual/Organization selector | Tab Navigation Section | Default | Partial | API |
| 9 | Retirement/Insurance/Investments rows | Feature Cards Grid | Default | No match | API |
| 10 | Photo testimonial carousel | Testimonial Block | Carousel | Partial | API |
| 11 | Three-column help strip | Feature Cards Grid | Default | Partial | API |
| 12 | Dark-green five-column footer | Site Footer | MegaFooter | Partial | API |

## Attention required

The only substantial generic-variant mismatch is sections 8–9. The live page
uses an audience toggle connected to stacked, full-width service cards. The
registry provides tabs and a feature-card grid, but no existing horizontal
long-card presentation.

Recommended GuideStone variants:

- `GuideStoneRoundedOverlay`
- `GuideStoneNewsHighlights`
- `GuideStoneMissionBand`
- `GuideStoneAudienceToggle`
- `GuideStoneServiceLongCards`
- `GuideStoneTestimonialCarousel`
- `GuideStoneHelpStrip`
- `GuideStoneMegaFooter`

## Delivery classification

All 12 sections have datasources and can be added and wired through the API.
The current catalog defines Navigation Header as a parent/child list datasource
and Site Footer as a simple datasource. This supersedes older demo-builder
notes that described them as context-only.

No custom components are required. All 12 sections map to the registry.

## Registry coverage

The homepage uses 9 of 19 registry component types:

- Announcement Bar
- Navigation Header
- Hero Banner
- Feature Cards Grid
- Rich Text Block
- Image Gallery
- Tab Navigation Section
- Testimonial Block
- Site Footer

The full library bootstrap will also create these 10 components even though
they are not placed on the GuideStone homepage:

- Hero Banner Carousel
- Product / Pricing Cards
- Feature Highlight
- Legal / Compliance
- Value Proposition Grid
- Trust Stats
- CTA Banner
- Logo Cloud
- Newsletter Signup
- FAQ Accordion

## Proposed sequence after approval

1. Bootstrap all 19 registry components for the `finance` project.
2. Add the eight GuideStone-specific variants if pixel-perfect work is approved.
3. Extract precise page content and images.
4. Create GuideStone datasource items.
5. Apply the approved theme and Poppins.
6. Assemble the existing Home page and wire datasources.
7. Wire the authored header and footer datasources in their partial designs or
   on the page, depending on the active Page Design.
