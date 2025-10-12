// File: hooks/useMediaQuery.ts
// Utility hook untuk responsive design - detect screen sizes
import { useState, useEffect } from 'react';

export const useMediaQuery = (query: string): boolean => {
  const [matches, setMatches] = useState(false);
  
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const media = window.matchMedia(query);
      setMatches(media.matches);
      
      const listener = (event: MediaQueryListEvent) => {
        setMatches(event.matches);
      };
      
      media.addEventListener('change', listener);
      
      return () => {
        media.removeEventListener('change', listener);
      };
    }
  }, [query]);
  
  return matches;
};

// Predefined breakpoints
export const useBreakpoints = () => {
  const isMobile = useMediaQuery('(max-width: 768px)');
  const isTablet = useMediaQuery('(min-width: 769px) and (max-width: 1024px)');
  const isDesktop = useMediaQuery('(min-width: 1025px)');
  const isLargeDesktop = useMediaQuery('(min-width: 1440px)');
  
  return {
    isMobile,
    isTablet,
    isDesktop,
    isLargeDesktop,
  };
};
