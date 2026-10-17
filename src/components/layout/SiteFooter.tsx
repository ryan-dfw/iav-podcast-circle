import { Link } from 'react-router-dom';
import { mailto, site } from '@/config/site';
import { primaryNav } from '@/content/navigation';
import { PendingLink } from '@/components/ui/PendingLink';
import styles from './SiteFooter.module.css';

export function SiteFooter() {
  const year = new Date().getFullYear();
  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.top}`}>
        <div className={styles.brand}>
          <p className={styles.name}>{site.shortName}</p>
          <p className={styles.line}>{site.host.signatureLine}</p>
        </div>

        <nav aria-label="Footer">
          <ul className={styles.links}>
            {primaryNav.map((item) => (
              <li key={item.to}>
                <Link to={item.to}>{item.label}</Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className={styles.contact}>
          <h2 className={styles.label}>Contact</h2>
          <a href={mailto()}>{site.contact.email}</a>
          {site.socials.length > 0 && (
            <ul className={styles.socials} aria-label="Follow along">
              {site.socials.map((s) => (
                <li key={s.id}>
                  {s.pending ? (
                    <PendingLink>{s.label}</PendingLink>
                  ) : (
                    <a href={s.url} target="_blank" rel="noopener noreferrer">
                      {s.label}
                      <span className="visually-hidden"> (opens in a new tab)</span>
                    </a>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
      <div className={`container ${styles.bottom}`}>
        <p>
          © {year} {site.shortName}
        </p>
      </div>
    </footer>
  );
}
