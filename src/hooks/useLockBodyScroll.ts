import { useEffect } from 'react';

/**
 * Locks document body scroll without layout shift when active.
 * Only applies when active=true. Restores original overflow and scroll position on cleanup.
 */
export function useLockBodyScroll(active: boolean): void {
  useEffect(() => {
    if (!active || typeof document === 'undefined') return;

    const originalOverflow = document.body.style.overflow;
    const originalPaddingRight = document.body.style.paddingRight;
    const scrollY = window.scrollY;

    // Prevent background scrolling while preserving scroll position
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = originalOverflow;
      document.body.style.paddingRight = originalPaddingRight;
      window.scrollTo(0, scrollY);
    };
  }, [active]);
}

