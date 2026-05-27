/**
 * Component factory / map used to resolve Sitecore rendering names to React modules.
 *
 * TODO: Spec references src/temp/componentFactory.ts; this starter generates the map at
 * `.sitecore/component-map` via `npm run sitecore-tools:generate-map`. Re-export here so
 * API routes can import from `temp/componentFactory` without duplicating the generated file.
 */
import componentMap from '.sitecore/component-map';

export { componentMap };
export default componentMap;
