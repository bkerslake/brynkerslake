import type { Transition, TargetAndTransition } from "motion/react";

export const SWAP_TRANSITION: Transition = {
  duration: 0.18,
  ease: "easeOut",
};

type BlurSwapVariants = {
  initial: TargetAndTransition;
  animate: TargetAndTransition;
  exit: TargetAndTransition;
};

export function blurSwapVariants(
  shouldReduceMotion: boolean | null,
): BlurSwapVariants {
  if (shouldReduceMotion) {
    return {
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      exit: { opacity: 0 },
    };
  }

  return {
    initial: { opacity: 0, filter: "blur(6px)", y: 9 },
    animate: { opacity: 1, filter: "blur(0px)", y: 0 },
    exit: { opacity: 0, filter: "blur(6px)", y: -9 },
  };
}
