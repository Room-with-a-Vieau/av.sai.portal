import React from 'react';
import { render } from '@testing-library/react';

import { ApplySiteTheme } from '@/components/theme/ApplySiteTheme';

describe('ApplySiteTheme', () => {
  it('sets data-theme on documentElement without rendering a script tag', () => {
    const { container } = render(<ApplySiteTheme theme="bcbst" />);

    expect(container.querySelector('script')).toBeNull();
    expect(document.documentElement.getAttribute('data-theme')).toBe('bcbst');
    expect(document.cookie).toContain('app-theme=bcbst');
  });
});
