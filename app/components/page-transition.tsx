"use client";

import { motion, useReducedMotion } from "motion/react";
import { usePathname, useRouter } from "next/navigation";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  useTransition,
  type ReactNode,
} from "react";

type PageTransitionProps = {
  children: ReactNode;
};

type PageTransitionContextValue = {
  navigate: (href: string) => void;
};

const NAVIGATION_DELAY_MS = 80;
const ROUTE_REVEAL_DELAY_MS = 35;

const PageTransitionContext =
  createContext<PageTransitionContextValue | null>(null);

export function usePageTransition() {
  const context = useContext(PageTransitionContext);

  if (!context) {
    throw new Error("usePageTransition must be used within PageTransition");
  }

  return context;
}

export function PageTransition({ children }: PageTransitionProps) {
  const router = useRouter();
  const pathname = usePathname();
  const shouldReduceMotion = useReducedMotion();
  const [, startNavigation] = useTransition();
  const [isCovering, setIsCovering] = useState(false);
  const pendingPathname = useRef<string | null>(null);
  const pushTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const revealTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearTimers = useCallback(() => {
    if (pushTimer.current) {
      clearTimeout(pushTimer.current);
      pushTimer.current = null;
    }

    if (revealTimer.current) {
      clearTimeout(revealTimer.current);
      revealTimer.current = null;
    }
  }, []);

  useEffect(() => {
    return clearTimers;
  }, [clearTimers]);

  useEffect(() => {
    if (!pendingPathname.current || pathname !== pendingPathname.current) {
      return;
    }

    if (revealTimer.current) {
      clearTimeout(revealTimer.current);
    }

    revealTimer.current = setTimeout(() => {
      setIsCovering(false);
      pendingPathname.current = null;
      revealTimer.current = null;
    }, ROUTE_REVEAL_DELAY_MS);
  }, [pathname]);

  const navigate = useCallback(
    (href: string) => {
      const url = new URL(href, window.location.href);

      if (url.origin !== window.location.origin) {
        window.location.assign(url.href);
        return;
      }

      const targetPath = `${url.pathname}${url.search}${url.hash}`;
      const currentPath = `${window.location.pathname}${window.location.search}${window.location.hash}`;

      if (targetPath === currentPath) {
        return;
      }

      clearTimers();

      if (shouldReduceMotion) {
        router.push(targetPath);
        return;
      }

      pendingPathname.current = url.pathname;
      setIsCovering(true);

      pushTimer.current = setTimeout(() => {
        startNavigation(() => {
          router.push(targetPath);
        });
        pushTimer.current = null;
      }, NAVIGATION_DELAY_MS);
    },
    [clearTimers, router, shouldReduceMotion, startNavigation],
  );

  const contextValue = useMemo(() => ({ navigate }), [navigate]);

  return (
    <PageTransitionContext.Provider value={contextValue}>
      <div className="page-transition">{children}</div>
      <motion.div
        aria-hidden="true"
        className="route-transition-cover"
        initial={false}
        animate={{ opacity: isCovering ? 1 : 0 }}
        transition={{
          duration: 0.18,
          ease: "easeOut",
        }}
      />
    </PageTransitionContext.Provider>
  );
}
