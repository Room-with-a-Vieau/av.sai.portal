import React from 'react';
import { render } from '@testing-library/react';

import { createComponentProps } from '@/__tests__/test-utils/testHelpers';
import { mockPageEditing } from '@/__tests__/test-utils/mockPage';

import type {
  HtmlSnippetBlockFields,
  HtmlSnippetBlockProps,
} from '@/components/html-snippet-block/html-snippet-block.props';

function htmlSnippetBlockProps(partial: Partial<HtmlSnippetBlockProps>): HtmlSnippetBlockProps {
  return {
    ...createComponentProps({}),
    fields: {},
    ...partial,
  } as HtmlSnippetBlockProps;
}

jest.mock('@sitecore-content-sdk/nextjs', () => ({
  useSitecore: jest.fn(() => ({
    page: {
      mode: {
        isEditing: false,
        isNormal: true,
        isPreview: false,
        name: 'normal',
        designLibrary: { isVariantGeneration: false },
        isDesignLibrary: false,
      },
      layout: { sitecore: { context: {}, route: null } },
      locale: 'en',
    },
  })),
  RichText: ({ field, className }: { field?: { value?: string }; className?: string }) => {
    if (!field?.value?.trim()) return null;
    return React.createElement('div', {
      className,
      dangerouslySetInnerHTML: { __html: field.value },
    });
  },
}));

import { Default as HtmlSnippetBlock } from '@/components/html-snippet-block/HtmlSnippetBlock';

const baseFields = {
  body: {
    value: '<p>Demo <strong>HTML</strong> body.</p>',
    editable: false,
  },
};

describe('HtmlSnippetBlock', () => {
  it('renders HTML body from flat fields', () => {
    render(<HtmlSnippetBlock {...htmlSnippetBlockProps({ fields: baseFields })} />);

    const body = document.querySelector('.html-snippet-block__body');
    expect(body?.innerHTML).toContain('Demo');
    expect(body?.innerHTML).toContain('<strong>HTML</strong>');
  });

  it('centers the snippet container', () => {
    const { container } = render(<HtmlSnippetBlock {...htmlSnippetBlockProps({ fields: baseFields })} />);

    const article = container.querySelector('[data-component="html-snippet-block"]');
    expect(article).toHaveClass('mx-auto');
    expect(article).toHaveClass('max-w-[100rem]');
  });

  it('renders nothing when no field values and not editing', () => {
    const { container } = render(<HtmlSnippetBlock {...htmlSnippetBlockProps({ fields: {} })} />);

    expect(container.querySelector('[data-component="html-snippet-block"]')).toBeNull();
  });
});

describe('HtmlSnippetBlock (editing)', () => {
  const defaultPage = {
    page: {
      mode: {
        isEditing: false,
        isNormal: true,
        isPreview: false,
        name: 'normal' as const,
        designLibrary: { isVariantGeneration: false },
        isDesignLibrary: false,
      },
      layout: { sitecore: { context: {}, route: null } },
      locale: 'en',
    },
  };

  beforeEach(() => {
    const sdk = jest.requireMock('@sitecore-content-sdk/nextjs') as {
      useSitecore: jest.Mock;
    };
    sdk.useSitecore.mockReturnValue({ page: mockPageEditing });
  });

  afterEach(() => {
    const sdk = jest.requireMock('@sitecore-content-sdk/nextjs') as {
      useSitecore: jest.Mock;
    };
    sdk.useSitecore.mockReturnValue(defaultPage);
  });

  it('still renders shell when body is empty in editing mode', () => {
    render(
      <HtmlSnippetBlock
        {...htmlSnippetBlockProps({
          fields: {
            body: { value: '', editable: true },
          } as HtmlSnippetBlockFields,
        })}
      />,
    );

    expect(document.querySelector('[data-component="html-snippet-block"]')).toBeInTheDocument();
  });
});
