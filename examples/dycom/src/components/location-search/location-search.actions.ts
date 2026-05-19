'use server';

import { fetchAllLocationItems } from './location-search.fetch';
import type { LocationItemFields } from './location-search.types';

export async function loadAllLocationItems(
  datasourcePath: string,
  language: string
): Promise<LocationItemFields[]> {
  return fetchAllLocationItems(datasourcePath, language);
}
