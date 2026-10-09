import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { getLegacyRedirects } from '@/content';
import { SiteLayout } from '@/components/layout/SiteLayout';
import { HomePage } from '@/pages/HomePage';
import { AboutPage } from '@/pages/AboutPage';
import { PodcastPage } from '@/pages/PodcastPage';
import { EpisodePage } from '@/pages/EpisodePage';
import { NewsletterPage } from '@/pages/NewsletterPage';
import { ResourcesPage } from '@/pages/ResourcesPage';
import { CirclePage } from '@/pages/CirclePage';
import { NotFoundPage } from '@/pages/NotFoundPage';

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<SiteLayout />}>
          <Route index element={<HomePage />} />
          <Route path="about" element={<AboutPage />} />
          <Route path="podcast" element={<PodcastPage />} />
          <Route path="podcast/:slug" element={<EpisodePage />} />
          <Route path="newsletter" element={<NewsletterPage />} />
          <Route path="resources" element={<ResourcesPage />} />
          <Route path="circle" element={<CirclePage />} />

          {/* Keep old links working, e.g. the Canva-era /episode01 */}
          {getLegacyRedirects().map(({ from, to }) => (
            <Route key={from} path={from} element={<Navigate to={to} replace />} />
          ))}

          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
