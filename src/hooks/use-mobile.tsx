import * as React from "react";

const MOBILE_BREAKPOINT = 768;

export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(undefined);

  React.useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`);
    const onChange = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    };
    // Support older browsers / environments where MediaQueryList uses addListener/removeListener
    if (typeof mql.addEventListener === 'function') {
      mql.addEventListener('change', onChange);
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
      return () => mql.removeEventListener('change', onChange);
    }
    if (typeof (mql as any).addListener === 'function') {
      (mql as any).addListener(onChange);
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
      return () => (mql as any).removeListener(onChange);
    }
    // Fallback: just set initial value
    setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
  }, []);

  return !!isMobile;
}
