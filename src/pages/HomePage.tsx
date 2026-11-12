import { usePageMeta } from '@/hooks/usePageMeta';
import { HomeHero } from '@/components/home/HomeHero';
import { HomeSections } from '@/components/home/HomeSections';

export function HomePage() {
  usePageMeta({});

  return (
    <>
      <HomeHero />
      <HomeSections />
    </>
  );
}
