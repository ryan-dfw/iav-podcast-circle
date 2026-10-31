import { useState, type FormEvent } from 'react';
import { circleStarterGate, type KitIntent } from '@/content';
import { requestKitLink } from '@/services/kit';

export type KitRequestStatus = 'idle' | 'sending' | 'sent' | 'error';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/**
 * The "email me the journal" behaviour, shared by the home hero and the gate
 * screen. Only the logic is shared — each renders its own markup, because one
 * sits on the dark hero and the other on a light page.
 */
export function useKitRequest(intent: KitIntent = 'kit', sentMessage: string = circleStarterGate.sent) {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<KitRequestStatus>('idle');
  const [notice, setNotice] = useState('');

  async function submit(event: FormEvent) {
    event.preventDefault();
    if (status === 'sending') return;

    const address = email.trim();
    if (!EMAIL_RE.test(address)) {
      setStatus('error');
      setNotice(circleStarterGate.invalidEmail);
      return;
    }

    setStatus('sending');
    setNotice('');
    const result = await requestKitLink(address, intent);

    if (result.status === 'sent') {
      setStatus('sent');
      setNotice(sentMessage);
      setEmail('');
    } else if (result.status === 'invalid-email') {
      setStatus('error');
      setNotice(circleStarterGate.invalidEmail);
    } else {
      setStatus('error');
      setNotice(circleStarterGate.failed);
    }
  }

  return { email, setEmail, status, notice, submit };
}
