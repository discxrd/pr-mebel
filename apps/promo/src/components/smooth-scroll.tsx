'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Lenis from 'lenis';
import 'lenis/dist/lenis.css';

export const SmoothScroll = () => {
  const pathname = usePathname();

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 1.5,
    });

    let rafId: number;
    function raf(time: number) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }

    rafId = requestAnimationFrame(raf);

    const handleDocumentClick = (e: MouseEvent) => {
      const anchor = (e.target as HTMLElement).closest('a');
      if (!anchor) return;

      const href = anchor.getAttribute('href');
      if (href && href.startsWith('#') && href.length > 1) {
        try {
          const targetElement = document.querySelector(href) as HTMLElement | null;
          if (targetElement) {
            e.preventDefault();
            lenis.scrollTo(targetElement, {
              offset: -96,
              duration: 1.2,
            });
          }
        } catch (error) {
          console.error("Invalid anchor selector:", href, error);
        }
      }
    };

    document.addEventListener('click', handleDocumentClick);

    // Global access for other components if needed
    (window as any).lenis = lenis;

    return () => {
      cancelAnimationFrame(rafId);
      document.removeEventListener('click', handleDocumentClick);
      lenis.destroy();
      delete (window as any).lenis;
    };
  }, []);

  // Listen to route changes to reset scroll position or scroll to target hash
  useEffect(() => {
    const lenis = (window as any).lenis;
    if (!lenis) return;

    // Check if there is a hash in the URL
    const hash = window.location.hash;
    if (hash) {
      // Find the element with the corresponding ID
      const targetElement = document.querySelector(hash) as HTMLElement | null;
      if (targetElement) {
        // Wait for Next.js layout to render and settle before scrolling
        const timer = setTimeout(() => {
          lenis.scrollTo(targetElement, {
            offset: -96,
            duration: 1.2,
            immediate: false,
          });
        }, 150);
        return () => clearTimeout(timer);
      }
    } else {
      // If no hash, scroll to top immediately on route change
      lenis.scrollTo(0, { immediate: true });
    }
  }, [pathname]);

  return null;
};

