import { useCallback, useEffect, useRef } from "react";

type TimeoutHandle = ReturnType<typeof setTimeout>;

export function useTimeout() {
  const timer = useRef<TimeoutHandle | null>(null);

  const clear = useCallback(() => {
    if (timer.current) {
      clearTimeout(timer.current);
      timer.current = null;
    }
  }, []);

  const start = useCallback(
    (callback: () => void, delayMs: number) => {
      clear();
      timer.current = setTimeout(() => {
        timer.current = null;
        callback();
      }, delayMs);
    },
    [clear],
  );

  useEffect(() => clear, [clear]);

  return { start, clear };
}
