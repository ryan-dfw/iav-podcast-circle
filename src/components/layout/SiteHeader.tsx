import { useEffect, useId, useLayoutEffect, useRef, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { primaryNav, type NavItem } from '@/content/navigation';
import styles from './SiteHeader.module.css';

function NavList({ items, className }: { items: NavItem[]; className?: string }) {
  return (
    <ul className={className}>
      {items.map((item) => (
        <li key={item.to}>
          <NavLink
            to={item.to}
            end={item.to === '/'}
            className={({ isActive }) => `${styles.link} ${isActive ? styles.active : ''}`}
          >
            {item.label}
          </NavLink>
        </li>
      ))}
    </ul>
  );
}

function Wordmark() {
  return (
    <Link to="/" className={styles.wordmark} aria-label="IAV Circle — home">
      <span className={styles.wordmarkIav}>IAV</span> Circle
    </Link>
  );
}

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();
  const menuId = useId();
  const half = Math.ceil(primaryNav.length / 2);
  const headerRef = useRef<HTMLElement>(null);
  const menuRef = useRef<HTMLElement>(null);

  // Publish the header's live height as --header-h so full-bleed banners can
  // slide up underneath it.
  useLayoutEffect(() => {
    const el = headerRef.current;
    if (!el) return;
    const root = document.documentElement;
    // The bar only — an open mobile menu shouldn't drag the page around.
    const set = () => {
      const menu = menuRef.current;
      const menuH = menu && !menu.hidden ? menu.offsetHeight : 0;
      root.style.setProperty('--header-h', `${el.offsetHeight - menuH}px`);
    };
    set();
    const ro = new ResizeObserver(set);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  return (
    <header ref={headerRef} className={styles.header}>
      {/* Desktop: navigation split around a centered wordmark, as in the client mockup. */}
      <nav className={`container ${styles.desktop}`} aria-label="Primary">
        <NavList items={primaryNav.slice(0, half)} className={styles.listStart} />
        <Wordmark />
        <NavList items={primaryNav.slice(half)} className={styles.listEnd} />
      </nav>

      {/* Mobile / tablet */}
      <div className={`container ${styles.mobileBar}`}>
        <Wordmark />
        <button
          type="button"
          className={styles.menuButton}
          aria-expanded={open}
          aria-controls={menuId}
          onClick={() => setOpen((v) => !v)}
        >
          <span className={styles.menuIcon} aria-hidden="true" data-open={open} />
          <span>{open ? 'Close' : 'Menu'}</span>
        </button>
      </div>
      <nav ref={menuRef} id={menuId} className={styles.mobileNav} aria-label="Primary" hidden={!open}>
        <NavList items={primaryNav} className="container" />
      </nav>
    </header>
  );
}
