# Pulse multi-site packs

Pulse is a shared assistant (UI + `/api/pulse/ask` + retrieve + answer templates) with **per-site packs** keyed by Sitecore site names / Skin keys.

## How it works

1. `Layout` passes `page.siteName` into `PulseAssistant`.
2. The widget sends `siteName` on `POST /api/pulse/ask`.
3. The API loads the pack via `getPulsePack(siteName)` and retrieves under that site’s Home root on **Experience Edge**.
4. Optional demo intents boost answers by listing Sitecore item IDs; title/url/excerpt hydrate from Edge at ask-time.

Until a pack is registered, `getPulsePack` returns the empty `DEFAULT_PULSE_PACK`.

## Add Pulse to a new demo site

1. **Create a pack file** under `src/lib/pulse-packs/` (copy `default.ts` as a starting point):
   - `siteName`, `brandName`
   - `homePath` + `homeRootId` from the IA / manifest
   - `typeLabels` for the vertical
   - `starterPrompts` (3–5) aligned to real IA
   - `intents[]` with `matchAny` token groups + `citationItemIds` from the Home tree
2. **Register** the pack in `src/lib/pulse-packs/index.ts` (`PULSE_SITE_PACKS`).
3. **Publish** the site Home tree to Experience Edge.
4. Confirm the site is listed in `src/lib/theme/site-skins.ts` if it has a brand skin.
5. Do **not** edit core `pulse-retrieve.ts` / `pulse-answer.ts` for site-specific copy — keep that in the pack.
