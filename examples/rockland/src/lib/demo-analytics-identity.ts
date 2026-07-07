import {
  CLIENT_ID_COOKIE_NAME,
  COOKIE_NAME_PREFIX,
  getAnalyticsPlugin,
} from '@sitecore-content-sdk/analytics-core/internal';
import { identity } from '@sitecore-content-sdk/events';
import config from 'sitecore.config';

import { getPersonaCode, type DemoUserTaxonomy } from '@/lib/demo-taxonomy';
import {
  DEMO_PERSONA_IDENTIFIER_PROVIDER,
  getDemoPersonaProfile,
} from '@/lib/demo-persona-profiles';

const ANALYTICS_COOKIE_NAMES = [
  `${COOKIE_NAME_PREFIX}${CLIENT_ID_COOKIE_NAME}`,
  `${COOKIE_NAME_PREFIX}${CLIENT_ID_COOKIE_NAME}_personalize`,
] as const;

export function isDemoAnalyticsEnabled(): boolean {
  return (
    process.env.NEXT_PUBLIC_ENABLE_DEMO_ANALYTICS === 'true' || process.env.NODE_ENV !== 'development'
  );
}

function deleteBrowserCookie(cookieName: string): void {
  if (typeof document === 'undefined') return;

  const hostname = window.location.hostname.replace(/^www\./, '');
  const domains = [undefined, hostname, `.${hostname}`];

  for (const domain of domains) {
    const domainPart = domain ? `; domain=${domain}` : '';
    document.cookie = `${cookieName}=; Path=/${domainPart}; Expires=Thu, 01 Jan 1970 00:00:01 GMT;`;
  }
}

function getLegacyAnalyticsCookieNames(): string[] {
  const contextId = config.api.edge?.clientContextId;
  if (!contextId) return [];

  return [`${COOKIE_NAME_PREFIX}${contextId}`, `${COOKIE_NAME_PREFIX}${contextId}_personalize`];
}

export function clearAnalyticsCookies(): void {
  for (const cookieName of [...ANALYTICS_COOKIE_NAMES, ...getLegacyAnalyticsCookieNames()]) {
    deleteBrowserCookie(cookieName);
  }
}

export async function waitForAnalyticsSdk(timeoutMs = 10000): Promise<boolean> {
  const deadline = Date.now() + timeoutMs;

  while (Date.now() < deadline) {
    if (typeof window !== 'undefined' && window.scContentSDK?.analytics_core) {
      return true;
    }

    await new Promise((resolve) => setTimeout(resolve, 50));
  }

  return false;
}

export async function resetAnalyticsSession(): Promise<void> {
  clearAnalyticsCookies();

  const analyticsPlugin = getAnalyticsPlugin();
  analyticsPlugin.options.visitorIds = undefined;
  await analyticsPlugin.adapter.setClientId();
}

export async function identifyDemoPersona(
  persona: DemoUserTaxonomy,
  options?: { resetSession?: boolean }
): Promise<void> {
  if (!isDemoAnalyticsEnabled()) return;
  if (!(await waitForAnalyticsSdk())) {
    console.debug('Demo analytics: SDK not ready for identity');
    return;
  }

  if (options?.resetSession !== false) {
    await resetAnalyticsSession();
  }

  const profile = getDemoPersonaProfile(persona);

  await identity({
    channel: 'WEB',
    firstName: profile.firstName,
    lastName: profile.lastName,
    email: profile.email,
    identifiers: [
      {
        id: profile.identifierId,
        provider: DEMO_PERSONA_IDENTIFIER_PROVIDER,
      },
    ],
    extensionData: {
      demoPersona: persona,
      demoPersonaCode: getPersonaCode(persona),
    },
  }).catch((error) => console.debug(error));
}

export async function resetDemoPersonaAnalyticsSession(): Promise<void> {
  if (!isDemoAnalyticsEnabled()) return;
  if (!(await waitForAnalyticsSdk())) {
    console.debug('Demo analytics: SDK not ready for session reset');
    return;
  }

  await resetAnalyticsSession();
}
