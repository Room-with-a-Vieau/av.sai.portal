/**
 * Locates a component rendering in a layout placeholder tree.
 *
 * TODO: Spec references ComponentRendering from @sitecore-content-sdk/core; in SDK 2.x this type
 * is published from @sitecore-content-sdk/content/layout (re-exported by nextjs).
 */
import type { ComponentRendering, LayoutServiceData } from '@sitecore-content-sdk/content/layout';

function isComponentRendering(value: unknown): value is ComponentRendering {
  if (!value || typeof value !== 'object') {
    return false;
  }
  return typeof (value as ComponentRendering).componentName === 'string';
}

function findInRenderingTree(
  node: unknown,
  componentName: string,
): ComponentRendering | null {
  if (!isComponentRendering(node)) {
    return null;
  }

  if (node.componentName === componentName) {
    return node;
  }

  const placeholders = node.placeholders;
  if (!placeholders || typeof placeholders !== 'object') {
    return null;
  }

  for (const value of Object.values(placeholders)) {
    const match = findInPlaceholderValue(value, componentName);
    if (match) {
      return match;
    }
  }

  return null;
}

function findInPlaceholderValue(
  value: unknown,
  componentName: string,
): ComponentRendering | null {
  if (Array.isArray(value)) {
    for (const item of value) {
      const match = findInRenderingTree(item, componentName);
      if (match) {
        return match;
      }
    }
    return null;
  }

  return findInRenderingTree(value, componentName);
}

/**
 * Recursively walks `sitecore.route.placeholders` and returns the first rendering whose
 * `componentName` matches (depth-first).
 */
export function findComponentRendering(
  layoutData: LayoutServiceData,
  componentName: string,
): ComponentRendering | null {
  const placeholders = layoutData?.sitecore?.route?.placeholders;
  if (!placeholders || typeof placeholders !== 'object') {
    return null;
  }

  for (const value of Object.values(placeholders)) {
    const match = findInPlaceholderValue(value, componentName);
    if (match) {
      return match;
    }
  }

  return null;
}
