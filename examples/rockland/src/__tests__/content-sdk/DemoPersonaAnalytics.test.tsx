import { render, waitFor } from '@testing-library/react';

import DemoPersonaAnalytics from '@/components/content-sdk/DemoPersonaAnalytics';
import { DEMO_TAXONOMY_CHANGE_EVENT, DEMO_TAXONOMY_STORAGE_KEY } from '@/lib/demo-taxonomy';

const mockIdentifyDemoPersona = jest.fn().mockResolvedValue(undefined);
const mockResetDemoPersonaAnalyticsSession = jest.fn().mockResolvedValue(undefined);
const mockIsDemoAnalyticsEnabled = jest.fn();

jest.mock('@/lib/demo-analytics-identity', () => ({
  identifyDemoPersona: (...args: unknown[]) => mockIdentifyDemoPersona(...args),
  resetDemoPersonaAnalyticsSession: (...args: unknown[]) => mockResetDemoPersonaAnalyticsSession(...args),
  isDemoAnalyticsEnabled: () => mockIsDemoAnalyticsEnabled(),
}));

describe('DemoPersonaAnalytics', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    window.localStorage.clear();
    mockIsDemoAnalyticsEnabled.mockReturnValue(true);
  });

  it('identifies a stored persona on mount without resetting the session', async () => {
    window.localStorage.setItem(DEMO_TAXONOMY_STORAGE_KEY, 'Growing Family');

    render(<DemoPersonaAnalytics />);

    await waitFor(() => {
      expect(mockIdentifyDemoPersona).toHaveBeenCalledWith('Growing Family', { resetSession: false });
    });
  });

  it('resets analytics on logout events', async () => {
    render(<DemoPersonaAnalytics />);

    window.dispatchEvent(
      new CustomEvent(DEMO_TAXONOMY_CHANGE_EVENT, { detail: { taxonomy: '' } })
    );

    await waitFor(() => {
      expect(mockResetDemoPersonaAnalyticsSession).toHaveBeenCalledTimes(1);
    });
  });

  it('resets analytics and identifies on persona change events', async () => {
    render(<DemoPersonaAnalytics />);

    window.dispatchEvent(
      new CustomEvent(DEMO_TAXONOMY_CHANGE_EVENT, { detail: { taxonomy: 'College Student' } })
    );

    await waitFor(() => {
      expect(mockIdentifyDemoPersona).toHaveBeenCalledWith('College Student', { resetSession: true });
    });
  });
});
