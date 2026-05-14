"use client";

import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from "motion/react";
import type { PointerEvent, ReactNode } from "react";

type TiltProps = {
  children: ReactNode;
  className?: string;
  isReverse?: boolean;
  isRevese?: boolean;
  rotationFactor?: number;
};

export function Tilt({
  children,
  className,
  isRevese,
  isReverse = false,
  rotationFactor = 8,
}: TiltProps) {
  const shouldReduceMotion = useReducedMotion();
  const shouldReverse = isReverse || Boolean(isRevese);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateXRange = shouldReverse
    ? [-rotationFactor, rotationFactor]
    : [rotationFactor, -rotationFactor];
  const rotateYRange = shouldReverse
    ? [rotationFactor, -rotationFactor]
    : [-rotationFactor, rotationFactor];
  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], rotateXRange), {
    stiffness: 260,
    damping: 22,
  });
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], rotateYRange), {
    stiffness: 260,
    damping: 22,
  });

  const handlePointerMove = (event: PointerEvent<HTMLDivElement>) => {
    if (shouldReduceMotion) {
      return;
    }

    const rect = event.currentTarget.getBoundingClientRect();
    x.set((event.clientX - rect.left) / rect.width - 0.5);
    y.set((event.clientY - rect.top) / rect.height - 0.5);
  };

  const handlePointerLeave = () => {
    x.set(0);
    y.set(0);
  };

  if (shouldReduceMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={className}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      style={{
        rotateX,
        rotateY,
        transformPerspective: 900,
        transformStyle: "preserve-3d",
      }}
    >
      {children}
    </motion.div>
  );
}
