"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import type { ComponentProps, ReactNode } from "react";
import { SWAP_TRANSITION, blurSwapVariants } from "../lib/motion";

type BlurSwapTextProps = Omit<ComponentProps<"span">, "children"> & {
  classPrefix: string;
  sizerText: string;
  swapKey: string;
  children: ReactNode;
};

export function BlurSwapText({
  classPrefix,
  sizerText,
  swapKey,
  children,
  ...frameProps
}: BlurSwapTextProps) {
  const shouldReduceMotion = useReducedMotion();
  const variants = blurSwapVariants(shouldReduceMotion);

  return (
    <span className={`${classPrefix}-text-frame`} {...frameProps}>
      <span className={`${classPrefix}-text-sizer`}>{sizerText}</span>
      <AnimatePresence initial={false} mode="popLayout">
        <motion.span
          className={`${classPrefix}-text`}
          key={swapKey}
          initial={variants.initial}
          animate={variants.animate}
          exit={variants.exit}
          transition={SWAP_TRANSITION}
        >
          {children}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}
