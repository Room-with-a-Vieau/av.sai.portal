import {
  clearAnalyticsCookies,
  identifyDemoPersona,
  isDemoAnalyticsEnabled,
  resetDemoPersonaAnalyticsSession,
} from '@/lib/demo-analytics-identity';

const mockSetClientId = jest.fn().mockResolvedValue(undefined);
const mockIdentity = jest.fn().mockResolvedValue(null);
const mockGetAnalyticsPlugin = jest.fn();

jest.mock('@sitecore-content-sdk/events', () => ({
  identity: (...args: unknown[]) => mockIdentity(...args),
}));

jest.mock('@sitecore-content-sdk/analytics-core/internal', () => ({
  CLIENT_ID_COOKIE_NAME: 'cid',
  COOKIE_NAME_PREFIX: 'sc_',
  getAnalyticsPlugin: () => mockGetAnalyticsPlugin(),
}));

jest.mock('sitecore.config', () => ({
  __esModule: true,
  default: {
    api: {
      edge: {
        clientContextId: 'test-context-id',
      },
    },
  },
}));

describe('demo-analytics-identity', () => {
  const originalNodeEnv = process.env.NODE_ENV;
  const originalEnableFlag = process.env.NEXT_PUBLIC_ENABLE_DEMO_ANALYTICS;

  beforeEach(() => {
    jest.clearAllMocks();
    document.cookie = 'sc_cid=existing-client-id; path=/';
    document.cookie = 'sc_cid_personalize=existing-profile-id; path=/';

    mockGetAnalyticsPlugin.mockReturnValue({
      options: {
        visitorIds: { clientId: 'existing-client-id', profileId: 'existing-profile-id' },
      },
      adapter: {
        setClientId: mockSetClientId,
      },
    });

    window.scContentSDK = {
      analytics_core: {
        getClientId: jest.fn(),
        options: {
          siteName: 'rockland',
          contextId: 'test-context-id',
          edgeUrl: 'https://edge.example',
        },
        version: '2.0.2',
      },
    };
  });

  afterEach(() => {
    process.env.NODE_ENV = originalNodeEnv;
    process.env.NEXT_PUBLIC_ENABLE_DEMO_ANALYTICS = originalEnableFlag;
  });

  it('is disabled in development unless explicitly enabled', () => {
    process.env.NODE_ENV = 'development';
    process.env.NEXT_PUBLIC_ENABLE_DEMO_ANALYTICS = undefined;

    expect(isDemoAnalyticsEnabled()).toBe(false);

    process.env.NEXT_PUBLIC_ENABLE_DEMO_ANALYTICS = 'true';

    expect(isDemoAnalyticsEnabled()).toBe(true);
  });

  it('clears analytics cookies', () => {
    clearAnalyticsCookies();

    expect(document.cookie).not.toContain('sc_cid=');
    expect(document.cookie).not.toContain('sc_cid_personalize=');
  });

  it('resets the analytics session on logout', async () => {
    process.env.NODE_ENV = 'production';

    await resetDemoPersonaAnalyticsSession();

    expect(mockSetClientId).toHaveBeenCalledTimes(1);
    expect(mockGetAnalyticsPlugin().options.visitorIds).toBeUndefined();
  });

  it('requests a new profile and sends identity on persona login', async () => {
    process.env.NODE_ENV = 'production';

    await identifyDemoPersona('Young Professional');

    expect(mockSetClientId).toHaveBeenCalledTimes(1);
    expect(mockIdentity).toHaveBeenCalledWith({
      channel: 'WEB',
      firstName: 'Jordan',
      lastName: 'Mitchell',
      email: 'jordan.mitchell@demo.rocklandtrust.local',
      identifiers: [{ id: 'rockland-demo-yp', provider: 'rockland-demo' }],
      extensionData: {
        demoPersona: 'Young Professional',
        demoPersonaCode: 'yp',
      },
    });
  });

  it('can identify without resetting the session on page reload', async () => {
    process.env.NODE_ENV = 'production';

    await identifyDemoPersona('College Student', { resetSession: false });

    expect(mockSetClientId).not.toHaveBeenCalled();
    expect(mockIdentity).toHaveBeenCalledWith(
      expect.objectContaining({
        email: 'taylor.brooks@demo.rocklandtrust.local',
      })
    );
  });
});
