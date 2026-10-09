import { getResourceCategories, resourcesCopy } from '@/content';
import { usePageMeta } from '@/hooks/usePageMeta';
import { SectionHeading } from '@/components/ui/Section';
import { ResourceCategories } from '@/components/resources/ResourceCategories';
import styles from './pages.module.css';

export function ResourcesPage() {
  usePageMeta({ title: 'Resources', description: resourcesCopy.lead });
  const categories = getResourceCategories();

  return (
    <>
      <div className={`container ${styles.intro}`}>
        <SectionHeading id="resources-title" as="h1" eyebrow={resourcesCopy.eyebrow} title={resourcesCopy.title} />
        <p className={styles.lead}>{resourcesCopy.lead}</p>
      </div>
      <div className={styles.narrow} style={{ paddingBottom: 'var(--space-2xl)' }}>
        <ResourceCategories categories={categories} />
      </div>
    </>
  );
}
