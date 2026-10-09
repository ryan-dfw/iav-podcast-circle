import type { ResourceCategory } from '@/content/types';
import { SampleBadge } from '@/components/ui/Section';
import styles from './ResourceCategories.module.css';

/** Collapsible resource categories (native <details>, so fully keyboard accessible). */
export function ResourceCategories({ categories }: { categories: ResourceCategory[] }) {
  return (
    <div className={styles.list}>
      {categories.map((cat, i) => (
        <details key={cat.id} className={styles.category} open={i === 0}>
          <summary className={styles.summary}>
            <span className={styles.titleWrap}>
              <h2 className={styles.title}>{cat.title}</h2>
              <span className={styles.intro}>{cat.intro}</span>
            </span>
            {cat.items.length > 0 && (
              <span className={styles.count}>
                {cat.items.length} {cat.items.length === 1 ? 'listing' : 'listings'}
              </span>
            )}
          </summary>

          {cat.items.length === 0 ? (
            <p className={styles.empty}>Curated listings are coming soon.</p>
          ) : (
            <ul className={styles.items}>
              {cat.items.map((item) => (
                <li key={item.name} className={styles.item}>
                  <h3 className={styles.itemName}>
                    {item.url ? (
                      <a href={item.url} target="_blank" rel="noopener noreferrer">
                        {item.name}
                        <span className="visually-hidden"> (opens in a new tab)</span>
                      </a>
                    ) : (
                      item.name
                    )}
                    {item.sample && <SampleBadge />}
                  </h3>
                  {item.location && <p className={styles.location}>{item.location}</p>}
                  <p className={styles.desc}>{item.description}</p>
                </li>
              ))}
            </ul>
          )}
        </details>
      ))}
    </div>
  );
}
