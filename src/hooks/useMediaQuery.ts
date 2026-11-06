import { useEffect, useState } from 'react';

/**
 * Hook to match media queries reactively.
 * Used exclusively for gating mobile/tablet-specific features below 1024px.
 */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState<boolean>(() => {
    if (typeof window !== 'undefined' && window.matchMedia) {
      return window.matchMedia(query).matches;
    }
    return false;
  });

  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;

    const mediaQueryList = window.matchMedia(query);
    const updateMatches = (e: MediaQueryListEvent | MediaQueryList) => {
      setMatches(e.matches);
    };

    updateMatches(mediaQueryList);

    if (mediaQueryList.addEventListener) {
      mediaQueryList.addEventListener('change', updateMatches);
      return () => mediaQueryList.removeEventListener('change', updateMatches);
    } else {
      // Legacy fallback
      mediaQueryList.addListener(updateMatches);
      return () => mediaQueryList.removeListener(updateMatches);
    }
  }, [query]);

  return matches;
}

/** Convenience hook: true only in the editable range (< 1024px) */
export function useIsMobileOrTablet(): boolean {
  return useMediaQuery('(max-width: 1023.98px)');
}

/** Convenience hook: true only on phones (< 768px) */
export function useIsMobilePhone(): boolean {
  return useMediaQuery('(max-width: 767.98px)');
}

