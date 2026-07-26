"use client";

import { usePathname } from "next/navigation";
import { BlurSwapText } from "./blur-swap-text";
import { TransitionLink } from "./transition-link";

type AnimatedCornerLinkProps = {
  href: string;
  label: string;
  position: "left" | "right";
};

function AnimatedCornerLink({ href, label, position }: AnimatedCornerLinkProps) {
  return (
    <TransitionLink
      className={`corner-link corner-link-${position}`}
      href={href}
      aria-label={`Go to ${label}`}
    >
      <BlurSwapText
        aria-hidden="true"
        classPrefix="corner-link"
        sizerText={label}
        swapKey={label}
      >
        {label}
      </BlurSwapText>
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
