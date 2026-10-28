import { BrowserRouter, Navigate, Route, Routes, useParams } from 'react-router-dom';
import { getLegacyRedirects } from '@/content';
import { SiteLayout } from '@/components/layout/SiteLayout';
import { HomePage } from '@/pages/HomePage';
import { AboutPage } from '@/pages/AboutPage';
import { PodcastPage } from '@/pages/PodcastPage';
import { EpisodePage } from '@/pages/EpisodePage';
import { BookPage } from '@/pages/BookPage';
import { ArticlesPage } from '@/pages/ArticlesPage';
import { ArticlePage } from '@/pages/ArticlePage';
import { QuotesPage } from '@/pages/QuotesPage';
import { CirclePage } from '@/pages/CirclePage';
import { NotFoundPage } from '@/pages/NotFoundPage';

function RedirectEpisode() {
  const { slug } = useParams();
  return <Navigate to={`/podcast/${slug}`} replace />;
}

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<SiteLayout />}>
          <Route index element={<HomePage />} />
          <Route path="podcast" element={<PodcastPage />} />
          <Route path="podcast/:slug" element={<EpisodePage />} />
          <Route path="articles" element={<ArticlesPage />} />
          {/* Static segment before :slug — an article may not use the slug "quotes". */}
          <Route path="articles/quotes" element={<QuotesPage />} />
          <Route path="articles/:slug" element={<ArticlePage />} />
          <Route path="about" element={<AboutPage />} />
          <Route path="book" element={<BookPage />} />
          <Route path="circle" element={<CirclePage />} />

          {/* Pages folded into the four main sections */}
          <Route path="stories" element={<Navigate to="/podcast" replace />} />
          <Route path="stories/:slug" element={<RedirectEpisode />} />
          <Route path="newsletter" element={<Navigate to="/about#newsletter" replace />} />
          <Route path="resources" element={<Navigate to="/circle#resources" replace />} />

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
