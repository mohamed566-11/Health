import { useCallback, useEffect, useState } from 'react';

interface FullscreenElement extends HTMLElement {
  webkitRequestFullscreen?: () => Promise<void>;
  msRequestFullscreen?: () => Promise<void>;
}

interface FullscreenDocument extends Document {
  webkitFullscreenElement?: Element;
  msFullscreenElement?: Element;
  webkitExitFullscreen?: () => Promise<void>;
  msExitFullscreen?: () => Promise<void>;
}

/**
 * Handles cross-browser fullscreen mode with orientation hints and iOS Safari fallback.
 * Desktop code path is unaffected when not triggered.
 */
export function useFullscreen(elementRef: React.RefObject<HTMLElement | null>) {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isFallbackFullscreen, setIsFallbackFullscreen] = useState(false);

  const checkFullscreen = useCallback(() => {
    const doc = document as FullscreenDocument;
    const isDocFs = Boolean(
      doc.fullscreenElement || doc.webkitFullscreenElement || doc.msFullscreenElement
    );
    setIsFullscreen(isDocFs || isFallbackFullscreen);
  }, [isFallbackFullscreen]);

  useEffect(() => {
    document.addEventListener('fullscreenchange', checkFullscreen);
    document.addEventListener('webkitfullscreenchange', checkFullscreen);
    return () => {
      document.removeEventListener('fullscreenchange', checkFullscreen);
      document.removeEventListener('webkitfullscreenchange', checkFullscreen);
    };
  }, [checkFullscreen]);

  const enterFullscreen = useCallback(async () => {
    const el = elementRef.current as FullscreenElement | null;
    if (!el) return;

    try {
      if (el.requestFullscreen) {
        await el.requestFullscreen();
      } else if (el.webkitRequestFullscreen) {
        await el.webkitRequestFullscreen();
      } else if (el.msRequestFullscreen) {
        await el.msRequestFullscreen();
      } else {
        // Fallback for iOS Safari
        setIsFallbackFullscreen(true);
        setIsFullscreen(true);
      }

      // Try orientation lock if supported (mobile only)
      if (typeof window !== 'undefined' && 'screen' in window && 'orientation' in window.screen) {
        const orientation = window.screen.orientation as ScreenOrientation & {
          lock?: (orientation: string) => Promise<void>;
        };
        if (typeof orientation?.lock === 'function') {
          orientation.lock('landscape').catch(() => {
            // Ignore lock failure if not supported or permitted
          });
        }
      }
    } catch {
      // Fallback if requestFullscreen was rejected
      setIsFallbackFullscreen(true);
      setIsFullscreen(true);
    }
  }, [elementRef]);

  const exitFullscreen = useCallback(async () => {
    const doc = document as FullscreenDocument;
    try {
      if (doc.exitFullscreen && doc.fullscreenElement) {
        await doc.exitFullscreen();
      } else if (doc.webkitExitFullscreen && doc.webkitFullscreenElement) {
        await doc.webkitExitFullscreen();
      } else if (doc.msExitFullscreen && doc.msFullscreenElement) {
        await doc.msExitFullscreen();
      }
    } catch {
      // Ignore
    }
    setIsFallbackFullscreen(false);
    setIsFullscreen(false);

    // Unlock orientation if possible
    if (typeof window !== 'undefined' && 'screen' in window && 'orientation' in window.screen) {
      const orientation = window.screen.orientation as ScreenOrientation & {
        unlock?: () => void;
      };
      if (typeof orientation?.unlock === 'function') {
        try {
          orientation.unlock();
        } catch {
          // Ignore
        }
      }
    }
  }, []);

  const toggleFullscreen = useCallback(() => {
    if (isFullscreen) {
      exitFullscreen();
    } else {
      enterFullscreen();
    }
  }, [enterFullscreen, exitFullscreen, isFullscreen]);

  return {
    isFullscreen,
    isFallbackFullscreen,
    enterFullscreen,
    exitFullscreen,
    toggleFullscreen,
  };
}

