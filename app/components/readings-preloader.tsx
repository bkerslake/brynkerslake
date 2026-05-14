"use client";

import { useEffect } from "react";
import { readingCoverPaths } from "../readings/books";

type IdleWindow = Window &
  typeof globalThis & {
    cancelIdleCallback?: (handle: number) => void;
    requestIdleCallback?: (
      callback: IdleRequestCallback,
      options?: IdleRequestOptions,
    ) => number;
  };

export function ReadingsPreloader() {
  useEffect(() => {
    const idleWindow = window as IdleWindow;

    const preload = () => {
      readingCoverPaths.forEach((cover) => {
        const image = new window.Image();
        image.decoding = "async";
        image.src = cover;
      });
    };

    if (idleWindow.requestIdleCallback) {
      const idleId = idleWindow.requestIdleCallback(preload, { timeout: 1800 });

      return () => {
        idleWindow.cancelIdleCallback?.(idleId);
      };
    }

    const timeoutId = globalThis.setTimeout(preload, 250);

    return () => {
      globalThis.clearTimeout(timeoutId);
    };
  }, []);

  return null;
}
