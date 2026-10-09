import type { CircleEvent } from '@/content/types';
import { SampleBadge } from '@/components/ui/Section';
import { eventDateParts } from '@/lib/format';
import styles from './EventList.module.css';

const formatLabel: Record<CircleEvent['format'], string> = {
  'in-person': 'In person',
  online: 'Online',
  hybrid: 'In person & online',
};

/** Presentation of upcoming events. Data source is decided in `getUpcomingEvents()`. */
export function EventList({ events }: { events: CircleEvent[] }) {
  if (events.length === 0) {
    return <p className={styles.empty}>New gatherings will be announced here soon.</p>;
  }
  return (
    <ol className={styles.list}>
      {events.map((event) => {
        const d = eventDateParts(event.startsAt);
        return (
          <li key={event.id} className={styles.event}>
            <time className={styles.date} dateTime={event.startsAt}>
              <span className={styles.month}>{d.month}</span>
              <span className={styles.day}>{d.day}</span>
            </time>
            <div className={styles.body}>
              <h3 className={styles.title}>
                {event.title}
                {event.sample && <SampleBadge />}
              </h3>
              <p className={styles.meta}>
                {d.weekday}, {d.full} · {d.time} · {formatLabel[event.format]}
                {event.location && ` · ${event.location}`}
              </p>
              <p className={styles.desc}>{event.description}</p>
              {event.url && (
                <a className={styles.link} href={event.url} target="_blank" rel="noopener noreferrer">
                  Details<span className="visually-hidden"> for {event.title} (opens in a new tab)</span> →
                </a>
              )}
            </div>
          </li>
        );
      })}
    </ol>
  );
}
