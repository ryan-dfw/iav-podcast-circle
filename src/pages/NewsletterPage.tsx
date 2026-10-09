import { newsletterCopy } from '@/content';
import { usePageMeta } from '@/hooks/usePageMeta';
import { Section, SectionHeading } from '@/components/ui/Section';
import { NewsletterSignup } from '@/components/newsletter/NewsletterSignup';
import styles from './pages.module.css';

export function NewsletterPage() {
  usePageMeta({ title: 'Newsletter', description: `${newsletterCopy.subtitle} from IAV Podcast Circle.` });

  return (
    <>
      <Section tone="blush">
        <div className="container">
          <div className={styles.centerStack}>
            <p className="eyebrow">{newsletterCopy.eyebrow}</p>
          </div>
          <NewsletterSignup
            source="newsletter-page"
            title={newsletterCopy.title}
            subtitle={newsletterCopy.subtitle}
            headingLevel={1}
          />
        </div>
      </Section>

      <Section labelledBy="receive-title">
        <div className="container">
          <SectionHeading id="receive-title" title="What you’ll receive" />
          <ul className={styles.receives}>
            {newsletterCopy.receives.map((item) => (
              <li key={item.title}>
                <h3>{item.title}</h3>
                <p>{item.body}</p>
              </li>
            ))}
          </ul>
        </div>
      </Section>
    </>
  );
}
