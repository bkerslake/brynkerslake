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
import { SWAP_TRANSITION } from "../lib/motion";
import { isSameOrigin, resolveHref, toRelativePath } from "../lib/navigation";
import { useTimeout } from "../lib/use-timeout";

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
  const pushTimer = useTimeout();
  const revealTimer = useTimeout();

  const clearTimers = useCallback(() => {
    pushTimer.clear();
    revealTimer.clear();
  }, [pushTimer, revealTimer]);

  useEffect(() => {
    if (!pendingPathname.current || pathname !== pendingPathname.current) {
      return;
    }

    revealTimer.start(() => {
      setIsCovering(false);
      pendingPathname.current = null;
    }, ROUTE_REVEAL_DELAY_MS);
  }, [pathname, revealTimer]);

  const navigate = useCallback(
    (href: string) => {
      const url = resolveHref(href);

      if (!isSameOrigin(url)) {
        window.location.assign(url.href);
        return;
      }

      const targetPath = toRelativePath(url);
      const currentPath = toRelativePath(window.location);

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

      pushTimer.start(() => {
        startNavigation(() => {
          router.push(targetPath);
        });
      }, NAVIGATION_DELAY_MS);
    },
    [clearTimers, pushTimer, router, shouldReduceMotion, startNavigation],
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
        transition={SWAP_TRANSITION}
      />
    </PageTransitionContext.Provider>
  );
}
