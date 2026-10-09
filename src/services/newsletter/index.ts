/**
 * Newsletter integration boundary.
 *
 * The signup UI calls `subscribeToNewsletter()` and nothing else. No email
 * provider has been chosen, so the active adapter is `notConnected`, which
 * stores nothing and reports that honestly.
 *
 * To connect a provider later (whichever the client chooses):
 *   1. write an adapter implementing `NewsletterProvider` in this folder —
 *      typically a POST to the provider's hosted form endpoint, or to a small
 *      serverless function if the provider requires a secret API key;
 *   2. return it from `activeProvider()` based on `integrations.newsletter`.
 * Never put a provider's secret API key in frontend code.
 */
import { integrations } from '@/config/integrations';

export interface SubscribeRequest {
  email: string;
  /** Where the form lives, e.g. "home" | "newsletter-page" — useful for tagging. */
  source: string;
}

export type SubscribeResult =
  | { status: 'subscribed' }
  | { status: 'not-connected' }
  | { status: 'error'; message: string };

export interface NewsletterProvider {
  id: string;
  subscribe(request: SubscribeRequest): Promise<SubscribeResult>;
}

const notConnected: NewsletterProvider = {
  id: 'not-connected',
  async subscribe() {
    return { status: 'not-connected' };
  },
};

function activeProvider(): NewsletterProvider {
  switch (integrations.newsletter.provider) {
    // case 'custom': return customProvider;
    default:
      return notConnected;
  }
}

export const isNewsletterConnected = () => activeProvider() !== notConnected;

export function subscribeToNewsletter(request: SubscribeRequest): Promise<SubscribeResult> {
  return activeProvider().subscribe(request);
}
