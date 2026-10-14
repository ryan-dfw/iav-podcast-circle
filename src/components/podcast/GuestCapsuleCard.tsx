import { useState } from 'react';
import { episodePath, type GuestCapsule } from '@/content';
import { ButtonLink } from '@/components/ui/Button';
import { SampleButton } from '@/components/ui/SampleButton';
import { defaultSrc, srcSetFor } from '@/lib/image';
import styles from './GuestCapsuleCard.module.css';

/** Button colors rotate navy → rose mauve → gray-blue, as in the client mockup. */
const accents = ['primary', 'mauve', 'periwinkle'] as const;

function initials(name: string) {
  return name
    .split(/\s+/)
    .map((p) => p[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
}

/**
 * Home page "Guest Capsule": photo, name, listen button. Without a portrait
 * (or if it fails to load) a quiet monogram is shown instead.
 */
export function GuestCapsuleCard({ guest, index, cta }: { guest: GuestCapsule; index: number; cta: string }) {
  const [imgFailed, setImgFailed] = useState(false);
  const showImg = guest.portrait && !imgFailed;
  const slug = guest.episode?.slug;
  const variant = accents[index % accents.length];

  return (
    <article className={styles.card}>
      <div className={styles.portrait}>
        {showImg ? (
          <img
            src={defaultSrc(guest.portrait!)}
            srcSet={srcSetFor(guest.portrait!)}
            sizes="(max-width: 40rem) 90vw, 20rem"
            alt={guest.portrait!.alt}
            loading="lazy"
            decoding="async"
            onError={() => setImgFailed(true)}
          />
        ) : (
          <span className={styles.monogram} aria-hidden="true">
            {initials(guest.name)}
          </span>
        )}
      </div>
      <div className={styles.body}>
        <h3 className={styles.name}>
          {guest.name}
        </h3>
        {guest.episode && (
          <p className={styles.episode}>
            Episode {guest.episode.number} · {guest.episode.title}
          </p>
        )}
        {slug && !guest.sample ? (
          <ButtonLink to={episodePath({ slug })} variant={variant}>
            {cta}
            <span className="visually-hidden">: {guest.name}</span>
          </ButtonLink>
        ) : (
          <SampleButton variant={variant}>
            {cta}
            <span className="visually-hidden">: {guest.name}</span>
          </SampleButton>
        )}
      </div>
    </article>
  );
}
