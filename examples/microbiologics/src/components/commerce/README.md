# CommerceHeader (Bass Pro POC)

**Starter:** `examples/basspro` — native React header matching [Bass Pro Shops](https://www.basspro.com/home) for Sitecore XM Cloud partial designs.

> The same module also exists under `examples/dycom` for reference; maintain this folder as the canonical Bass Pro rendering host.

## SitecoreAI setup

Do not add `index.ts` in this folder — the component map treats it as a duplicate `index` module. Export variants from `CommerceHeader.tsx` only.

1. Run `npm run dev` or `npm run sitecore-tools:generate-map` so `CommerceHeader` registers in `.sitecore/component-map.ts`.
2. In Sitecore, add a rendering named **CommerceHeader** pointing at this component (Content SDK pattern).
3. Add **CommerceHeader** to your **Partial Design** in the `headless-header` placeholder (or replace existing header rendering).
4. No datasource required for this POC.

## Behavior

- All category links navigate to `https://www.basspro.com` (live commerce).
- Search submits to Bass Pro `SearchDisplay`.
- Sign in / cart / account links use production commerce URLs.
- Mega menus: hover (desktop) and accordion (mobile).

## Files

| File | Role |
|------|------|
| `CommerceHeader.tsx` | Sitecore `Default` export |
| `bass-pro-navigation.ts` | Nav structure and URLs |
| `commerce-header.constants.ts` | Logos, cart, auth URLs |
| `CommerceHeaderMegaMenu.tsx` | Desktop mega panels |
| `commerce-header.css` | Scoped Bass Pro styling |
