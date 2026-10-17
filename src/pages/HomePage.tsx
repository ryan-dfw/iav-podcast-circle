import { usePageMeta } from '@/hooks/usePageMeta';
import { HomeHero } from '@/components/home/HomeHero';

export function HomePage() {
  usePageMeta({});

  return <HomeHero />;
}
