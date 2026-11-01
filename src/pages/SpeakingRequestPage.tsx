import { useId, useRef, useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { speakingCopy as copy } from '@/content';
import { mailto, site } from '@/config/site';
import { usePageMeta } from '@/hooks/usePageMeta';
import { Section } from '@/components/ui/Section';
import styles from './SpeakingRequestPage.module.css';

const FORM_NAME = 'speaking-request';

type Status = 'idle' | 'sending' | 'error' | 'sent';

function Select({ name, label, options, required }: { name: string; label: string; options: string[]; required?: boolean }) {
  const id = useId();
  return (
    <p className={styles.field}>
      <label htmlFor={id}>
        {label}
        {required && <span className={styles.req}> *</span>}
      </label>
      <select id={id} name={name} required={required} defaultValue="">
        <option value="">Choose one</option>
        {options.map((o) => (
          <option key={o}>{o}</option>
        ))}
      </select>
    </p>
  );
}

function Field({
  name,
  label,
  type = 'text',
  required,
  hint,
  autoComplete,
  placeholder,
  wide,
}: {
  name: string;
  label: string;
  type?: string;
  required?: boolean;
  hint?: string;
  autoComplete?: string;
  placeholder?: string;
  wide?: boolean;
}) {
  const id = useId();
  return (
    <p className={`${styles.field} ${wide ? styles.wide : ''}`}>
      <label htmlFor={id}>
        {label}
        {required && <span className={styles.req}> *</span>}
        {hint && <span className={styles.hint}> ({hint})</span>}
      </label>
      <input id={id} name={name} type={type} required={required} autoComplete={autoComplete} placeholder={placeholder} />
    </p>
  );
}

function TextArea({ name, label }: { name: string; label: string }) {
  const id = useId();
  return (
    <p className={`${styles.field} ${styles.wide}`}>
      <label htmlFor={id}>{label}</label>
      <textarea id={id} name={name} rows={3} />
    </p>
  );
}

/**
 * Speaking request — the third option on the booking page sends people here.
 *
 * Submissions go to Netlify Forms, which is deliberately a different pipe to
 * the kit's emails: it needs no sending domain of its own, so it works the
 * moment it deploys. Netlify only registers a form it can see in static HTML
 * at build time, so a hidden copy of these exact field names lives in
 * index.html — change one and you have to change both.
 */
export function SpeakingRequestPage() {
  const formRef = useRef<HTMLFormElement>(null);
  const [status, setStatus] = useState<Status>('idle');
  const [error, setError] = useState<string>('');
  const [inPerson, setInPerson] = useState(true);
  usePageMeta({ title: 'Book Isha to Speak', description: copy.title });

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = formRef.current;
    if (!form || status === 'sending') return;

    if (!form.checkValidity()) {
      setStatus('error');
      setError(copy.errors.required);
      form.querySelector<HTMLElement>(':invalid')?.focus();
      return;
    }

    const data = new FormData(form);
    const from = String(data.get('date_from') ?? '');
    const to = String(data.get('date_to') ?? '');
    if (from && to && to < from) {
      setStatus('error');
      setError(copy.errors.dateOrder);
      form.querySelector<HTMLElement>('[name="date_to"]')?.focus();
      return;
    }

    const body = new URLSearchParams();
    data.forEach((value, key) => body.append(key, typeof value === 'string' ? value : ''));

    setStatus('sending');
    setError('');
    try {
      const res = await fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: body.toString(),
      });
      if (!res.ok) throw new Error(String(res.status));
      setStatus('sent');
    } catch {
      setStatus('error');
      setError('');
    }
  }

  if (status === 'sent') {
    return (
      <Section tone="surface" labelledBy="speak-title">
        <div className={`container-narrow ${styles.thanks}`}>
          <h1 id="speak-title" className={styles.thanksTitle} tabIndex={-1}>
            {copy.thanks.title}
          </h1>
          <p>{copy.thanks.body}</p>
          <p>
            {copy.thanks.contactBefore}
            <a href={mailto()}>{site.contact.email}</a>
            {copy.thanks.contactAfter}
          </p>
          <p>
            <Link to="/book-a-consultation">{copy.back}</Link>
          </p>
        </div>
      </Section>
    );
  }

  const o = copy.options;

  return (
    <Section tone="surface" labelledBy="speak-title">
      <div className={`container-narrow ${styles.wrap}`}>
        <p className="eyebrow">{copy.eyebrow}</p>
        <h1 id="speak-title" className={styles.title}>
          {copy.title}
        </h1>
        <p className={styles.intro}>{copy.intro}</p>

        <form
          ref={formRef}
          name={FORM_NAME}
          method="POST"
          data-netlify="true"
          netlify-honeypot="bot-field"
          noValidate
          onSubmit={onSubmit}
          className={styles.form}
        >
          <input type="hidden" name="form-name" value={FORM_NAME} />
          <p className={styles.honeypot} aria-hidden="true">
            <label>
              Leave this empty: <input name="bot-field" tabIndex={-1} autoComplete="off" />
            </label>
          </p>

          <h2 className={styles.group}>{copy.groups.about}</h2>
          <div className={styles.grid}>
            <Field name="name" label="Your name" required autoComplete="name" />
            <Field name="email" label="Email" type="email" required autoComplete="email" />
            <Field name="organization" label="Organization" required autoComplete="organization" />
            <Field name="role" label="Your role or title" autoComplete="organization-title" />
            <Field name="phone" label="Phone" type="tel" hint="optional" autoComplete="tel" />
            <Select name="referral" label="How did you hear about Isha?" options={o.referral} />
          </div>

          <h2 className={styles.group}>{copy.groups.event}</h2>
          <div className={styles.grid}>
            <Field name="event_name" label="Event name" required />
            <Select name="event_type" label="Type of event" options={o.eventType} />
            <Field name="date_from" label="Earliest date" type="date" required />
            <Field name="date_to" label="Latest date" type="date" required />
          </div>

          <p className={styles.check}>
            <label>
              <input type="checkbox" name="dates_flexible" value="Yes" /> My dates are flexible
            </label>
          </p>

          <fieldset className={styles.choiceSet}>
            <legend>
              In person or virtual?<span className={styles.req}> *</span>
            </legend>
            <div className={styles.choices}>
              {o.locationType.map((option) => (
                <label key={option} className={styles.choice}>
                  <input
                    type="radio"
                    name="location_type"
                    value={option}
                    required
                    defaultChecked={option === 'In person'}
                    onChange={() => setInPerson(option === 'In person')}
                  />
                  <span>{option}</span>
                </label>
              ))}
            </div>
          </fieldset>

          <div className={styles.grid}>
            {inPerson && (
              <Field name="city_state" label="City and state" hint="for in-person events" placeholder="e.g. Dallas, TX" wide />
            )}
            <Select name="audience_size" label="Audience size" options={o.audienceSize} />
            <Select name="format" label="Format and time slot" options={o.format} />
            <Field name="audience" label="Who will be in the room?" placeholder="e.g. college seniors, managers" wide />
            <TextArea name="desired_outcome" label="What should your audience walk away with?" />
          </div>

          <h2 className={styles.group}>{copy.groups.budget}</h2>
          <div className={styles.grid}>
            <Select name="budget" label="Speaking budget" options={o.budget} required />
            <Select name="travel" label="Travel and lodging covered?" options={o.travel} />
            <Field name="confirm_by" label="When do you need to confirm a speaker?" type="date" />
            <TextArea name="notes" label="Anything else we should know?" />
          </div>

          <div className={styles.actions}>
            <button type="submit" className={styles.submit} disabled={status === 'sending'}>
              {status === 'sending' ? copy.sending : copy.submit}
            </button>
            <p className={styles.error} role="alert">
              {status === 'error' &&
                (error || (
                  <>
                    {copy.errors.failedBefore}
                    <a href={mailto()}>{site.contact.email}</a>
                    {copy.errors.failedAfter}
                  </>
                ))}
            </p>
          </div>
        </form>

        <p className={styles.backLink}>
          <Link to="/book-a-consultation">{copy.back}</Link>
        </p>
      </div>
    </Section>
  );
}
