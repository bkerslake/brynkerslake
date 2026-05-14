"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { usePathname } from "next/navigation";
import { TransitionLink } from "./transition-link";

type AnimatedCornerLinkProps = {
  href: string;
  label: string;
  position: "left" | "right";
};

function AnimatedCornerLink({ href, label, position }: AnimatedCornerLinkProps) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <TransitionLink
      className={`corner-link corner-link-${position}`}
      href={href}
      aria-label={`Go to ${label}`}
    >
      <span className="corner-link-text-frame" aria-hidden="true">
        <span className="corner-link-text-sizer">{label}</span>
        <AnimatePresence initial={false} mode="popLayout">
          <motion.span
            className="corner-link-text"
            key={label}
            initial={
              shouldReduceMotion
                ? { opacity: 0 }
                : {
                    opacity: 0,
                    filter: "blur(6px)",
                    y: 9,
                  }
            }
            animate={
              shouldReduceMotion
                ? { opacity: 1 }
                : {
                    opacity: 1,
                    filter: "blur(0px)",
                    y: 0,
                  }
            }
            exit={
              shouldReduceMotion
                ? { opacity: 0 }
                : {
                    opacity: 0,
                    filter: "blur(6px)",
                    y: -9,
                  }
            }
            transition={{
              duration: 0.18,
              ease: "easeOut",
            }}
          >
            {label}
          </motion.span>
        </AnimatePresence>
      </span>
    </TransitionLink>
  );
}

export function CornerNavLink() {
  const pathname = usePathname();
  const isWorkPage = pathname === "/work";
  const isReadingsPage = pathname === "/readings";

  return (
    <>
      <AnimatedCornerLink
        href={isReadingsPage ? "/" : "/readings"}
        label={isReadingsPage ? "Home" : "Readings"}
        position="left"
      />
      <AnimatedCornerLink
        href={isWorkPage ? "/" : "/work"}
        label={isWorkPage ? "Home" : "Work"}
        position="right"
      />
    </>
  );
}
