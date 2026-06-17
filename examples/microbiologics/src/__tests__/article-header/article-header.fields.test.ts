import type { ImageField } from '@sitecore-content-sdk/nextjs';

import { resolveArticleHeaderFields, resolveArticleHeaderPageFields } from '@/components/article-header/article-header.fields';

const mockImage: ImageField = { value: { src: '/hero.jpg', alt: 'Hero' } } as ImageField;

describe('resolveArticleHeaderFields', () => {
  it('returns flat fields when no layout data', () => {
    expect(
      resolveArticleHeaderFields({
        imageRequired: mockImage,
        eyebrowOptional: { value: 'News' },
      }),
    ).toEqual({
      imageRequired: mockImage,
      eyebrowOptional: { value: 'News' },
    });
  });

  it('reads imageRequired from fields.data.datasource (GraphQL layout)', () => {
    const resolved = resolveArticleHeaderFields({
      data: {
        datasource: {
          imageRequired: { jsonValue: mockImage },
        },
        externalFields: {},
      },
    });
    expect(resolved.imageRequired).toEqual({ jsonValue: mockImage });
  });

  it('lets flat fields override datasource when both exist', () => {
    const override: ImageField = { value: { src: '/override.jpg', alt: 'O' } } as ImageField;
    const resolved = resolveArticleHeaderFields({
      data: {
        datasource: { imageRequired: mockImage },
      },
      imageRequired: override,
    });
    expect(resolved.imageRequired).toEqual(override);
  });

  it('maps Sitecore Eyebrow field to eyebrowOptional', () => {
    const resolved = resolveArticleHeaderFields({
      data: {
        datasource: {
          Eyebrow: { value: 'Category label' },
        },
        externalFields: {},
      },
    });
    expect(resolved.eyebrowOptional).toEqual({ value: 'Category label' });
  });

  it('unwraps Eyebrow jsonValue from datasource', () => {
    const resolved = resolveArticleHeaderFields({
      data: {
        datasource: {
          Eyebrow: { jsonValue: { value: 'From GraphQL' } },
        },
        externalFields: {},
      },
    });
    expect(resolved.eyebrowOptional).toEqual({ value: 'From GraphQL' });
  });

  it('maps cta and summary from datasource', () => {
    const resolved = resolveArticleHeaderFields({
      data: {
        datasource: {
          cta: { value: 'Advancing Life-Saving Therapies' },
          summary: { value: 'Summary paragraph text.' },
        },
        externalFields: {},
      },
    });
    expect(resolved.cta).toEqual({ value: 'Advancing Life-Saving Therapies' });
    expect(resolved.summary).toEqual({ value: 'Summary paragraph text.' });
  });

  it('returns empty datasource fields in editing mode for inline authoring', () => {
    const resolved = resolveArticleHeaderFields(
      {
        data: {
          datasource: {
            cta: { value: '' },
            summary: { value: '' },
          },
          externalFields: {},
        },
      },
      true,
    );
    expect(resolved.cta).toEqual({ value: '' });
    expect(resolved.summary).toEqual({ value: '' });
  });
});

describe('resolveArticleHeaderPageFields', () => {
  it('reads pageHeaderTitle from externalFields prop', () => {
    const resolved = resolveArticleHeaderPageFields({
      fields: {},
      externalFields: {
        pageHeaderTitle: { value: 'Article Title' },
      },
    });
    expect(resolved.pageHeaderTitle).toEqual({ value: 'Article Title' });
  });

  it('reads pageHeaderTitle from fields.data.externalFields', () => {
    const resolved = resolveArticleHeaderPageFields({
      fields: {
        data: {
          externalFields: {
            pageHeaderTitle: { jsonValue: { value: 'From Layout' } },
          },
        },
      },
      externalFields: {
        pageHeaderTitle: { value: '' },
      },
    });
    expect(resolved.pageHeaderTitle).toEqual({ value: 'From Layout' });
  });
});
